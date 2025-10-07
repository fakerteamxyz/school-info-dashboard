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
import { Student, StudentFormData } from '@/lib/db';
import { studentSchema } from '@/lib/validations';
import { auth } from '@clerk/nextjs/server';

interface StudentFormProps {
  student?: Student | null;
  onSubmit: () => void;
  onCancel: () => void;
}

export function StudentForm({ student, onSubmit, onCancel }: StudentFormProps) {
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      student_id: student?.student_id || '',
      first_name: student?.first_name || '',
      last_name: student?.last_name || '',
      email: student?.email || '',
      phone: student?.phone || '',
      date_of_birth: student?.date_of_birth || '',
      address: student?.address || '',
      grade_level: student?.grade_level || 1,
      enrollment_date: student?.enrollment_date || new Date().toISOString().split('T')[0],
      status: student?.status || 'active',
      parent_name: student?.parent_name || '',
      parent_phone: student?.parent_phone || '',
      parent_email: student?.parent_email || '',
      emergency_contact: student?.emergency_contact || '',
    },
  });

  const handleFormSubmit = async (data: StudentFormData) => {
    setLoading(true);
    try {
      const url = student 
        ? `/api/admin/students/${student.id}`
        : '/api/admin/students';
      
      const response = await fetch(url, {
        method: student ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        onSubmit();
      } else {
        const error = await response.json();
        console.error('Failed to save student:', error);
      }
    } catch (error) {
      console.error('Failed to save student:', error);
    } finally {
      setLoading(false);
    }
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
              <Label htmlFor="student_id">Student ID *</Label>
              <Input
                id="student_id"
                {...register('student_id')}
                placeholder="e.g., STU001"
              />
              {errors.student_id && (
                <p className="text-sm text-red-600 mt-1">{errors.student_id.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  {...register('first_name')}
                  placeholder="John"
                />
                {errors.first_name && (
                  <p className="text-sm text-red-600 mt-1">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  {...register('last_name')}
                  placeholder="Doe"
                />
                {errors.last_name && (
                  <p className="text-sm text-red-600 mt-1">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+1234567890"
              />
            </div>

            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                {...register('date_of_birth')}
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                {...register('address')}
                placeholder="123 Main St, City, State"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="enrollment_date">Enrollment Date *</Label>
              <Input
                id="enrollment_date"
                type="date"
                {...register('enrollment_date')}
              />
              {errors.enrollment_date && (
                <p className="text-sm text-red-600 mt-1">{errors.enrollment_date.message}</p>
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
                  <SelectItem value="graduated">Graduated</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Parent Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Parent/Guardian Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parent_name">Parent Name</Label>
                <Input
                  id="parent_name"
                  {...register('parent_name')}
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <Label htmlFor="parent_phone">Parent Phone</Label>
                <Input
                  id="parent_phone"
                  {...register('parent_phone')}
                  placeholder="+1234567890"
                />
              </div>

              <div>
                <Label htmlFor="parent_email">Parent Email</Label>
                <Input
                  id="parent_email"
                  type="email"
                  {...register('parent_email')}
                  placeholder="jane.doe@example.com"
                />
                {errors.parent_email && (
                  <p className="text-sm text-red-600 mt-1">{errors.parent_email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="emergency_contact">Emergency Contact</Label>
                <Input
                  id="emergency_contact"
                  {...register('emergency_contact')}
                  placeholder="Name and phone number"
                />
              </div>
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
          {loading ? 'Saving...' : student ? 'Update Student' : 'Add Student'}
        </Button>
      </div>
    </form>
  );
}