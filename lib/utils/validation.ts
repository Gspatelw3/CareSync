// ── Validation Utilities ──
// Reusable validation functions to eliminate duplication across forms

export interface ValidationResult {
  [key: string]: string;
}

/**
 * Validates a phone number format
 * Accepts formats: +91 98765 43210, 9876543210, (123) 456-7890
 */
export function validatePhone(phone: string): string | undefined {
  if (!phone.trim()) {
    return "Phone number is required.";
  }
  if (!/^[+]?[\d\s()-]+$/.test(phone)) {
    return "Please enter a valid phone number.";
  }
  return undefined;
}

/**
 * Validates an email address format
 */
export function validateEmail(email: string): string | undefined {
  if (!email.trim()) {
    return "Email is required.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address.";
  }
  return undefined;
}

/**
 * Validates a required string field
 */
export function validateRequired(value: string, fieldName: string): string | undefined {
  if (!value.trim()) {
    return `${fieldName} is required.`;
  }
  return undefined;
}

/**
 * Validates a number is within a range
 */
export function validateNumberRange(
  value: number | string,
  min: number,
  max: number,
  fieldName: string
): string | undefined {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num) || num < min || num > max) {
    return `Please enter a valid ${fieldName.toLowerCase()} (${min}-${max}).`;
  }
  return undefined;
}

/**
 * Validates that a number is not negative
 */
export function validateNonNegative(value: number | string, fieldName: string): string | undefined {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num) || num < 0) {
    return `${fieldName} cannot be negative.`;
  }
  return undefined;
}

/**
 * Validates age (0-150)
 */
export function validateAge(age: number | string): string | undefined {
  return validateNumberRange(age, 0, 150, "age");
}

/**
 * Combines multiple validation results
 */
export function combineValidations(...validations: (string | undefined)[]): ValidationResult {
  const result: ValidationResult = {};
  validations.forEach((error, index) => {
    if (error) {
      result[`field_${index}`] = error;
    }
  });
  return result;
}