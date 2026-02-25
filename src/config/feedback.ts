/**
 * Feedback system configuration
 * 
 * Google Apps Script Web App URL
 * Replace with your actual deployed script ID
 * To deploy: 
 * 1. Go to script.google.com
 * 2. Create new project and paste the code from plans/feedback-backend/Code.gs
 * 3. Deploy > New deployment > Web app
 * 4. Copy the web app URL and replace below
 */
export const FEEDBACK_API_URL = 'https://script.google.com/macros/s/AKfycbz_FIcNy-jQj_7pE5Gtz5oO1-0WmnPX9wKUaaJjhlkOO7_MNRB7cHSIkKFNheuzXQbV5w/exec';

/**
 * Feedback validation constants
 */
export const FEEDBACK_CONFIG = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 5000,
  MAX_EMAIL_LENGTH: 254,
};
