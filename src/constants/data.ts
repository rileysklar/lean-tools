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
      },
      {
        title: 'Org',
        url: '/dashboard/organization',
        icon: 'user2',
        shortcut: ['o', 'o']
      }
    ]
  },
  {
    title: 'Attainment',
    url: '/dashboard/attainment',
    icon: 'chartBar',
    shortcut: ['a', 'a'],
    isActive: true,
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard/attainment',
        shortcut: ['a', 'd']
      },
      {
        title: 'Tracker',
        url: '/dashboard/attainment/tracker',
        shortcut: ['a', 't']
      }
    ]
  }
];
