'use client';

import { Check, ChevronsUpDown, GalleryVerticalEnd } from 'lucide-react';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';

interface Tenant {
  id: string;
  name: string;
  imageUrl?: string | null;
}

export function OrgSwitcher({
  tenants,
  defaultTenant,
  onTenantSwitch
}: {
  tenants: Tenant[];
  defaultTenant?: Tenant;
  onTenantSwitch?: (tenantId: string) => void;
}) {
  // Debug logging
  console.log('OrgSwitcher - Props:', { tenants, defaultTenant });
  
  // Create a fallback tenant if none are available
  const fallbackTenant: Tenant = {
    id: 'fallback',
    name: 'Loading...',
    imageUrl: null
  };
  
  const [selectedTenant, setSelectedTenant] = React.useState<Tenant>(
    defaultTenant || tenants[0] || fallbackTenant
  );

  // Update selectedTenant when props change
  React.useEffect(() => {
    if (defaultTenant) {
      setSelectedTenant(defaultTenant);
    } else if (tenants.length > 0) {
      setSelectedTenant(tenants[0]);
    }
  }, [defaultTenant, tenants]);

  const handleTenantSwitch = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    if (onTenantSwitch) {
      onTenantSwitch(tenant.id);
    }
  };

  // Always render something, never return null
  if (!selectedTenant) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' disabled>
            <div className='bg-muted flex aspect-square size-8 items-center justify-center rounded-lg'>
              <span className='text-xs text-muted-foreground'>...</span>
            </div>
            <div className='flex flex-col gap-0.5 leading-none'>
              <span className='font-semibold'>Loading...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Get initials for the avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden'>
                {selectedTenant.imageUrl ? (
                  <img 
                    src={selectedTenant.imageUrl} 
                    alt={selectedTenant.name}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <span className='text-sm font-semibold'>
                    {getInitials(selectedTenant.name)}
                  </span>
                )}
              </div>
              <div className='flex flex-col gap-0.5 leading-none'>
                <span className='font-semibold'>Organization</span>
                <span className=''>{selectedTenant.name}</span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width]'
            align='start'
          >
            {tenants.map((tenant) => (
              <DropdownMenuItem
                key={tenant.id}
                onSelect={() => handleTenantSwitch(tenant)}
              >
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 rounded-full overflow-hidden'>
                    {tenant.imageUrl ? (
                      <img 
                        src={tenant.imageUrl} 
                        alt={tenant.name}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full bg-muted flex items-center justify-center text-xs'>
                        {getInitials(tenant.name)}
                      </div>
                    )}
                  </div>
                  {tenant.name}
                </div>
                {tenant.id === selectedTenant.id && (
                  <Check className='ml-auto' />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
