import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'userPen',
    isActive: false,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['p', 'p']
      }
    ]
  },
  {
    title: 'Arc',
    url: '/dashboard/arc',
    icon: 'map', // Using map icon for Arc functionality
    shortcut: ['a', 'a'],
    isActive: true, // Make Arc the active/default route
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard/arc',
        shortcut: ['a', 'd']
      },
      {
        title: 'Map View',
        url: '/dashboard/arc/map',
        shortcut: ['a', 'm']
      }
    ]
  }
];

