/**
 * Input validation utilities
 */

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password) => {
  // At least 6 characters for this demo
  // In production, enforce stronger requirements
  return password && password.length >= 6;
};

/**
 * Validate required fields
 */
export const validateRequired = (fields, data) => {
  const errors = [];

  fields.forEach((field) => {
    if (!data[field] || data[field].trim() === '') {
      errors.push({
        field,
        message: `${field} is required`,
      });
    }
  });

  return errors;
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  // Remove potential XSS characters
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .slice(0, 255); // Limit length
};

/**
 * Validate login input
 */
export const validateLoginInput = (email, password) => {
  const errors = [];

  if (!email || email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (!password || password.trim() === '') {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (!isValidPassword(password)) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 6 characters',
    });
  }

  return errors;
};

/**
 * Validate registration input
 */
export const validateRegisterInput = (email, password, name) => {
  const errors = validateLoginInput(email, password);

  if (!name || name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (name.length < 2) {
    errors.push({
      field: 'name',
      message: 'Name must be at least 2 characters',
    });
  } else if (name.length > 50) {
    errors.push({
      field: 'name',
      message: 'Name must not exceed 50 characters',
    });
  }

  return errors;
};

export default {
  isValidEmail,
  isValidPassword,
  validateRequired,
  sanitizeInput,
  validateLoginInput,
  validateRegisterInput,
};
