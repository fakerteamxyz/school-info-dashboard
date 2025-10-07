import { NextRequest, NextResponse } from 'next/server';
import { getTeacherById, updateTeacher, deleteTeacher } from '@/lib/db';
import { validateTeacher, ApiResponse } from '@/lib/validations';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse>({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const teacher = await getTeacherById(id);
    
    if (!teacher) {
      return NextResponse.json<ApiResponse>({ error: 'Teacher not found' }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: teacher
    });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to fetch teacher' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse>({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    // Remove created_by from body as it shouldn't be changed
    const { created_by, ...updateData } = body;
    
    const validation = validateTeacher({ ...updateData, created_by: userId });
    
    if (!validation.success) {
      return NextResponse.json<ApiResponse>({ 
        error: 'Validation failed', 
        details: validation.error.format() 
      }, { status: 400 });
    }

    const updatedTeacher = await updateTeacher(id, validation.data);
    
    if (!updatedTeacher) {
      return NextResponse.json<ApiResponse>({ error: 'Teacher not found' }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: updatedTeacher,
      message: 'Teacher updated successfully'
    });
  } catch (error) {
    console.error('Error updating teacher:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to update teacher' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse>({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // Check if teacher exists first
    const teacher = await getTeacherById(id);
    if (!teacher) {
      return NextResponse.json<ApiResponse>({ error: 'Teacher not found' }, { status: 404 });
    }
    
    await deleteTeacher(id);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to delete teacher' }, { status: 500 });
  }
}