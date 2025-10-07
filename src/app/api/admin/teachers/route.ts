import { NextRequest, NextResponse } from 'next/server';
import { getTeachers, createTeacher, getTeacherById, updateTeacher, deleteTeacher } from '@/lib/db';
import { validateTeacher, validateSearchParams, ApiResponse, PaginatedResponse } from '@/lib/validations';
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

    const { search, status, page, limit } = searchValidation.data;
    
    // Get all teachers (in a real implementation, you'd add filtering and pagination)
    let teachers = await getTeachers();
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      teachers = teachers.filter(teacher => 
        teacher.first_name.toLowerCase().includes(searchLower) ||
        teacher.last_name.toLowerCase().includes(searchLower) ||
        teacher.email.toLowerCase().includes(searchLower) ||
        teacher.teacher_id.toLowerCase().includes(searchLower)
      );
    }
    
    if (status) {
      teachers = teachers.filter(teacher => teacher.status === status);
    }
    
    // Apply pagination
    const total = teachers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedTeachers = teachers.slice(startIndex, startIndex + limit);

    return NextResponse.json<PaginatedResponse>({
      success: true,
      data: paginatedTeachers,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to fetch teachers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse>({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateTeacher({ ...body, created_by: userId });
    
    if (!validation.success) {
      return NextResponse.json<ApiResponse>({ 
        error: 'Validation failed', 
        details: validation.error.format() 
      }, { status: 400 });
    }

    const teacher = await createTeacher(validation.data);
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: teacher,
      message: 'Teacher created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating teacher:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to create teacher' }, { status: 500 });
  }
}