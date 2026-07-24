/**
 * Regex patterns for frontend input validation.
 */
export const REGEX_PATTERNS = {
  // Username: 3 to 30 characters, alphanumeric and underscores only
  USERNAME: /^[a-zA-Z0-9_]{3,30}$/,

  // Email: Standard email format (e.g. user@example.com)
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // Name (First/Last name): 2 to 50 characters, letters, spaces, hyphens, apostrophes
  NAME: /^[a-zA-Z\s'-]{2,50}$/,

  // Phone: Exactly 10 digits
  PHONE: /^\d{10}$/,

  // Password: 6 to 50 characters
  PASSWORD: /^.{6,50}$/,

  // Salary: Non-negative number, optional up to 2 decimal places
  SALARY: /^\d+(\.\d{1,2})?$/,

  // Title / Name (Task, Project): 2 to 100 characters, alphanumeric and common punctuation
  TITLE: /^[a-zA-Z0-9\s\-_.,#&()]{2,100}$/,

  // Date: YYYY-MM-DD format
  DATE: /^\d{4}-\d{2}-\d{2}$/,
};

/**
 * Helper validation functions returning an error string or null if valid.
 */
export function validateUsername(value) {
  if (!value || !value.trim()) return 'Username is required.';
  if (!REGEX_PATTERNS.USERNAME.test(value.trim())) {
    return 'Username must be 3-30 characters (letters, numbers, and underscores only).';
  }
  return null;
}

export function validateEmail(value) {
  if (!value || !value.trim()) return 'Email address is required.';
  if (!REGEX_PATTERNS.EMAIL.test(value.trim())) {
    return 'Enter a valid email address (e.g., name@company.com).';
  }
  return null;
}

export function validateName(value, fieldLabel = 'Name') {
  if (!value || !value.trim()) return `${fieldLabel} is required.`;
  if (!REGEX_PATTERNS.NAME.test(value.trim())) {
    return `${fieldLabel} must be 2-50 characters (letters, spaces, hyphens, or apostrophes).`;
  }
  return null;
}

export function validatePhone(value) {
  if (!value || !value.trim()) return null; // Optional
  if (!REGEX_PATTERNS.PHONE.test(value.trim())) {
    return 'Phone number must contain exactly 10 digits.';
  }
  return null;
}

export function validatePassword(value, isRequired = true) {
  if (!value) {
    return isRequired ? 'Password is required.' : null;
  }
  if (!REGEX_PATTERNS.PASSWORD.test(value)) {
    return 'Password must be at least 6 characters long.';
  }
  return null;
}

export function validateSalary(value) {
  if (value === '' || value === null || value === undefined) return null; // Optional
  if (!REGEX_PATTERNS.SALARY.test(String(value).trim()) || Number(value) < 0) {
    return 'Salary must be a valid non-negative number.';
  }
  return null;
}

export function validateTitle(value, fieldLabel = 'Title') {
  if (!value || !value.trim()) return `${fieldLabel} is required.`;
  if (!REGEX_PATTERNS.TITLE.test(value.trim())) {
    return `${fieldLabel} must be between 2 and 100 valid characters.`;
  }
  return null;
}

export function validateDate(value, fieldLabel = 'Date') {
  if (!value) return null; // Optional unless required
  if (!REGEX_PATTERNS.DATE.test(value)) {
    return `${fieldLabel} must be a valid date in YYYY-MM-DD format.`;
  }
  return null;
}
