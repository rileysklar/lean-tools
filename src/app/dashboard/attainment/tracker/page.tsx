import { ProtectedRoute } from '@/components/auth/protected-route';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function TrackerPage() {
  return (
    <ProtectedRoute requiredPermission='attainment'>
      <div className='flex flex-1 flex-col'>
        <div className='flex-1 space-y-6 overflow-y-auto p-6'>
          <Card>
            <CardHeader>
              <CardTitle>
                <h1 className='text-2xl font-bold tracking-tight lg:text-3xl'>
                  Tracker
                </h1>
              </CardTitle>
              <CardDescription>
                <div className='mt-4 flex flex-col gap-2'>
                  <Skeleton className='h-4 w-64' />
                  <Skeleton className='h-4 w-48' />
                  <Skeleton className='h-4 w-32' />
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
