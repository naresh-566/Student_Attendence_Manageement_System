/**
 * AttendEase - Server-side Input Validation Utility
 * Demonstrates: NRD Lab Experiment 3 (Form Validation Logic)
 */

/**
 * Validate email format using RFC-compliant regex
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate Indian/standard mobile phone number (10 digits)
 */
const isValidPhone = (phone) => {
  if (!phone) return true; // Phone is optional in some tables
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

/**
 * Validate YYYY-MM-DD date format
 */
const isValidDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidDate
};
