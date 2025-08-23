'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary component for catching React errors
 * Provides graceful error handling and recovery options
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Replace with proper error logging service (e.g., Sentry)
      // For now, we'll suppress console logging in production
      // In a real app, this would send to Sentry, LogRocket, etc.
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback error={this.state.error} onReset={this.handleReset} />
      );
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component
 */
export function ErrorFallback({
  error,
  onReset
}: {
  error?: Error;
  onReset?: () => void;
}) {
  return (
    <Card className='mx-auto mt-8 max-w-md'>
      <CardHeader className='text-center'>
        <div className='bg-destructive/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
          <AlertTriangle className='text-destructive h-6 w-6' />
        </div>
        <CardTitle>Something went wrong</CardTitle>
        <CardDescription>
          An unexpected error occurred. Please try again or contact support if
          the problem persists.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {error && (
          <details className='text-sm'>
            <summary className='text-muted-foreground hover:text-foreground cursor-pointer'>
              Error details
            </summary>
            <pre className='bg-muted mt-2 overflow-auto rounded p-2 text-xs'>
              {error.message}
            </pre>
          </details>
        )}

        <div className='flex gap-2'>
          {onReset && (
            <Button onClick={onReset} className='flex-1'>
              <RefreshCw className='mr-2 h-4 w-4' />
              Try Again
            </Button>
          )}
          <Button
            variant='outline'
            className='flex-1'
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Hook for using error boundaries in functional components
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const throwError = React.useCallback((err: Error) => {
    setError(err);
  }, []);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  if (error) {
    throw error;
  }

  return { throwError, resetError };
}
