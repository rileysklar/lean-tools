import React from 'react';
import { z } from 'zod';

/**
 * Common validation rules that can be reused across forms
 */
export const commonValidations = {
  required: (value: string) =>
    value.trim().length > 0 || 'This field is required',

  email: (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email address',

  minLength: (min: number) => (value: string) =>
    value.length >= min || `Minimum ${min} characters required`,

  maxLength: (max: number) => (value: string) =>
    value.length <= max || `Maximum ${max} characters allowed`,

  password: (value: string) => {
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value))
      return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(value))
      return 'Password must contain at least one lowercase letter';
    if (!/\d/.test(value)) return 'Password must contain at least one number';
    return true;
  },

  phone: (value: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(value.replace(/\s/g, '')) || 'Invalid phone number';
  },

  url: (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return 'Invalid URL';
    }
  },

  numeric: (value: string) => !isNaN(Number(value)) || 'Must be a valid number',

  positive: (value: string) => Number(value) > 0 || 'Must be a positive number',

  range: (min: number, max: number) => (value: string) => {
    const num = Number(value);
    return (num >= min && num <= max) || `Must be between ${min} and ${max}`;
  }
};

/**
 * Common Zod schemas for form validation
 */
export const commonSchemas = {
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number'),
  url: z.string().url('Invalid URL'),
  numeric: z
    .string()
    .refine((val) => !isNaN(Number(val)), 'Must be a valid number'),
  required: z.string().min(1, 'This field is required')
};

/**
 * Utility function to validate a field with multiple rules
 */
export function validateField(
  value: string,
  rules: Array<(value: string) => string | true>
): string | null {
  for (const rule of rules) {
    const result = rule(value);
    if (result !== true) {
      return result;
    }
  }
  return null;
}

/**
 * Utility function to validate form data against a schema
 */
export function validateFormData<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error };
}

/**
 * Hook for form validation state management
 */
export function useFormValidation<T>(schema: z.ZodSchema<T>) {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isValid, setIsValid] = React.useState(false);

  const validate = React.useCallback(
    (data: unknown) => {
      const result = validateFormData(data, schema);

      if (result.success) {
        setErrors({});
        setIsValid(true);
        return { success: true, data: result.data };
      } else {
        const fieldErrors: Record<string, string> = {};
        result.errors.errors.forEach((error) => {
          if (error.path.length > 0) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
        setIsValid(false);
        return { success: false, errors: fieldErrors };
      }
    },
    [schema]
  );

  const clearErrors = React.useCallback(() => {
    setErrors({});
    setIsValid(false);
  }, []);

  const setFieldError = React.useCallback((field: string, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
    setIsValid(false);
  }, []);

  return {
    errors,
    isValid,
    validate,
    clearErrors,
    setFieldError
  };
}
