'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

interface Tenant {
  id: string;
  name: string;
  imageUrl?: string | null;
}

interface OrgSwitcherProps {
  tenants: Tenant[];
  defaultTenant: Tenant;
  onTenantSwitch: (tenantId: string) => void;
}

export function OrgSwitcher({
  tenants,
  defaultTenant,
  onTenantSwitch
}: OrgSwitcherProps) {
  const [selectedTenant, setSelectedTenant] = useState<Tenant>(defaultTenant);
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  // Update selected tenant when defaultTenant changes
  useEffect(() => {
    setSelectedTenant(defaultTenant);
  }, [defaultTenant]);

  const handleTenantSwitch = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsOpen(false);
    onTenantSwitch(tenant.id);
  };

  const getTenantFallback = (tenant: Tenant) => {
    if (tenant.id === 'loading') {
      return 'LD';
    }
    return tenant.name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          role='combobox'
          aria-expanded={isOpen}
          aria-label='Select a tenant'
          className={`hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 w-full px-2 ${isCollapsed ? 'w-8 justify-center px-2' : 'justify-between'}`}
        >
          <Avatar className='h-6 w-6'>
            <AvatarImage
              src={selectedTenant.imageUrl || undefined}
              alt={selectedTenant.name}
            />
            <AvatarFallback className='text-xs'>
              {getTenantFallback(selectedTenant)}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <span className='truncate'>{selectedTenant.name}</span>
          )}
          {!isCollapsed && <ChevronsUpDown className='ml-auto' />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 min-w-[200px]'>
        <DropdownMenuLabel>Select Organization</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tenants.map((tenant) => (
          <DropdownMenuItem
            key={tenant.id}
            onClick={() => handleTenantSwitch(tenant)}
            className='flex items-center gap-2'
          >
            <Avatar className='h-6 w-6'>
              <AvatarImage
                src={tenant.imageUrl || undefined}
                alt={tenant.name}
              />
              <AvatarFallback className='text-xs'>
                {getTenantFallback(tenant)}
              </AvatarFallback>
            </Avatar>
            <span className='truncate'>{tenant.name}</span>
            {selectedTenant.id === tenant.id && <Check className='ml-auto' />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
