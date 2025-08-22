'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
export function UserNav() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  
  const handleSignOut = async () => {
    try {
      await signOut({ redirectUrl: '/auth/sign-in' });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <UserAvatarProfile user={user} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-56'
          align='end'
          sideOffset={10}
          forceMount
        >
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm leading-none font-medium'>
                {user.fullName}
              </p>
              <p className='text-muted-foreground text-xs leading-none'>
                {user.emailAddresses[0].emailAddress}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem  onClick={() => router.push('/dashboard/organization')}>Organization</DropdownMenuItem>
            
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
