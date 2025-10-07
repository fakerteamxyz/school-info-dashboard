import { NextRequest, NextResponse } from 'next/server';
import { getStudentById, updateStudent, deleteStudent } from '@/lib/db';
import { validateStudent, ApiResponse } from '@/lib/validations';
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
    const student = await getStudentById(id);
    
    if (!student) {
      return NextResponse.json<ApiResponse>({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to fetch student' }, { status: 500 });
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
    
    const validation = validateStudent({ ...updateData, created_by: userId });
    
    if (!validation.success) {
      return NextResponse.json<ApiResponse>({ 
        error: 'Validation failed', 
        details: validation.error.format() 
      }, { status: 400 });
    }

    const updatedStudent = await updateStudent(id, validation.data);
    
    if (!updatedStudent) {
      return NextResponse.json<ApiResponse>({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: updatedStudent,
      message: 'Student updated successfully'
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to update student' }, { status: 500 });
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
    
    // Check if student exists first
    const student = await getStudentById(id);
    if (!student) {
      return NextResponse.json<ApiResponse>({ error: 'Student not found' }, { status: 404 });
    }
    
    await deleteStudent(id);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to delete student' }, { status: 500 });
  }
}