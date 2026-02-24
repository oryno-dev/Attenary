/**
 * Feedback Form - Frontend JavaScript
 * 
 * Handles form validation, submission, and user feedback with API integration.
 */

// ============================================================================
// Configuration Constants
// ============================================================================

const CONFIG = {
    // API endpoint - Replace with your Google Apps Script web app URL
    API_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    
    // Validation constraints
    VALIDATION: {
        MIN_CONTENT_LENGTH: 10,
        MAX_CONTENT_LENGTH: 5000,
        MAX_EMAIL_LENGTH: 254
    },
    
    // Valid feedback types (must match backend)
    VALID_FEEDBACK_TYPES: ['bug_report', 'feature_request', 'general_feedback', 'other'],
    
    // Rate limiting configuration
    RATE_LIMIT: {
        MAX_SUBMISSIONS: 5,
        WINDOW_MS: 60000, // 1 minute
        STORAGE_KEY: 'feedback_submissions'
    },
    
    // UI configuration
    UI: {
        SUCCESS_MESSAGE_DURATION: 5000, // 5 seconds
        SCROLL_BEHAVIOR: 'smooth',
        SCROLL_BLOCK: 'center'
    },
    
    // Network error messages
    ERROR_MESSAGES: {
        NETWORK_ERROR: 'Unable to connect to server. Please check your internet connection.',
        TIMEOUT_ERROR: 'Request timed out. Please try again.',
        SERVER_ERROR: 'Server error. Please try again later.',
        RATE_LIMIT_ERROR: 'Too many submissions. Please wait before submitting again.',
        UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
        VALIDATION_ERROR: 'Please correct the errors in the form.'
    }
};

// RFC 5322 compliant email regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// ============================================================================
// DOM Elements
// ============================================================================

const elements = {
    form: null,
    feedbackType: null,
    email: null,
    content: null,
    submitBtn: null,
    successMessage: null,
    errorMessage: null,
    errorText: null,
    contentCounter: null,
    feedbackTypeError: null,
    emailError: null,
    contentError: null,
    submitStatus: null
};

// State management
let isSubmitting = false;

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize the form when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    attachEventListeners();
    updateCharCounter();
});

/**
 * Cache DOM element references
 */
function initializeElements() {
    elements.form = document.getElementById('feedback-form');
    elements.feedbackType = document.getElementById('feedback-type');
    elements.email = document.getElementById('email');
    elements.content = document.getElementById('content');
    elements.submitBtn = document.getElementById('submit-btn');
    elements.successMessage = document.getElementById('success-message');
    elements.errorMessage = document.getElementById('error-message');
    elements.errorText = document.getElementById('error-text');
    elements.contentCounter = document.getElementById('content-counter');
    elements.feedbackTypeError = document.getElementById('feedback-type-error');
    elements.emailError = document.getElementById('email-error');
    elements.contentError = document.getElementById('content-error');
    elements.submitStatus = document.getElementById('submit-status');
}

/**
 * Attach event listeners to form elements
 */
function attachEventListeners() {
    // Form submission
    elements.form.addEventListener('submit', handleSubmit);
    
    // Real-time validation on blur
    elements.feedbackType.addEventListener('change', () => validateField('feedbackType'));
    elements.email.addEventListener('blur', () => validateField('email'));
    elements.content.addEventListener('blur', () => validateField('content'));
    
    // Clear errors on input
    elements.feedbackType.addEventListener('change', () => clearFieldError('feedbackType'));
    elements.email.addEventListener('input', () => clearFieldError('email'));
    elements.content.addEventListener('input', () => {
        clearFieldError('content');
        updateCharCounter();
    });
    
    // Real-time character counter
    elements.content.addEventListener('input', updateCharCounter);
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate a specific field
 * @param {string} fieldName - Name of the field to validate
 * @returns {boolean} - Whether the field is valid
 */
function validateField(fieldName) {
    let result = { valid: true, message: '' };
    
    switch (fieldName) {
        case 'feedbackType':
            result = validateFeedbackType(elements.feedbackType.value);
            showFieldError('feedbackType', result.valid ? '' : result.message);
            break;
            
        case 'email':
            result = validateEmail(elements.email.value);
            showFieldError('email', result.valid ? '' : result.message);
            break;
            
        case 'content':
            result = validateContent(elements.content.value);
            showFieldError('content', result.valid ? '' : result.message);
            break;
    }
    
    return result.valid;
}

/**
 * Validate all form fields
 * @returns {boolean} - Whether all fields are valid
 */
function validateAllFields() {
    const feedbackTypeValid = validateField('feedbackType');
    const emailValid = validateField('email');
    const contentValid = validateField('content');
    
    return feedbackTypeValid && emailValid && contentValid;
}

/**
 * Validate feedback type
 * @param {string} value - Feedback type value
 * @returns {Object} - Validation result with valid flag and message
 */
function validateFeedbackType(value) {
    if (!value || value.trim() === '') {
        return { valid: false, message: 'Please select a feedback type' };
    }
    
    if (!CONFIG.VALID_FEEDBACK_TYPES.includes(value)) {
        return { valid: false, message: 'Invalid feedback type selected' };
    }
    
    return { valid: true };
}

/**
 * Validate email address (RFC 5322 compliant)
 * @param {string} email - Email address to validate
 * @returns {Object} - Validation result with valid flag and message
 */
function validateEmail(email) {
    if (!email || email.trim() === '') {
        return { valid: false, message: 'Email address is required' };
    }
    
    const trimmedEmail = email.trim();
    
    if (trimmedEmail.length > CONFIG.VALIDATION.MAX_EMAIL_LENGTH) {
        return { valid: false, message: `Email must be less than ${CONFIG.VALIDATION.MAX_EMAIL_LENGTH} characters` };
    }
    
    if (!EMAIL_REGEX.test(trimmedEmail)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    
    return { valid: true };
}

/**
 * Validate feedback content
 * @param {string} content - Feedback content to validate
 * @returns {Object} - Validation result with valid flag and message
 */
function validateContent(content) {
    if (!content || content.trim() === '') {
        return { valid: false, message: 'Feedback content is required' };
    }
    
    const trimmedContent = content.trim();
    
    if (trimmedContent.length < CONFIG.VALIDATION.MIN_CONTENT_LENGTH) {
        return { valid: false, message: `Content must be at least ${CONFIG.VALIDATION.MIN_CONTENT_LENGTH} characters` };
    }
    
    if (content.length > CONFIG.VALIDATION.MAX_CONTENT_LENGTH) {
        return { valid: false, message: `Content must not exceed ${CONFIG.VALIDATION.MAX_CONTENT_LENGTH} characters` };
    }
    
    return { valid: true };
}

// ============================================================================
// Error Display Functions
// ============================================================================

/**
 * Show error message for a specific field
 * @param {string} fieldName - Name of the field
 * @param {string} message - Error message to display
 */
function showFieldError(fieldName, message) {
    const errorElement = elements[`${fieldName}Error`];
    const inputElement = elements[fieldName];
    
    if (errorElement) {
        errorElement.textContent = message;
    }
    
    if (inputElement) {
        if (message) {
            inputElement.classList.add('error');
            inputElement.setAttribute('aria-invalid', 'true');
        } else {
            inputElement.classList.remove('error');
            inputElement.removeAttribute('aria-invalid');
        }
    }
}

/**
 * Clear error message for a specific field
 * @param {string} fieldName - Name of the field
 */
function clearFieldError(fieldName) {
    showFieldError(fieldName, '');
}

/**
 * Show global error message
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
    elements.errorText.textContent = message;
    elements.errorMessage.hidden = false;
    elements.successMessage.hidden = true;
    
    // Scroll to error message
    scrollToElement(elements.errorMessage);
}

/**
 * Show global success message
 */
function showSuccessMessage() {
    elements.successMessage.hidden = false;
    elements.errorMessage.hidden = true;
    
    // Scroll to success message
    scrollToElement(elements.successMessage);
    
    // Auto-hide after configured duration
    setTimeout(() => {
        elements.successMessage.hidden = true;
    }, CONFIG.UI.SUCCESS_MESSAGE_DURATION);
}

/**
 * Hide all messages
 */
function hideMessages() {
    elements.successMessage.hidden = true;
    elements.errorMessage.hidden = true;
}

/**
 * Scroll to an element
 * @param {HTMLElement} element - Element to scroll to
 */
function scrollToElement(element) {
    element.scrollIntoView({
        behavior: CONFIG.UI.SCROLL_BEHAVIOR,
        block: CONFIG.UI.SCROLL_BLOCK
    });
}

// ============================================================================
// Character Counter
// ============================================================================

/**
 * Update the character counter for the content field
 */
function updateCharCounter() {
    const content = elements.content.value;
    const length = content.length;
    const max = CONFIG.VALIDATION.MAX_CONTENT_LENGTH;
    
    elements.contentCounter.textContent = `${length} / ${max}`;
    
    // Update counter styling based on length
    elements.contentCounter.classList.remove('warning', 'error');
    
    if (length > max) {
        elements.contentCounter.classList.add('error');
    } else if (length > max * 0.9) {
        elements.contentCounter.classList.add('warning');
    }
}

// ============================================================================
// Loading State Management
// ============================================================================

/**
 * Set the loading state of the form
 * @param {boolean} loading - Whether the form is in loading state
 */
function setLoadingState(loading) {
    isSubmitting = loading;
    
    // Update button state
    elements.submitBtn.disabled = loading;
    elements.submitBtn.classList.toggle('loading', loading);
    
    // Toggle button text and spinner visibility
    const buttonText = elements.submitBtn.querySelector('.button-text');
    const loadingSpinner = elements.submitBtn.querySelector('.loading-spinner');
    
    if (loading) {
        buttonText.setAttribute('hidden', '');
        loadingSpinner.hidden = false;
        elements.submitStatus.textContent = 'Submitting feedback...';
    } else {
        buttonText.removeAttribute('hidden');
        loadingSpinner.hidden = true;
        elements.submitStatus.textContent = 'Ready to submit';
    }
    
    // Disable form inputs during submission
    elements.feedbackType.disabled = loading;
    elements.email.disabled = loading;
    elements.content.disabled = loading;
}

// ============================================================================
// Rate Limiting
// ============================================================================

/**
 * Check if the user has exceeded the rate limit
 * @returns {Object} - Object with allowed flag and retryAfter time if limited
 */
function checkRateLimit() {
    const submissions = JSON.parse(
        localStorage.getItem(CONFIG.RATE_LIMIT.STORAGE_KEY) || '[]'
    );
    
    const now = Date.now();
    const recentSubmissions = submissions.filter(
        time => now - time < CONFIG.RATE_LIMIT.WINDOW_MS
    );
    
    if (recentSubmissions.length >= CONFIG.RATE_LIMIT.MAX_SUBMISSIONS) {
        const oldestSubmission = recentSubmissions[0];
        const retryAfter = CONFIG.RATE_LIMIT.WINDOW_MS - (now - oldestSubmission);
        
        return {
            allowed: false,
            retryAfter: Math.ceil(retryAfter / 1000) // Convert to seconds
        };
    }
    
    return { allowed: true };
}

/**
 * Record a submission for rate limiting
 */
function recordSubmission() {
    const submissions = JSON.parse(
        localStorage.getItem(CONFIG.RATE_LIMIT.STORAGE_KEY) || '[]'
    );
    
    submissions.push(Date.now());
    
    // Keep only submissions within the window
    const now = Date.now();
    const recentSubmissions = submissions.filter(
        time => now - time < CONFIG.RATE_LIMIT.WINDOW_MS
    );
    
    localStorage.setItem(CONFIG.RATE_LIMIT.STORAGE_KEY, JSON.stringify(recentSubmissions));
}

// ============================================================================
// API Integration
// ============================================================================

/**
 * Generate ISO 8601 timestamp
 * @returns {string} - Current timestamp in ISO 8601 format
 */
function generateTimestamp() {
    return new Date().toISOString();
}

/**
 * Build the request payload
 * @returns {Object} - Payload object for API request
 */
function buildPayload() {
    return {
        feedbackType: elements.feedbackType.value,
        email: elements.email.value.trim().toLowerCase(),
        content: elements.content.value.trim(),
        timestamp: generateTimestamp(),
        metadata: {
            userAgent: navigator.userAgent,
            referrer: document.referrer || window.location.href,
            screenResolution: `${window.screen.width}x${window.screen.height}`
        }
    };
}

/**
 * Submit feedback to the API
 * @param {Object} payload - The payload to submit
 * @returns {Promise<Object>} - Response from the API
 */
async function submitFeedback(payload) {
    const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    
    // Parse response
    const data = await response.json();
    
    // Check for HTTP errors
    if (!response.ok) {
        throw {
            status: response.status,
            data: data
        };
    }
    
    return data;
}

/**
 * Handle API errors
 * @param {Error|Object} error - The error that occurred
 */
function handleApiError(error) {
    console.error('Feedback submission error:', error);
    
    // Handle structured error responses
    if (error.data && error.data.error) {
        const apiError = error.data.error;
        
        // Handle validation errors from server
        if (apiError.details && Array.isArray(apiError.details)) {
            apiError.details.forEach(detail => {
                if (detail.field) {
                    showFieldError(detail.field, detail.message);
                }
            });
            showErrorMessage(CONFIG.ERROR_MESSAGES.VALIDATION_ERROR);
            return;
        }
        
        // Handle rate limit error
        if (error.status === 429 || apiError.code === 'RAT_001') {
            showErrorMessage(CONFIG.ERROR_MESSAGES.RATE_LIMIT_ERROR);
            return;
        }
        
        // Handle other API errors
        showErrorMessage(apiError.message || CONFIG.ERROR_MESSAGES.SERVER_ERROR);
        return;
    }
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showErrorMessage(CONFIG.ERROR_MESSAGES.NETWORK_ERROR);
        return;
    }
    
    // Handle timeout
    if (error.name === 'AbortError') {
        showErrorMessage(CONFIG.ERROR_MESSAGES.TIMEOUT_ERROR);
        return;
    }
    
    // Handle unknown errors
    showErrorMessage(CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR);
}

// ============================================================================
// Form Submission Handler
// ============================================================================

/**
 * Handle form submission
 * @param {Event} event - Submit event
 */
async function handleSubmit(event) {
    event.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) {
        return;
    }
    
    // Hide any existing messages
    hideMessages();
    
    // Check rate limit
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
        showErrorMessage(
            `${CONFIG.ERROR_MESSAGES.RATE_LIMIT_ERROR} Please wait ${rateLimitCheck.retryAfter} seconds.`
        );
        return;
    }
    
    // Validate all fields
    if (!validateAllFields()) {
        showErrorMessage(CONFIG.ERROR_MESSAGES.VALIDATION_ERROR);
        
        // Scroll to first error
        const firstError = document.querySelector('.field-error:not(:empty)');
        if (firstError) {
            scrollToElement(firstError);
        }
        return;
    }
    
    // Build payload
    const payload = buildPayload();
    
    // Set loading state
    setLoadingState(true);
    
    try {
        // Submit to API
        const response = await submitFeedback(payload);
        
        // Record successful submission for rate limiting
        recordSubmission();
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        elements.form.reset();
        updateCharCounter();
        
    } catch (error) {
        // Handle error
        handleApiError(error);
        
        // Form data is preserved on error (inputs remain populated)
    } finally {
        // Reset loading state
        setLoadingState(false);
    }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Sanitize input for display (prevent XSS)
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
function sanitizeForDisplay(input) {
    const entityMap = {
        '&': '\u0026amp;',
        '<': '\u0026lt;',
        '>': '\u0026gt;',
        '"': '\u0026quot;',
        "'": '\u0026#39;'
    };
    
    return String(input).replace(/[&<>"']/g, function(char) { return entityMap[char]; });
}

/**
 * Sleep utility for delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after the delay
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
