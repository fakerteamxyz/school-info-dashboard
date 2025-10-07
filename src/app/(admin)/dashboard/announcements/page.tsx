import { Suspense } from 'react';
import { AnnouncementManagement } from '@/components/admin/announcements/announcement-management';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
        <p className="text-gray-600">
          Create and manage school announcements
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <AnnouncementManagement />
      </Suspense>
    </div>
  );
}