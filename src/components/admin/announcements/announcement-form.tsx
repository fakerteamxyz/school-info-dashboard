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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Calendar, Users, Target } from 'lucide-react';
import { Announcement, AnnouncementFormData } from '@/lib/db';
import { announcementSchema } from '@/lib/validations';

interface AnnouncementFormProps {
  announcement?: Announcement | null;
  onSubmit: () => void;
  onCancel: () => void;
}

const AUDIENCE_OPTIONS = [
  { id: 'all', label: 'All Users' },
  { id: 'students', label: 'Students' },
  { id: 'teachers', label: 'Teachers' },
  { id: 'parents', label: 'Parents' },
  { id: 'grade_1', label: 'Grade 1' },
  { id: 'grade_2', label: 'Grade 2' },
  { id: 'grade_3', label: 'Grade 3' },
  { id: 'grade_4', label: 'Grade 4' },
  { id: 'grade_5', label: 'Grade 5' },
  { id: 'grade_6', label: 'Grade 6' },
  { id: 'grade_7', label: 'Grade 7' },
  { id: 'grade_8', label: 'Grade 8' },
  { id: 'grade_9', label: 'Grade 9' },
  { id: 'grade_10', label: 'Grade 10' },
  { id: 'grade_11', label: 'Grade 11' },
  { id: 'grade_12', label: 'Grade 12' },
];

export function AnnouncementForm({ announcement, onSubmit, onCancel }: AnnouncementFormProps) {
  const [loading, setLoading] = useState(false);
  const [targetAudience, setTargetAudience] = useState<string[]>(announcement?.target_audience || ['all']);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: announcement?.title || '',
      content: announcement?.content || '',
      type: announcement?.type || 'general',
      priority: announcement?.priority || 'normal',
      target_audience: announcement?.target_audience || ['all'],
      start_date: announcement?.start_date || new Date().toISOString().split('T')[0],
      end_date: announcement?.end_date || '',
      is_active: announcement?.is_active ?? true,
      attachments: announcement?.attachments || [],
    },
  });

  const handleAudienceToggle = (audience: string) => {
    if (audience === 'all') {
      if (targetAudience.includes('all')) {
        setTargetAudience([]);
      } else {
        setTargetAudience(['all']);
      }
    } else {
      if (targetAudience.includes(audience)) {
        const updated = targetAudience.filter(a => a !== audience);
        // Remove 'all' if specific audiences are selected
        setTargetAudience(updated.filter(a => a !== 'all'));
      } else {
        // Remove 'all' if specific audiences are being added
        const updated = targetAudience.filter(a => a !== 'all');
        setTargetAudience([...updated, audience]);
      }
    }
  };

  const handleFormSubmit = async (data: AnnouncementFormData) => {
    setLoading(true);
    try {
      const url = announcement 
        ? `/api/admin/announcements/${announcement.id}`
        : '/api/admin/announcements';
      
      const response = await fetch(url, {
        method: announcement ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          target_audience: targetAudience,
        }),
      });

      if (response.ok) {
        onSubmit();
      } else {
        const error = await response.json();
        console.error('Failed to save announcement:', error);
      }
    } catch (error) {
      console.error('Failed to save announcement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update form value when targetAudience changes
  useState(() => {
    setValue('target_audience', targetAudience);
  });

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Enter announcement title"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                {...register('content')}
                placeholder="Enter announcement content"
                rows={8}
              />
              {errors.content && (
                <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={watch('type')}
                  onValueChange={(value) => setValue('type', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  value={watch('priority')}
                  onValueChange={(value) => setValue('priority', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                {errors.priority && (
                  <p className="text-sm text-red-600 mt-1">{errors.priority.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule and Audience */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schedule and Audience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  {...register('start_date')}
                />
                {errors.start_date && (
                  <p className="text-sm text-red-600 mt-1">{errors.start_date.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="end_date">End Date (Optional)</Label>
                <Input
                  id="end_date"
                  type="date"
                  {...register('end_date')}
                  min={watch('start_date')}
                />
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <Label className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Target Audience *
              </Label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="audience-all"
                    checked={targetAudience.includes('all')}
                    onCheckedChange={() => handleAudienceToggle('all')}
                  />
                  <Label htmlFor="audience-all" className="font-medium">
                    All Users
                  </Label>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {AUDIENCE_OPTIONS.filter(option => option.id !== 'all').map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`audience-${option.id}`}
                        checked={targetAudience.includes(option.id)}
                        onCheckedChange={() => handleAudienceToggle(option.id)}
                        disabled={targetAudience.includes('all')}
                      />
                      <Label 
                        htmlFor={`audience-${option.id}`} 
                        className="text-sm cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Selected Audience Display */}
              {targetAudience.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {targetAudience.map((audience) => {
                    const option = AUDIENCE_OPTIONS.find(opt => opt.id === audience);
                    return (
                      <Badge key={audience} variant="secondary" className="flex items-center gap-1">
                        {option?.label || audience}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleAudienceToggle(audience)}
                        />
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={watch('is_active')}
                onCheckedChange={(checked) => setValue('is_active', checked as boolean)}
              />
              <Label htmlFor="is_active">Active</Label>
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
          {loading ? 'Saving...' : announcement ? 'Update Announcement' : 'Create Announcement'}
        </Button>
      </div>
    </form>
  );
}