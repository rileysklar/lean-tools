'use client';

import { HeroSection } from '@/components/hero';
import { FeaturesSection } from '@/components/features';
import { CTASection } from '@/components/cta';
import { useEffect } from 'react';

export default function WelcomePage() {
  // Control body overflow on mount
  useEffect(() => {
    document.body.classList.add('overflow-auto');
    return () => {
      document.body.classList.remove('overflow-auto');
    };
  }, []);

  return (
    <div className='min-h-screen'>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
