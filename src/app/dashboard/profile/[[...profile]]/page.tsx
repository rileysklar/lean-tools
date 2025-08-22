import ProfileViewPage from '@/features/profile/components/organization-view-page';
import { OrganizationSwitcher } from '@clerk/nextjs';

export const metadata = {
  title: 'Dashboard : Profile'
};

export default async function Page() {
  return <ProfileViewPage />;
}
