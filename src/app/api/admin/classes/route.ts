import { NextRequest, NextResponse } from 'next/server';
import { getClasses, createClass, getClassById, updateClass, deleteClass } from '@/lib/db';
import { validateClass, validateSearchParams, ApiResponse, PaginatedResponse } from '@/lib/validations';
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
    
    // Get all classes
    let classes = await getClasses();
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      classes = classes.filter(cls => 
        cls.name.toLowerCase().includes(searchLower) ||
        cls.class_code.toLowerCase().includes(searchLower) ||
        cls.description?.toLowerCase().includes(searchLower)
      );
    }
    
    if (grade_level) {
      classes = classes.filter(cls => cls.grade_level === parseInt(grade_level));
    }
    
    if (status) {
      classes = classes.filter(cls => cls.status === status);
    }
    
    // Apply pagination
    const total = classes.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedClasses = classes.slice(startIndex, startIndex + limit);

    return NextResponse.json<PaginatedResponse>({
      success: true,
      data: paginatedClasses,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse>({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateClass({ ...body, created_by: userId });
    
    if (!validation.success) {
      return NextResponse.json<ApiResponse>({ 
        error: 'Validation failed', 
        details: validation.error.format() 
      }, { status: 400 });
    }

    const classData = await createClass(validation.data);
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: classData,
      message: 'Class created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to create class' }, { status: 500 });
  }
}