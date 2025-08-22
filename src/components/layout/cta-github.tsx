import React from 'react';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

export default function CtaGithub() {
  return (
    <Button variant='ghost' asChild size='sm' className='hidden sm:flex'>
      <a
        href='https://github.com/rileysklar/lean-tools'
        rel='noopener noreferrer'
        target='_blank'
        className='dark:text-foreground'
      >
        {React.createElement(Github as any)}
      </a>
    </Button>
  );
}
