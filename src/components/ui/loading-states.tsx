import React from 'react';
import { cn } from '@/lib/utils';
import { BaseLoadingProps } from '@/types/common';

/**
 * Loading spinner component with configurable size
 */
export function LoadingSpinner({
  size = 'md',
  className,
  ...props
}: BaseLoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div
      className={cn(
        'border-primary animate-spin rounded-full border-b-2',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

/**
 * Loading skeleton component with configurable lines
 */
export function LoadingSkeleton({
  lines = 3,
  className,
  ...props
}: BaseLoadingProps & { lines?: number }) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className='loading-skeleton h-4 w-full'
          style={{
            width: `${Math.max(60, 100 - i * 10)}%`
          }}
        />
      ))}
    </div>
  );
}

/**
 * Loading overlay that covers content while loading
 */
export function LoadingOverlay({
  isLoading,
  children,
  className,
  ...props
}: BaseLoadingProps & {
  isLoading: boolean;
  children: React.ReactNode;
}) {
  if (!isLoading) return <>{children}</>;

  return (
    <div className='relative'>
      {children}
      <div
        className={cn(
          'bg-background/80 absolute inset-0 flex items-center justify-center backdrop-blur-sm',
          className
        )}
        {...props}
      >
        <LoadingSpinner size='lg' />
      </div>
    </div>
  );
}

/**
 * Loading card component for consistent loading states
 */
export function LoadingCard({
  lines = 3,
  className,
  ...props
}: BaseLoadingProps & { lines?: number }) {
  return (
    <div className={cn('card-base p-6', className)} {...props}>
      <div className='space-y-4'>
        <div className='loading-skeleton h-6 w-1/3' />
        <LoadingSkeleton lines={lines} />
      </div>
    </div>
  );
}

/**
 * Loading button component
 */
export function LoadingButton({
  isLoading,
  children,
  className,
  ...props
}: BaseLoadingProps & {
  isLoading: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      className={cn(
        'btn-primary flex-center-gap',
        isLoading && 'cursor-not-allowed opacity-50',
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner size='sm' />}
      {children}
    </button>
  );
}
