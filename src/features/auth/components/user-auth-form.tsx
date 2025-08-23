'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

export default function UserAuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailMode, setIsEmailMode] = useState(true);

  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!isLoaded) {
        throw new Error('Authentication system not ready');
      }

      if (isEmailMode) {
        // Handle email sign-in
        const result = await signIn.create({
          identifier: email,
          password
        });

        if (result.status === 'complete') {
          router.push('/dashboard/attainment');
        } else {
          throw new Error('Sign-in incomplete');
        }
      } else {
        // Handle password reset
        const result = await signIn.create({
          strategy: 'reset_password_email_code',
          identifier: email
        });

        if (result.status === 'needs_first_factor') {
          // Redirect to password reset page
          router.push('/auth/reset-password');
        } else {
          throw new Error('Password reset request failed');
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWithEmail = () => {
    setIsEmailMode(true);
    setError(null);
  };

  const handleForgotPassword = () => {
    setIsEmailMode(false);
    setError(null);
  };

  if (!isLoaded) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold'>
          {isEmailMode ? 'Sign In' : 'Reset Password'}
        </CardTitle>
        <CardDescription>
          {isEmailMode
            ? 'Enter your credentials to access your account'
            : 'Enter your email to receive a password reset link'}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {isEmailMode && (
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}

          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type='submit'
            className='w-full'
            disabled={isLoading || !email}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                {isEmailMode ? 'Signing In...' : 'Sending Reset Link...'}
              </>
            ) : isEmailMode ? (
              'Sign In'
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>

        <div className='space-y-2'>
          {isEmailMode ? (
            <Button
              variant='link'
              className='text-muted-foreground hover:text-primary h-auto w-full p-0 text-sm font-normal'
              onClick={handleForgotPassword}
              disabled={isLoading}
            >
              Forgot your password?
            </Button>
          ) : (
            <Button
              variant='link'
              className='text-muted-foreground hover:text-primary h-auto w-full p-0 text-sm font-normal'
              onClick={handleContinueWithEmail}
              disabled={isLoading}
            >
              Back to sign in
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
