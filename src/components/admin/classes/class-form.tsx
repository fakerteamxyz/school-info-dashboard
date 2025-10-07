'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Class, ClassFormData } from '@/lib/db';
import { classSchema } from '@/lib/validations';

interface ClassFormProps {
  classData?: Class | null;
  onSubmit: () => void;
  onCancel: () => void;
}

export function ClassForm({ classData, onSubmit, onCancel }: ClassFormProps) {
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      class_code: classData?.class_code || '',
      name: classData?.name || '',
      grade_level: classData?.grade_level || 1,
      academic_year: classData?.academic_year || new Date().getFullYear().toString(),
      room_number: classData?.room_number || '',
      max_students: classData?.max_students || 30,
      current_students: classData?.current_students || 0,
      homeroom_teacher_id: classData?.homeroom_teacher_id || '',
      description: classData?.description || '',
      status: classData?.status || 'active',
    },
  });

  const handleFormSubmit = async (data: ClassFormData) => {
    setLoading(true);
    try {
      const url = classData 
        ? `/api/admin/classes/${classData.id}`
        : '/api/admin/classes';
      
      const response = await fetch(url, {
        method: classData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        onSubmit();
      } else {
        const error = await response.json();
        console.error('Failed to save class:', error);
      }
    } catch (error) {
      console.error('Failed to save class:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate current academic year (e.g., "2024-2025")
  const getCurrentAcademicYear = () => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    return `${currentYear}-${nextYear}`;
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="class_code">Class Code *</Label>
              <Input
                id="class_code"
                {...register('class_code')}
                placeholder="e.g., 10A, 7B"
              />
              {errors.class_code && (
                <p className="text-sm text-red-600 mt-1">{errors.class_code.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="name">Class Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., Grade 10 - Section A"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="grade_level">Grade Level *</Label>
              <Select
                value={watch('grade_level')?.toString()}
                onValueChange={(value) => setValue('grade_level', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                    <SelectItem key={grade} value={grade.toString()}>
                      Grade {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.grade_level && (
                <p className="text-sm text-red-600 mt-1">{errors.grade_level.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="academic_year">Academic Year *</Label>
              <Input
                id="academic_year"
                {...register('academic_year')}
                placeholder="e.g., 2024-2025"
                defaultValue={getCurrentAcademicYear()}
              />
              {errors.academic_year && (
                <p className="text-sm text-red-600 mt-1">{errors.academic_year.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Class Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Class Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="room_number">Room Number</Label>
              <Input
                id="room_number"
                {...register('room_number')}
                placeholder="e.g., 101, A-205"
              />
            </div>

            <div>
              <Label htmlFor="max_students">Maximum Students *</Label>
              <Input
                id="max_students"
                type="number"
                min="1"
                max="50"
                {...register('max_students', { valueAsNumber: true })}
                placeholder="30"
              />
              {errors.max_students && (
                <p className="text-sm text-red-600 mt-1">{errors.max_students.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="homeroom_teacher_id">Homeroom Teacher</Label>
              <Select
                value={watch('homeroom_teacher_id')}
                onValueChange={(value) => setValue('homeroom_teacher_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Homeroom Teacher</SelectItem>
                  {/* In a real app, you'd fetch teachers from the API */}
                  <SelectItem value="teacher-1">John Smith</SelectItem>
                  <SelectItem value="teacher-2">Jane Doe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Optional description about the class..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : classData ? 'Update Class' : 'Create Class'}
        </Button>
      </div>
    </form>
  );
}