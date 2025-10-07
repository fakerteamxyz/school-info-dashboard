import { NextRequest, NextResponse } from 'next/server';
import { getAnnouncements, createAnnouncement, getAnnouncementById, updateAnnouncement, deleteAnnouncement } from '@/lib/db';
import { validateAnnouncement, ApiResponse } from '@/lib/validations';
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
    const announcement = await getAnnouncementById(id);
    
    if (!announcement) {
      return NextResponse.json<ApiResponse>({ error: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: announcement
    });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to fetch announcement' }, { status: 500 });
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
    
    const validation = validateAnnouncement({ ...updateData, created_by: userId });
    
    if (!validation.success) {
      return NextResponse.json<ApiResponse>({ 
        error: 'Validation failed', 
        details: validation.error.format() 
      }, { status: 400 });
    }

    const updatedAnnouncement = await updateAnnouncement(id, validation.data);
    
    if (!updatedAnnouncement) {
      return NextResponse.json<ApiResponse>({ error: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: updatedAnnouncement,
      message: 'Announcement updated successfully'
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to update announcement' }, { status: 500 });
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
    
    // Check if announcement exists first
    const announcement = await getAnnouncementById(id);
    if (!announcement) {
      return NextResponse.json<ApiResponse>({ error: 'Announcement not found' }, { status: 404 });
    }
    
    await deleteAnnouncement(id);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to delete announcement' }, { status: 500 });
  }
}