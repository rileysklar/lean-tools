import React from 'react';

/**
 * Base interface for all components that accept className and children
 */
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Base interface for button-like components
 */
export interface BaseButtonProps extends BaseComponentProps {
  variant?:
    | 'default'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'secondary'
    | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Base interface for card components
 */
export interface BaseCardProps extends BaseComponentProps {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  header?: React.ReactNode;
}

/**
 * Base interface for form components
 */
export interface BaseFormProps extends BaseComponentProps {
  onSubmit?: (data: any) => void;
  onReset?: () => void;
  loading?: boolean;
  error?: string | null;
}

/**
 * Base interface for loading states
 */
export interface BaseLoadingProps extends BaseComponentProps {
  isLoading?: boolean;
  loadingText?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Base interface for error states
 */
export interface BaseErrorProps extends BaseComponentProps {
  error?: string | null;
  onRetry?: () => void;
  showRetry?: boolean;
}

/**
 * Base interface for data display components
 */
export interface BaseDataProps<T = any> extends BaseComponentProps {
  data?: T;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onRefresh?: () => void;
}
