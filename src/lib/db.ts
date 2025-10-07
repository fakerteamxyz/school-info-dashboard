import { createSupabaseServerClient } from "./supabase";

// Database types
export interface Student {
  id?: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  grade_level: number;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
  emergency_contact?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface Teacher {
  id?: string;
  teacher_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  hire_date: string;
  specialization: string[];
  subjects: string[];
  employee_type: 'full_time' | 'part_time' | 'contract';
  status: 'active' | 'inactive' | 'on_leave';
  salary?: number;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface Class {
  id?: string;
  class_code: string;
  name: string;
  grade_level: number;
  academic_year: string;
  room_number?: string;
  max_students: number;
  current_students: number;
  homeroom_teacher_id?: string;
  description?: string;
  status: 'active' | 'inactive';
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface Announcement {
  id?: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'academic' | 'event' | 'holiday';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  target_audience: string[];
  start_date: string;
  end_date?: string;
  is_active: boolean;
  attachments?: string[];
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

// Database utility functions
export async function getStudents() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Student[];
}

export async function getStudentById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Student;
}

export async function createStudent(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('students')
    .insert(student)
    .select()
    .single();
  
  if (error) throw error;
  return data as Student;
}

export async function updateStudent(id: string, student: Partial<Student>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('students')
    .update(student)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Student;
}

export async function deleteStudent(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Teacher functions
export async function getTeachers() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Teacher[];
}

export async function getTeacherById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Teacher;
}

export async function createTeacher(teacher: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('teachers')
    .insert(teacher)
    .select()
    .single();
  
  if (error) throw error;
  return data as Teacher;
}

export async function updateTeacher(id: string, teacher: Partial<Teacher>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('teachers')
    .update(teacher)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Teacher;
}

export async function deleteTeacher(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('teachers')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Class functions
export async function getClasses() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Class[];
}

export async function getClassById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Class;
}

export async function createClass(classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('classes')
    .insert(classData)
    .select()
    .single();
  
  if (error) throw error;
  return data as Class;
}

export async function updateClass(id: string, classData: Partial<Class>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('classes')
    .update(classData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Class;
}

export async function deleteClass(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Announcement functions
export async function getAnnouncements() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Announcement[];
}

export async function getActiveAnnouncements() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .or('end_date.is.null,end_date.gt.' + new Date().toISOString())
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Announcement[];
}

export async function createAnnouncement(announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('announcements')
    .insert(announcement)
    .select()
    .single();
  
  if (error) throw error;
  return data as Announcement;
}

export async function updateAnnouncement(id: string, announcement: Partial<Announcement>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('announcements')
    .update(announcement)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Announcement;
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Utility functions for statistics
export async function getDashboardStats() {
  const supabase = await createSupabaseServerClient();
  
  const [students, teachers, classes, announcements] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }),
    supabase.from('teachers').select('*', { count: 'exact', head: true }),
    supabase.from('classes').select('*', { count: 'exact', head: true }),
    supabase.from('announcements').select('*', { count: 'exact', head: true })
  ]);
  
  return {
    totalStudents: students.count || 0,
    totalTeachers: teachers.count || 0,
    totalClasses: classes.count || 0,
    totalAnnouncements: announcements.count || 0
  };
}