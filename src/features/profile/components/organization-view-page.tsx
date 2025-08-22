'use client';

import { UserProfile } from '@clerk/nextjs';


export default function ProfileViewPage() {
  return (
    <div className='flex w-full flex-col p-4 space-y-6 overflow-y-auto'>
      <UserProfile />
    </div>
  );
}
