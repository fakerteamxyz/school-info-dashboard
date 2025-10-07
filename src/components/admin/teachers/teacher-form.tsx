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
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Teacher, TeacherFormData } from '@/lib/db';
import { teacherSchema } from '@/lib/validations';

interface TeacherFormProps {
  teacher?: Teacher | null;
  onSubmit: () => void;
  onCancel: () => void;
}

export function TeacherForm({ teacher, onSubmit, onCancel }: TeacherFormProps) {
  const [loading, setLoading] = useState(false);
  const [specializations, setSpecializations] = useState<string[]>(teacher?.specialization || []);
  const [subjects, setSubjects] = useState<string[]>(teacher?.subjects || []);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newSubject, setNewSubject] = useState('');
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      teacher_id: teacher?.teacher_id || '',
      first_name: teacher?.first_name || '',
      last_name: teacher?.last_name || '',
      email: teacher?.email || '',
      phone: teacher?.phone || '',
      address: teacher?.address || '',
      date_of_birth: teacher?.date_of_birth || '',
      hire_date: teacher?.hire_date || new Date().toISOString().split('T')[0],
      specialization: teacher?.specialization || [],
      subjects: teacher?.subjects || [],
      employee_type: teacher?.employee_type || 'full_time',
      status: teacher?.status || 'active',
      salary: teacher?.salary || undefined,
    },
  });

  const addSpecialization = () => {
    if (newSpecialization.trim() && !specializations.includes(newSpecialization.trim())) {
      const updated = [...specializations, newSpecialization.trim()];
      setSpecializations(updated);
      setValue('specialization', updated);
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (item: string) => {
    const updated = specializations.filter(s => s !== item);
    setSpecializations(updated);
    setValue('specialization', updated);
  };

  const addSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      const updated = [...subjects, newSubject.trim()];
      setSubjects(updated);
      setValue('subjects', updated);
      setNewSubject('');
    }
  };

  const removeSubject = (item: string) => {
    const updated = subjects.filter(s => s !== item);
    setSubjects(updated);
    setValue('subjects', updated);
  };

  const handleFormSubmit = async (data: TeacherFormData) => {
    setLoading(true);
    try {
      const url = teacher 
        ? `/api/admin/teachers/${teacher.id}`
        : '/api/admin/teachers';
      
      const response = await fetch(url, {
        method: teacher ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          specialization: specializations,
          subjects: subjects,
        }),
      });

      if (response.ok) {
        onSubmit();
      } else {
        const error = await response.json();
        console.error('Failed to save teacher:', error);
      }
    } catch (error) {
      console.error('Failed to save teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="teacher_id">Teacher ID *</Label>
              <Input
                id="teacher_id"
                {...register('teacher_id')}
                placeholder="e.g., TCH001"
              />
              {errors.teacher_id && (
                <p className="text-sm text-red-600 mt-1">{errors.teacher_id.message}</p>
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
                  placeholder="Smith"
                />
                {errors.last_name && (
                  <p className="text-sm text-red-600 mt-1">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="john.smith@example.com"
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

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Employment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hire_date">Hire Date *</Label>
              <Input
                id="hire_date"
                type="date"
                {...register('hire_date')}
              />
              {errors.hire_date && (
                <p className="text-sm text-red-600 mt-1">{errors.hire_date.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="employee_type">Employment Type *</Label>
              <Select
                value={watch('employee_type')}
                onValueChange={(value) => setValue('employee_type', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
              {errors.employee_type && (
                <p className="text-sm text-red-600 mt-1">{errors.employee_type.message}</p>
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
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                type="number"
                step="0.01"
                {...register('salary', { valueAsNumber: true })}
                placeholder="50000.00"
              />
              {errors.salary && (
                <p className="text-sm text-red-600 mt-1">{errors.salary.message}</p>
              )}
            </div>

            {/* Specializations */}
            <div>
              <Label>Specializations</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add specialization"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                />
                <Button type="button" onClick={addSpecialization}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {spec}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeSpecialization(spec)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Subjects */}
            <div>
              <Label>Subjects</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add subject"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                />
                <Button type="button" onClick={addSubject}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {subject}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeSubject(subject)}
                    />
                  </Badge>
                ))}
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
          {loading ? 'Saving...' : teacher ? 'Update Teacher' : 'Add Teacher'}
        </Button>
      </div>
    </form>
  );
}