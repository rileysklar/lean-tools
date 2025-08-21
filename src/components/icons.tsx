import {
  ExclamationTriangleIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BlendingModeIcon,
  CardStackIcon,
  FileIcon,
  FileTextIcon,
  QuestionMarkCircledIcon,
  ImageIcon,
  LaptopIcon,
  DashboardIcon,
  ReloadIcon,
  EnterIcon,
  BackpackIcon,
  MoonIcon,
  DotsVerticalIcon,
  CircleIcon,
  PlusIcon,
  GearIcon,
  SunIcon,
  TrashIcon,
  TwitterLogoIcon,
  PersonIcon,
  AvatarIcon,
  Pencil1Icon,
  CrossCircledIcon,
  Cross1Icon,
  DragHandleDots2Icon,
  GitHubLogoIcon,
  MagicWandIcon
} from '@radix-ui/react-icons';
import * as React from 'react';

export type Icon = React.ComponentType<any>;

// Create wrapper functions that use React.createElement to bypass React 19 type issues
const createIconWrapper = (IconComponent: any) => {
  const WrappedIcon = (props: any) => React.createElement(IconComponent, props);
  WrappedIcon.displayName = `Wrapped${IconComponent.displayName || IconComponent.name || 'Icon'}`;
  return WrappedIcon;
};

export const Icons = {
  dashboard: createIconWrapper(DashboardIcon),
  logo: createIconWrapper(BlendingModeIcon),
  login: createIconWrapper(EnterIcon),
  close: createIconWrapper(Cross1Icon),
  product: createIconWrapper(BackpackIcon),
  spinner: createIconWrapper(ReloadIcon),
  kanban: createIconWrapper(DragHandleDots2Icon),
  chevronLeft: createIconWrapper(ChevronLeftIcon),
  chevronRight: createIconWrapper(ChevronRightIcon),
  trash: createIconWrapper(TrashIcon),
  employee: createIconWrapper(CrossCircledIcon),
  post: createIconWrapper(FileTextIcon),
  page: createIconWrapper(FileIcon),
  userPen: createIconWrapper(Pencil1Icon),
  user2: createIconWrapper(AvatarIcon),
  media: createIconWrapper(ImageIcon),
  settings: createIconWrapper(GearIcon),
  billing: createIconWrapper(CardStackIcon),
  ellipsis: createIconWrapper(DotsVerticalIcon),
  add: createIconWrapper(PlusIcon),
  warning: createIconWrapper(ExclamationTriangleIcon),
  user: createIconWrapper(PersonIcon),
  arrowRight: createIconWrapper(ArrowRightIcon),
  help: createIconWrapper(QuestionMarkCircledIcon),
  pizza: createIconWrapper(CircleIcon),
  sun: createIconWrapper(SunIcon),
  moon: createIconWrapper(MoonIcon),
  laptop: createIconWrapper(LaptopIcon),
  github: createIconWrapper(GitHubLogoIcon),
  twitter: createIconWrapper(TwitterLogoIcon),
  check: createIconWrapper(CheckIcon),
  map: createIconWrapper(MagicWandIcon)
};
