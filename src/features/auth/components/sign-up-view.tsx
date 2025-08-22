import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignUp as ClerkSignUpForm } from '@clerk/nextjs';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { StarIcon } from '@radix-ui/react-icons';
import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignUpViewPage({ stars }: { stars: number }) {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        href='/examples/authentication'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4 hidden md:top-8 md:right-8'
        )}
      >
        Sign Up
      </Link>
      <div className='bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r overflow-hidden'>
        {/* YouTube Video Background */}
        <div className='absolute inset-0 w-full h-full'>
          <iframe
            src="https://www.youtube.com/embed/jeDmc1UkjT4?si=-KT7gieNSA-P1_Qz&autoplay=1&mute=1&loop=1&playlist=jeDmc1UkjT4&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&vq=hd1080&start=0&end=0&fs=0&iv_load_policy=3&cc_load_policy=0&disablekb=1&enablejsapi=0&origin=https://lean-tools.vercel.app"
            title="Background Video"
            className='absolute inset-0 w-[200%] h-[200%] -top-[50%] object-cover scale-110'
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {/* Dark overlay for better text readability */}
          <div className='absolute inset-0 bg-black/50' />
        </div>
        
        {/* Logo - positioned above video */}
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='mr-2 h-6 w-6'
          >
            <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
          </svg>
          Logo
        </div>
        
        {/* Testimonial - positioned above video */}
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
            Manufacturing efficiency isn’t just about making things faster—it’s about turning every bolt, byte, and breath of effort into something that counts twice as much.            </p>
            <footer className='text-sm'>Sign Up to get started</footer>
          </blockquote>
        </div>
      </div>
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          {/* github link  */}
          <Link
            className={cn('group inline-flex hover:text-yellow-200')}
            target='_blank'
            href={'https://api.github.com/repos/rileysklar/lean-tools'}
          >
            <div className='flex items-center'>
              <GitHubLogoIcon className='size-4' />
              <span className='ml-1 inline'>Star on GitHub</span>{' '}
            </div>
            <div className='ml-2 flex items-center gap-1 text-sm md:flex'>
              {React.createElement(StarIcon as any, {
                className: 'size-4 text-gray-500 transition-all duration-300 group-hover:text-yellow-300',
                fill: 'currentColor'
              })}
              <span className='font-display font-medium'>{stars}</span>
            </div>
          </Link>
          <ClerkSignUpForm
            redirectUrl="/dashboard/arc"
            initialValues={{
              emailAddress: 'your_mail+clerk_test@example.com'
            }}
          />
          <p className='text-muted-foreground px-8 text-center text-sm'>
            By clicking continue, you agree to our{' '}
            <Link
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
