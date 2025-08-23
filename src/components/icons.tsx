import React from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  ChevronLeft,
  ChevronRight,
  Command,
  CreditCard,
  File,
  FileText,
  Github,
  HelpCircle,
  Image,
  Laptop,
  Loader2,
  Map,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  X,
  type LucideIcon as LucideIconType
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  logo: Command,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  gitHub: Github,
  twitter: Twitter,
  check: Check,
  // Add missing icons referenced in navigation
  userPen: User,
  user2: User,
  map: Map,
  chartBar: BarChart3
} as const;

// Create wrapper functions that use proper TypeScript types
const createIconWrapper = (IconComponent: LucideIconType) => {
  const WrappedIcon = (props: LucideProps) => <IconComponent {...props} />;
  return WrappedIcon;
};

// Export wrapped icons with proper typing
export const WrappedIcons = {
  logo: createIconWrapper(Icons.logo),
  close: createIconWrapper(Icons.close),
  spinner: createIconWrapper(Icons.spinner),
  chevronLeft: createIconWrapper(Icons.chevronLeft),
  chevronRight: createIconWrapper(Icons.chevronRight),
  trash: createIconWrapper(Icons.trash),
  post: createIconWrapper(Icons.post),
  page: createIconWrapper(Icons.page),
  media: createIconWrapper(Icons.media),
  settings: createIconWrapper(Icons.settings),
  billing: createIconWrapper(Icons.billing),
  ellipsis: createIconWrapper(Icons.ellipsis),
  add: createIconWrapper(Icons.add),
  warning: createIconWrapper(Icons.warning),
  user: createIconWrapper(Icons.user),
  arrowRight: createIconWrapper(Icons.arrowRight),
  help: createIconWrapper(Icons.help),
  pizza: createIconWrapper(Icons.pizza),
  sun: createIconWrapper(Icons.sun),
  moon: createIconWrapper(Icons.moon),
  laptop: createIconWrapper(Icons.laptop),
  gitHub: createIconWrapper(Icons.gitHub),
  twitter: createIconWrapper(Icons.twitter),
  check: createIconWrapper(Icons.check)
} as const;
