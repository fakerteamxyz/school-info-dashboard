-- School Information System Database Schema
-- This migration creates tables for managing students, teachers, classes, and announcements

-- Students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT UNIQUE NOT NULL, -- School-assigned student ID
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  grade_level INTEGER CHECK (grade_level >= 1 AND grade_level <= 12),
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'transferred')),
  parent_name TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  emergency_contact TEXT,
  created_by TEXT NOT NULL, -- Clerk user ID of admin who created this record
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teachers table
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id TEXT UNIQUE NOT NULL, -- School-assigned teacher ID
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  date_of_birth DATE,
  hire_date DATE DEFAULT CURRENT_DATE,
  specialization TEXT[],
  subjects TEXT[],
  employee_type TEXT DEFAULT 'full_time' CHECK (employee_type IN ('full_time', 'part_time', 'contract')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  salary DECIMAL(10,2),
  created_by TEXT NOT NULL, -- Clerk user ID of admin who created this record
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classes table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_code TEXT UNIQUE NOT NULL, -- e.g., "10A", "7B"
  name TEXT NOT NULL, -- e.g., "Grade 10 - Section A"
  grade_level INTEGER NOT NULL CHECK (grade_level >= 1 AND grade_level <= 12),
  academic_year TEXT NOT NULL, -- e.g., "2024-2025"
  room_number TEXT,
  max_students INTEGER DEFAULT 30,
  current_students INTEGER DEFAULT 0,
  homeroom_teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_by TEXT NOT NULL, -- Clerk user ID of admin who created this record
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Class enrollments (many-to-many relationship between students and classes)
CREATE TABLE IF NOT EXISTS public.class_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'withdrawn', 'completed')),
  created_by TEXT NOT NULL, -- Clerk user ID of admin who created this record
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, student_id)
);

-- Teacher assignments (many-to-many relationship between teachers and classes)
CREATE TABLE IF NOT EXISTS public.teacher_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  subject TEXT NOT NULL, -- Subject they teach for this class
  role TEXT DEFAULT 'teacher' CHECK (role IN ('teacher', 'assistant', 'substitute')),
  assignment_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_by TEXT NOT NULL, -- Clerk user ID of admin who created this record
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, teacher_id, subject)
);

-- Announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'general' CHECK (type IN ('general', 'urgent', 'academic', 'event', 'holiday')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  target_audience TEXT[] DEFAULT '{all}', -- Array of audiences: ['all', 'students', 'teachers', 'parents', 'grade_10']
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  attachments TEXT[], -- URLs to attached files
  created_by TEXT NOT NULL, -- Clerk user ID of admin who created this announcement
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students table
-- Admins can read all student records
CREATE POLICY "Admins can read all students" ON public.students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.jwt() ->> 'sub' 
      AND user_id IN (SELECT user_id FROM public.profiles WHERE is_public = true) -- This is a placeholder - in real implementation, you'd have an admin role system
    )
  );

-- Admins can insert student records
CREATE POLICY "Admins can insert students" ON public.students
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = created_by);

-- Admins can update student records
CREATE POLICY "Admins can update students" ON public.students
  FOR UPDATE USING (auth.jwt() ->> 'sub' = created_by);

-- Admins can delete student records
CREATE POLICY "Admins can delete students" ON public.students
  FOR DELETE USING (auth.jwt() ->> 'sub' = created_by);

-- Similar policies for teachers table
CREATE POLICY "Admins can read all teachers" ON public.teachers
  FOR SELECT USING (true); -- Simplified for demo - in production, implement proper admin role checking

CREATE POLICY "Admins can insert teachers" ON public.teachers
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = created_by);

CREATE POLICY "Admins can update teachers" ON public.teachers
  FOR UPDATE USING (auth.jwt() ->> 'sub' = created_by);

CREATE POLICY "Admins can delete teachers" ON public.teachers
  FOR DELETE USING (auth.jwt() ->> 'sub' = created_by);

-- Similar policies for classes table
CREATE POLICY "Admins can manage classes" ON public.classes
  FOR ALL USING (auth.jwt() ->> 'sub' = created_by);

-- Similar policies for enrollment and assignment tables
CREATE POLICY "Admins can manage enrollments" ON public.class_enrollments
  FOR ALL USING (auth.jwt() ->> 'sub' = created_by);

CREATE POLICY "Admins can manage assignments" ON public.teacher_assignments
  FOR ALL USING (auth.jwt() ->> 'sub' = created_by);

-- Similar policies for announcements
CREATE POLICY "Admins can manage announcements" ON public.announcements
  FOR ALL USING (auth.jwt() ->> 'sub' = created_by);

-- Public can read active announcements
CREATE POLICY "Anyone can read active announcements" ON public.announcements
  FOR SELECT USING (is_active = true AND (end_date IS NULL OR end_date > NOW()));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_grade_level ON public.students(grade_level);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status);
CREATE INDEX IF NOT EXISTS idx_teachers_teacher_id ON public.teachers(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teachers_email ON public.teachers(email);
CREATE INDEX IF NOT EXISTS idx_teachers_status ON public.teachers(status);
CREATE INDEX IF NOT EXISTS idx_classes_class_code ON public.classes(class_code);
CREATE INDEX IF NOT EXISTS idx_classes_grade_level ON public.classes(grade_level);
CREATE INDEX IF NOT EXISTS idx_classes_academic_year ON public.classes(academic_year);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_class_id ON public.class_enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_student_id ON public.class_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_teacher_assignments_class_id ON public.teacher_assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_teacher_assignments_teacher_id ON public.teacher_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_announcements_type ON public.announcements(type);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON public.announcements(priority);
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON public.announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_start_date ON public.announcements(start_date);

-- Create updated_at triggers for all tables
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update current_students in classes
CREATE OR REPLACE FUNCTION update_class_student_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.classes 
    SET current_students = current_students + 1 
    WHERE id = NEW.class_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.classes 
    SET current_students = current_students - 1 
    WHERE id = OLD.class_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Triggers to automatically maintain student count
CREATE TRIGGER update_class_count_on_enrollment
  AFTER INSERT OR DELETE ON public.class_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_class_student_count();