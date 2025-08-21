"use client"

import { HeroSection } from '@/components/hero'
import { FeaturesSection } from '@/components/features'
import { CTASection } from '@/components/cta'
import { FooterSection } from '@/components/footer'

export default function WelcomePage() {
  return (
    <>
      <style jsx>{`
        :global(body) {
          overflow: auto !important;
        }
      `}</style>
      <div className="min-h-screen">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
        <FooterSection />
      </div>
    </>
  )
}
