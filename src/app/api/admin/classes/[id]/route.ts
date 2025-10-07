import { NextRequest, NextResponse } from 'next/server';
import { getClassById, updateClass, deleteClass } from '@/lib/db';
import { validateClass, ApiResponse } from '@/lib/validations';
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
    const classData = await getClassById(id);
    
    if (!classData) {
      return NextResponse.json<ApiResponse>({ error: 'Class not found' }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: classData
    });
  } catch (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to fetch class' }, { status: 500 });
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
    
    const validation = validateClass({ ...updateData, created_by: userId });
    
    if (!validation.success) {
      return NextResponse.json<ApiResponse>({ 
        error: 'Validation failed', 
        details: validation.error.format() 
      }, { status: 400 });
    }

    const updatedClass = await updateClass(id, validation.data);
    
    if (!updatedClass) {
      return NextResponse.json<ApiResponse>({ error: 'Class not found' }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: updatedClass,
      message: 'Class updated successfully'
    });
  } catch (error) {
    console.error('Error updating class:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to update class' }, { status: 500 });
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
    
    // Check if class exists first
    const classData = await getClassById(id);
    if (!classData) {
      return NextResponse.json<ApiResponse>({ error: 'Class not found' }, { status: 404 });
    }
    
    await deleteClass(id);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to delete class' }, { status: 500 });
  }
}