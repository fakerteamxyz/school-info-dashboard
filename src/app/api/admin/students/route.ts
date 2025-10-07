import { NextRequest, NextResponse } from 'next/server';
import { getStudents, createStudent, getStudentById, updateStudent, deleteStudent } from '@/lib/db';
import { validateStudent, validateSearchParams, ApiResponse, PaginatedResponse } from '@/lib/validations';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse>({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const searchValidation = validateSearchParams(Object.fromEntries(searchParams));
    
    if (!searchValidation.success) {
      return NextResponse.json<ApiResponse>({ error: 'Invalid search parameters' }, { status: 400 });
    }

    const { search, grade_level, status, page, limit } = searchValidation.data;
    
    // Get all students (in a real implementation, you'd add filtering and pagination)
    let students = await getStudents();
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      students = students.filter(student => 
        student.first_name.toLowerCase().includes(searchLower) ||
        student.last_name.toLowerCase().includes(searchLower) ||
        student.email?.toLowerCase().includes(searchLower) ||
        student.student_id.toLowerCase().includes(searchLower)
      );
    }
    
    if (grade_level) {
      students = students.filter(student => student.grade_level === parseInt(grade_level));
    }
    
    if (status) {
      students = students.filter(student => student.status === status);
    }
    
    // Apply pagination
    const total = students.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedStudents = students.slice(startIndex, startIndex + limit);

    return NextResponse.json<PaginatedResponse>({
      success: true,
      data: paginatedStudents,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse>({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateStudent({ ...body, created_by: userId });
    
    if (!validation.success) {
      return NextResponse.json<ApiResponse>({ 
        error: 'Validation failed', 
        details: validation.error.format() 
      }, { status: 400 });
    }

    const student = await createStudent(validation.data);
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: student,
      message: 'Student created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to create student' }, { status: 500 });
  }
}