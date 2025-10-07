import { z } from 'zod';

// Student validation schema
export const studentSchema = z.object({
  student_id: z.string().min(1, 'Student ID is required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  address: z.string().optional(),
  grade_level: z.number().int().min(1).max(12, 'Grade level must be between 1 and 12'),
  enrollment_date: z.string(),
  status: z.enum(['active', 'inactive', 'graduated', 'transferred']).default('active'),
  parent_name: z.string().optional(),
  parent_phone: z.string().optional(),
  parent_email: z.string().email('Invalid parent email').optional().or(z.literal('')),
  emergency_contact: z.string().optional(),
  created_by: z.string()
});

// Teacher validation schema
export const teacherSchema = z.object({
  teacher_id: z.string().min(1, 'Teacher ID is required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  address: z.string().optional(),
  date_of_birth: z.string().optional(),
  hire_date: z.string(),
  specialization: z.array(z.string()).default([]),
  subjects: z.array(z.string()).default([]),
  employee_type: z.enum(['full_time', 'part_time', 'contract']).default('full_time'),
  status: z.enum(['active', 'inactive', 'on_leave']).default('active'),
  salary: z.number().positive().optional(),
  created_by: z.string()
});

// Class validation schema
export const classSchema = z.object({
  class_code: z.string().min(1, 'Class code is required'),
  name: z.string().min(1, 'Class name is required'),
  grade_level: z.number().int().min(1).max(12, 'Grade level must be between 1 and 12'),
  academic_year: z.string().min(1, 'Academic year is required'),
  room_number: z.string().optional(),
  max_students: z.number().int().min(1).max(50, 'Maximum students must be between 1 and 50'),
  current_students: z.number().int().min(0).default(0),
  homeroom_teacher_id: z.string().uuid().optional().or(z.literal('')),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  created_by: z.string()
});

// Announcement validation schema
export const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['general', 'urgent', 'academic', 'event', 'holiday']).default('general'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  target_audience: z.array(z.string()).default(['all']),
  start_date: z.string(),
  end_date: z.string().optional(),
  is_active: z.boolean().default(true),
  attachments: z.array(z.string()).default([]),
  created_by: z.string()
});

// Search and filter schemas
export const searchParamsSchema = z.object({
  search: z.string().optional(),
  grade_level: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  priority: z.string().optional(),
  page: z.string().optional().transform(Number).pipe(z.number().int().positive().default(1)),
  limit: z.string().optional().transform(Number).pipe(z.number().int().positive().max(100).default(20))
});

// Types for form data
export type StudentFormData = z.infer<typeof studentSchema>;
export type TeacherFormData = z.infer<typeof teacherSchema>;
export type ClassFormData = z.infer<typeof classSchema>;
export type AnnouncementFormData = z.infer<typeof announcementSchema>;
export type SearchParams = z.infer<typeof searchParamsSchema>;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form validation helpers
export function validateStudent(data: unknown) {
  return studentSchema.safeParse(data);
}

export function validateTeacher(data: unknown) {
  return teacherSchema.safeParse(data);
}

export function validateClass(data: unknown) {
  return classSchema.safeParse(data);
}

export function validateAnnouncement(data: unknown) {
  return announcementSchema.safeParse(data);
}

export function validateSearchParams(data: unknown) {
  return searchParamsSchema.safeParse(data);
}