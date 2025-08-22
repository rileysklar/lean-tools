'use client';

import { OrganizationProfile } from '@clerk/nextjs';

export default function OrganizationPage() {
  return (
    <div className="flex w-full flex-col p-4 space-y-6 overflow-y-auto">
      <div className="w-full">
        <OrganizationProfile routing="hash" />
      </div>
    </div>
  );
}
