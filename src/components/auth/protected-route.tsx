'use client';

import { AlertTriangle, Shield, UserCheck, Lock } from 'lucide-react';
import { useUserRole } from '@/hooks/use-user-role';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission:
    | 'attainment'
    | 'organization'
    | 'users'
    | 'reports'
    | 'settings'
    | 'profile';
  fallback?: React.ReactNode;
  showAccessDenied?: boolean;
}

export function ProtectedRoute({
  children,
  requiredPermission,
  fallback,
  showAccessDenied = true
}: ProtectedRouteProps) {
  const { userRole, canAccessAttainment, isLoaded, error } = useUserRole();

  // Log access attempts for security monitoring (in production, this would go to a logging service)
  useEffect(() => {
    if (isLoaded && error) {
      // In production, send to logging service like Sentry, LogRocket, etc.
      // For now, we'll just track the error state
    }
  }, [isLoaded, error]);

  // Show loading state while checking permissions
  if (!isLoaded) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='space-y-4 text-center'>
          <div className='border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2'></div>
          <p className='text-muted-foreground'>Checking permissions...</p>
          <div className='space-y-2'>
            <Skeleton className='mx-auto h-4 w-32' />
            <Skeleton className='mx-auto h-4 w-24' />
          </div>
        </div>
      </div>
    );
  }

  // Check if user has access to the required permission
  const hasAccess = (() => {
    switch (requiredPermission) {
      case 'attainment':
        return canAccessAttainment;
      case 'organization':
        return userRole === 'admin' || userRole === 'manager';
      case 'users':
        return userRole === 'admin' || userRole === 'manager';
      case 'reports':
        return (
          userRole === 'admin' ||
          userRole === 'manager' ||
          userRole === 'member'
        );
      case 'settings':
        return userRole === 'admin';
      case 'profile':
        return true; // Profile is always accessible
      default:
        return false;
    }
  })();

  if (!hasAccess) {
    if (!showAccessDenied) {
      return null;
    }

    return (
      fallback || (
        <div className='flex w-full flex-col space-y-6 overflow-y-auto p-4'>
          <Card className='border-red-200 bg-red-50'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-red-800'>
                <Lock className='h-5 w-5' />
                Access Denied
              </CardTitle>
              <CardDescription className='text-red-700'>
                You don&apos;t have permission to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-2 rounded-lg border border-red-200 bg-red-100 p-3'>
                <AlertTriangle className='h-4 w-4 text-red-600' />
                <div className='text-sm text-red-800'>
                  <p className='font-medium'>Current Role: {userRole}</p>
                  <p className='text-red-600'>
                    Required: {getRequiredRoleText(requiredPermission)}
                  </p>
                </div>
              </div>

              <div className='space-y-3'>
                <div className='text-sm text-red-700'>
                  <p className='font-medium'>What you can access:</p>
                  <ul className='mt-1 list-inside list-disc space-y-1'>
                    {getAccessibleFeatures(userRole).map((feature, index) => (
                      <li key={index} className='text-red-600'>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className='flex gap-2'>
                <Button asChild variant='outline'>
                  <Link href='/dashboard'>
                    <UserCheck className='mr-2 h-4 w-4' />
                    Back to Dashboard
                  </Link>
                </Button>
                <Button asChild>
                  <Link href='/dashboard/organization'>
                    <Shield className='mr-2 h-4 w-4' />
                    Request Access
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    );
  }

  return <>{children}</>;
}

function getRequiredRoleText(permission: string): string {
  switch (permission) {
    case 'attainment':
      return 'Admin, Manager, or Member';
    case 'organization':
      return 'Admin or Manager';
    case 'users':
      return 'Admin or Manager';
    case 'reports':
      return 'Admin, Manager, or Member';
    case 'settings':
      return 'Admin only';
    case 'profile':
      return 'Any authenticated user';
    default:
      return 'Admin';
  }
}

function getAccessibleFeatures(userRole: string): string[] {
  switch (userRole) {
    case 'admin':
      return [
        'All features and settings',
        'User management',
        'Organization settings',
        'Reports and analytics'
      ];
    case 'manager':
      return [
        'Attainment features',
        'Reports and analytics',
        'Basic organization access'
      ];
    case 'member':
      return ['Basic reports', 'Profile management'];
    default:
      return ['Profile management'];
  }
}
