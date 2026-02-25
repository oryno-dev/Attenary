/**
 * Feedback System - Google Apps Script Backend
 * 
 * This script handles feedback form submissions and stores them in Google Sheets.
 * It provides validation, rate limiting, and CORS support.
 */

// ============================================================================
// Configuration Constants
// ============================================================================

const CONFIG = {
  // Sheet configuration
  SHEET_NAME: 'Feedback Submissions',
  
  // Valid feedback types (display names)
  VALID_FEEDBACK_TYPES: ['Bug Report', 'Feature Request', 'General Feedback', 'Other'],
  
  // Valid feedback type API values (snake_case)
  VALID_FEEDBACK_TYPES_API: ['bug_report', 'feature_request', 'general_feedback', 'other'],
  
  // Mapping from API values to display names
  FEEDBACK_TYPE_MAP: {
    'bug_report': 'Bug Report',
    'feature_request': 'Feature Request',
    'general_feedback': 'General Feedback',
    'other': 'Other'
  },
  
  // Content validation
  MIN_CONTENT_LENGTH: 10,
  MAX_CONTENT_LENGTH: 5000,
  MAX_EMAIL_LENGTH: 254,
  
  // Rate limiting
  RATE_LIMIT: {
    MAX_SUBMISSIONS: 5,
    WINDOW_MS: 60000 // 1 minute
  },
  
  // Column indices (0-based)
  COLUMNS: {
    ID: 0,
    TIMESTAMP: 1,
    FEEDBACK_TYPE: 2,
    EMAIL: 3,
    CONTENT: 4,
    USER_AGENT: 5,
    REFERRER: 6,
    SCREEN_RESOLUTION: 7,
    STATUS: 8,
    NOTES: 9
  }
};

// Error codes
const ERROR_CODES = {
  // Validation errors
  VAL_MISSING_FIELD: 'VAL_001',
  VAL_INVALID_EMAIL: 'VAL_002',
  VAL_INVALID_TYPE: 'VAL_003',
  VAL_CONTENT_TOO_SHORT: 'VAL_004',
  VAL_CONTENT_TOO_LONG: 'VAL_005',
  VAL_INVALID_TIMESTAMP: 'VAL_006',
  
  // Server errors
  SRV_SHEET_ERROR: 'SRV_001',
  SRV_INTERNAL: 'SRV_002',
  SRV_PARSE_ERROR: 'SRV_003',
  
  // Rate limiting
  RAT_LIMIT_EXCEEDED: 'RAT_001',
  
  // Method errors
  METHOD_NOT_ALLOWED: 'MET_001'
};

// ============================================================================
// Main Request Handlers
// ============================================================================

/**
 * Handle GET requests - Health check endpoint
 * @param {Object} e - Event object from Apps Script
 * @returns {TextOutput} JSON response
 */
function doGet(e) {
  const responseData = {
    success: true,
    message: 'Feedback API is running',
    data: {
      service: 'Feedback System API',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }
  };
  
  return createJsonResponse(responseData);
}

/**
 * Handle OPTIONS requests - CORS preflight
 * @param {Object} e - Event object from Apps Script
 * @returns {TextOutput} Empty response with CORS headers
 */
function doOptions(e) {
  var output = ContentService.createTextOutput('');
  output.setHeader('Access-Control-Allow-Origin', '*');
  output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  output.setHeader('Access-Control-Max-Age', '3600');
  return output;
}

/**
 * Handle POST requests - Feedback submission endpoint
 * @param {Object} e - Event object from Apps Script
 * @returns {TextOutput} JSON response
 */
function doPost(e) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIdentifier(e);
    
    // Check rate limit
    const rateLimitResult = checkServerRateLimit(clientIp);
    if (!rateLimitResult.allowed) {
      return createErrorResponse(
        ERROR_CODES.RAT_LIMIT_EXCEEDED,
        'Too many requests. Please wait before submitting again.',
        null,
        429
      );
    }
    
    // Parse request body
    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return createErrorResponse(
        ERROR_CODES.SRV_PARSE_ERROR,
        'Invalid JSON payload',
        null,
        400
      );
    }
    
    // Validate payload
    const validation = validatePayload(payload);
    if (!validation.isValid) {
      return createErrorResponse(
        ERROR_CODES.VAL_MISSING_FIELD,
        'Invalid request payload',
        validation.errors,
        400
      );
    }
    
    // Sanitize payload
    const sanitizedPayload = sanitizePayload(payload);
    
    // Store in Google Sheets
    const storeResult = storeFeedback(sanitizedPayload);
    if (!storeResult.success) {
      return createErrorResponse(
        ERROR_CODES.SRV_SHEET_ERROR,
        'Failed to store feedback',
        null,
        500
      );
    }
    
    // Return success response
    const responseData = {
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        recordId: storeResult.recordId,
        submittedAt: storeResult.timestamp
      }
    };
    
    return createJsonResponse(responseData);
    
  } catch (error) {
    // Log unexpected error
    logError(error, 'doPost');
    
    return createErrorResponse(
      ERROR_CODES.SRV_INTERNAL,
      'An unexpected error occurred. Please try again later.',
      null,
      500
    );
  }
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate the entire payload
 * @param {Object} payload - Request payload
 * @returns {Object} Validation result with isValid and errors array
 */
function validatePayload(payload) {
  const errors = [];
  
  // Check required fields
  const requiredFields = ['feedbackType', 'email', 'content', 'timestamp'];
  for (const field of requiredFields) {
    if (!payload[field] || (typeof payload[field] === 'string' && payload[field].trim() === '')) {
      errors.push({
        field: field,
        message: field + ' is required'
      });
    }
  }
  
  // Validate feedback type
  if (payload.feedbackType && !CONFIG.VALID_FEEDBACK_TYPES_API.includes(payload.feedbackType)) {
    errors.push({
      field: 'feedbackType',
      message: 'Invalid feedback type. Must be one of: ' + CONFIG.VALID_FEEDBACK_TYPES_API.join(', ')
    });
  }
  
  // Validate email
  if (payload.email) {
    const emailValidation = validateEmail(payload.email);
    if (!emailValidation.valid) {
      errors.push({
        field: 'email',
        message: emailValidation.message
      });
    }
  }
  
  // Validate content
  if (payload.content) {
    const contentValidation = validateContent(payload.content);
    if (!contentValidation.valid) {
      errors.push({
        field: 'content',
        message: contentValidation.message
      });
    }
  }
  
  // Validate timestamp
  if (payload.timestamp) {
    const timestampValidation = validateTimestamp(payload.timestamp);
    if (!timestampValidation.valid) {
      errors.push({
        field: 'timestamp',
        message: timestampValidation.message
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validate email address (RFC 5322 compliant)
 * @param {string} email - Email address to validate
 * @returns {Object} Validation result
 */
function validateEmail(email) {
  if (!email || email.trim().length === 0) {
    return { valid: false, message: 'Email is required' };
  }
  
  if (email.length > CONFIG.MAX_EMAIL_LENGTH) {
    return { valid: false, message: 'Email must be less than ' + CONFIG.MAX_EMAIL_LENGTH + ' characters' };
  }
  
  // RFC 5322 compliant email regex
  var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Invalid email format' };
  }
  
  return { valid: true };
}

/**
 * Validate feedback content
 * @param {string} content - Feedback content to validate
 * @returns {Object} Validation result
 */
function validateContent(content) {
  if (!content || content.trim().length === 0) {
    return { valid: false, message: 'Feedback content is required' };
  }
  
  if (content.trim().length < CONFIG.MIN_CONTENT_LENGTH) {
    return { valid: false, message: 'Content must be at least ' + CONFIG.MIN_CONTENT_LENGTH + ' characters' };
  }
  
  if (content.length > CONFIG.MAX_CONTENT_LENGTH) {
    return { valid: false, message: 'Content must not exceed ' + CONFIG.MAX_CONTENT_LENGTH + ' characters' };
  }
  
  return { valid: true };
}

/**
 * Validate timestamp
 * @param {string} timestamp - ISO 8601 timestamp to validate
 * @returns {Object} Validation result
 */
function validateTimestamp(timestamp) {
  if (!timestamp) {
    return { valid: false, message: 'Timestamp is required' };
  }
  
  var date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return { valid: false, message: 'Invalid timestamp format' };
  }
  
  var now = Date.now();
  
  // Ensure timestamp is not in the future (allow 5 minute clock skew)
  if (date.getTime() > now + (5 * 60 * 1000)) {
    return { valid: false, message: 'Timestamp cannot be in the future' };
  }
  
  // Ensure timestamp is within reasonable range (not older than 1 hour)
  var oneHourAgo = now - (60 * 60 * 1000);
  if (date.getTime() < oneHourAgo) {
    return { valid: false, message: 'Timestamp is too old' };
  }
  
  return { valid: true };
}

// ============================================================================
// Sanitization Functions
// ============================================================================

/**
 * Sanitize the entire payload
 * @param {Object} payload - Request payload
 * @returns {Object} Sanitized payload
 */
function sanitizePayload(payload) {
  var sanitizedMetadata = {};
  if (payload.metadata) {
    sanitizedMetadata = {
      userAgent: sanitizeText(payload.metadata.userAgent),
      referrer: sanitizeText(payload.metadata.referrer),
      screenResolution: sanitizeText(payload.metadata.screenResolution)
    };
  }
  
  return {
    feedbackType: payload.feedbackType,
    email: sanitizeEmail(payload.email),
    content: sanitizeHtml(payload.content),
    timestamp: payload.timestamp,
    metadata: sanitizedMetadata
  };
}

/**
 * Sanitize email address
 * @param {string} email - Email to sanitize
 * @returns {string} Sanitized email
 */
function sanitizeEmail(email) {
  return email.trim().toLowerCase();
}

/**
 * Sanitize HTML content - remove tags but preserve line breaks
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
function sanitizeHtml(input) {
  if (!input) return '';
  
  return input
    .replace(/<br\s*\/?>/gi, '\n')  // Preserve line breaks
    .replace(/<[^>]*>/g, '')         // Remove HTML tags
    .replace(/javascript:/gi, '')    // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '')      // Remove event handlers
    .trim();
}

/**
 * Sanitize plain text
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
function sanitizeText(input) {
  if (!input) return '';
  
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim();
}

// ============================================================================
// Rate Limiting
// ============================================================================

/**
 * Check server-side rate limit
 * @param {string} userIdentifier - Client identifier (IP or unique ID)
 * @returns {Object} Rate limit result with allowed boolean and retryAfter
 */
function checkServerRateLimit(userIdentifier) {
  var props = PropertiesService.getScriptProperties();
  var key = 'rate_' + userIdentifier;
  
  var data;
  try {
    var stored = props.getProperty(key);
    data = stored ? JSON.parse(stored) : { count: 0, reset: 0 };
  } catch (e) {
    data = { count: 0, reset: 0 };
  }
  
  var now = Date.now();
  
  // Reset window if expired
  if (now > data.reset) {
    data.count = 0;
    data.reset = now + CONFIG.RATE_LIMIT.WINDOW_MS;
  }
  
  // Check if limit exceeded
  if (data.count >= CONFIG.RATE_LIMIT.MAX_SUBMISSIONS) {
    return {
      allowed: false,
      retryAfter: data.reset - now
    };
  }
  
  // Increment counter
  data.count++;
  props.setProperty(key, JSON.stringify(data));
  
  return { allowed: true };
}

/**
 * Get client identifier from request
 * @param {Object} e - Event object from Apps Script
 * @returns {string} Client identifier
 */
function getClientIdentifier(e) {
  // Try to get IP from headers (if available)
  var headers = e.parameter || {};
  
  // Use a combination of available headers or fallback to a default
  if (headers['X-Forwarded-For']) {
    return headers['X-Forwarded-For'].split(',')[0].trim();
  }
  
  // Fallback: use a hash of user agent + timestamp window for basic rate limiting
  var userAgent = e.parameter ? (e.parameter['User-Agent'] || 'unknown') : 'unknown';
  var timeWindow = Math.floor(Date.now() / CONFIG.RATE_LIMIT.WINDOW_MS);
  
  return Utilities.base64Encode(userAgent + timeWindow).substring(0, 16);
}

// ============================================================================
// Google Sheets Integration
// ============================================================================

/**
 * Get or create the feedback sheet
 * @returns {Sheet} The feedback sheet
 */
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet) {
    // Create new sheet
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    
    // Set up headers
    var headers = [
      'ID',
      'Timestamp',
      'Feedback Type',
      'Email',
      'Content',
      'User Agent',
      'Referrer',
      'Screen Resolution',
      'Status',
      'Notes'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header row
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('#ffffff');
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    // Set column widths
    sheet.setColumnWidth(1, 80);   // ID
    sheet.setColumnWidth(2, 150);  // Timestamp
    sheet.setColumnWidth(3, 120);  // Feedback Type
    sheet.setColumnWidth(4, 200);  // Email
    sheet.setColumnWidth(5, 400);  // Content
    sheet.setColumnWidth(6, 250);  // User Agent
    sheet.setColumnWidth(7, 200);  // Referrer
    sheet.setColumnWidth(8, 100);  // Screen Resolution
    sheet.setColumnWidth(9, 100);  // Status
    sheet.setColumnWidth(10, 200); // Notes
    
    // Set up data validation for Feedback Type column
    var feedbackTypeValidation = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG.VALID_FEEDBACK_TYPES)
      .build();
    sheet.getRange(2, 3, 1000, 1).setDataValidation(feedbackTypeValidation);
    
    // Set up data validation for Status column
    var statusValidation = SpreadsheetApp.newDataValidation()
      .requireValueInList(['New', 'In Progress', 'Resolved', 'Closed'])
      .build();
    sheet.getRange(2, 9, 1000, 1).setDataValidation(statusValidation);
  }
  
  return sheet;
}

/**
 * Store feedback in Google Sheets
 * @param {Object} payload - Sanitized feedback payload
 * @returns {Object} Result with success, recordId, and timestamp
 */
function storeFeedback(payload) {
  try {
    var sheet = getOrCreateSheet();
    
    // Generate unique ID
    var lastRow = sheet.getLastRow();
    var newId = lastRow; // Auto-increment based on row number
    
    // Generate timestamp
    var timestamp = new Date().toISOString();
    
    // Map feedback type to display name
    var feedbackTypeDisplay = CONFIG.FEEDBACK_TYPE_MAP[payload.feedbackType] || payload.feedbackType;
    
    // Get metadata safely
    var userAgent = '';
    var referrer = '';
    var screenResolution = '';
    
    if (payload.metadata) {
      userAgent = payload.metadata.userAgent || '';
      referrer = payload.metadata.referrer || '';
      screenResolution = payload.metadata.screenResolution || '';
    }
    
    // Prepare row data
    var rowData = [
      newId,                // ID
      timestamp,            // Timestamp
      feedbackTypeDisplay,  // Feedback Type
      payload.email,        // Email
      payload.content,      // Content
      userAgent,            // User Agent
      referrer,             // Referrer
      screenResolution,     // Screen Resolution
      'New',                // Status (default)
      ''                    // Notes (empty)
    ];
    
    // Append row to sheet
    sheet.appendRow(rowData);
    
    return {
      success: true,
      recordId: 'row_' + newId,
      timestamp: timestamp
    };
    
  } catch (error) {
    logError(error, 'storeFeedback');
    return {
      success: false,
      error: error.message
    };
  }
}

// ============================================================================
// Response Helpers
// ============================================================================

/**
 * Create a JSON response with CORS headers
 * @param {Object} data - Response data
 * @returns {TextOutput} JSON text output
 */
function createJsonResponse(data) {
  var output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers to allow cross-origin requests
  output.setHeader('Access-Control-Allow-Origin', '*');
  output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  output.setHeader('Access-Control-Max-Age', '3600');
  
  return output;
}

/**
 * Create an error response
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {Array} details - Error details array
 * @param {number} statusCode - HTTP status code (for reference)
 * @returns {TextOutput} JSON text output with error
 */
function createErrorResponse(code, message, details, statusCode) {
  var response = {
    success: false,
    error: {
      code: code,
      message: message,
      details: details,
      timestamp: new Date().toISOString()
    }
  };
  
  // Note: Google Apps Script doesn't allow setting HTTP status codes directly
  // The status code is included in the response for client handling
  if (statusCode) {
    response.error.statusCode = statusCode;
  }
  
  return createJsonResponse(response);
}

// ============================================================================
// Logging
// ============================================================================

/**
 * Log error to console and optionally to a log sheet
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 */
function logError(error, context) {
  var logEntry = {
    timestamp: new Date().toISOString(),
    level: 'ERROR',
    context: context,
    error: {
      message: error.message,
      stack: error.stack
    }
  };
  
  // Log to Apps Script console
  console.error(JSON.stringify(logEntry, null, 2));
  
  // Optionally log to a dedicated error log sheet
  try {
    logToSheet(logEntry);
  } catch (e) {
    // Ignore logging errors to prevent infinite loops
    console.error('Failed to log to sheet: ' + e.message);
  }
}

/**
 * Log entry to a dedicated log sheet
 * @param {Object} logEntry - Log entry object
 */
function logToSheet(logEntry) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var logSheet = ss.getSheetByName('Error Log');
  
  if (!logSheet) {
    logSheet = ss.insertSheet('Error Log');
    logSheet.appendRow(['Timestamp', 'Level', 'Context', 'Error Message', 'Stack Trace']);
    logSheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  }
  
  logSheet.appendRow([
    logEntry.timestamp,
    logEntry.level,
    logEntry.context,
    logEntry.error.message,
    logEntry.error.stack
  ]);
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Test function to verify the script is working
 */
function testScript() {
  var testPayload = {
    feedbackType: 'bug_report',
    email: 'test@example.com',
    content: 'This is a test feedback submission with enough characters.',
    timestamp: new Date().toISOString(),
    metadata: {
      userAgent: 'Test Agent',
      referrer: 'https://test.com',
      screenResolution: '1920x1080'
    }
  };
  
  var validation = validatePayload(testPayload);
  console.log('Validation result:', JSON.stringify(validation));
  
  var sanitized = sanitizePayload(testPayload);
  console.log('Sanitized payload:', JSON.stringify(sanitized));
  
  var storeResult = storeFeedback(sanitized);
  console.log('Store result:', JSON.stringify(storeResult));
}