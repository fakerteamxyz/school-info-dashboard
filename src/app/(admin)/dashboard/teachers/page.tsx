import { Suspense } from 'react';
import { TeacherManagement } from '@/components/admin/teachers/teacher-management';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeachersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
        <p className="text-gray-600">
          Manage teacher records and assignments
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <TeacherManagement />
      </Suspense>
    </div>
  );
}