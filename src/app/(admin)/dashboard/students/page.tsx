import { Suspense } from 'react';
import { StudentManagement } from '@/components/admin/students/student-management';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <p className="text-gray-600">
          Manage student enrollment and records
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <StudentManagement />
      </Suspense>
    </div>
  );
}