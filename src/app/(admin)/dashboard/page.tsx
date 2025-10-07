import { Suspense } from 'react';
import { DashboardStats } from '@/components/admin/dashboard/stats';
import { RecentActivity } from '@/components/admin/dashboard/recent-activity';
import { QuickActions } from '@/components/admin/dashboard/quick-actions';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to the School Information System
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
        <DashboardStats />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <RecentActivity />
          </Suspense>
        </div>
        
        <div>
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <QuickActions />
          </Suspense>
        </div>
      </div>
    </div>
  );
}