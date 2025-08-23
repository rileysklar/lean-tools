'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { useSignIn } from '@clerk/nextjs';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function GithubSignInButton() {
  const { signIn, isLoaded } = useSignIn();

  const [isLoading, setIsLoading] = useState(false);

  const handleGithubSignIn = async () => {
    if (!isLoaded) return;

    setIsLoading(true);

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_github',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard/attainment'
      });

      // The redirect will happen automatically, so we don't need to check status
    } catch (error) {
      // In production, send to error logging service
      // For now, just reset loading state
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <Button variant='outline' disabled className='w-full'>
        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        Loading...
      </Button>
    );
  }

  return (
    <Button
      variant='outline'
      onClick={handleGithubSignIn}
      disabled={isLoading}
      className='w-full'
    >
      {isLoading ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Signing in with GitHub...
        </>
      ) : (
        <>
          <Github />
          Continue with GitHub
        </>
      )}
    </Button>
  );
}
