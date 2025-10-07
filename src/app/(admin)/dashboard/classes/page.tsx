import { Suspense } from 'react';
import { ClassManagement } from '@/components/admin/classes/class-management';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
        <p className="text-gray-600">
          Manage class schedules and student assignments
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <ClassManagement />
      </Suspense>
    </div>
  );
}