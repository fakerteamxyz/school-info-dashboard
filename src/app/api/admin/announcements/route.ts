import { NextRequest, NextResponse } from 'next/server';
import { getAnnouncements, createAnnouncement, getAnnouncementById, updateAnnouncement, deleteAnnouncement } from '@/lib/db';
import { validateAnnouncement, validateSearchParams, ApiResponse, PaginatedResponse } from '@/lib/validations';
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

    const { search, type, priority, page, limit } = searchValidation.data;
    
    // Get all announcements
    let announcements = await getAnnouncements();
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      announcements = announcements.filter(announcement => 
        announcement.title.toLowerCase().includes(searchLower) ||
        announcement.content.toLowerCase().includes(searchLower)
      );
    }
    
    if (type) {
      announcements = announcements.filter(announcement => announcement.type === type);
    }
    
    if (priority) {
      announcements = announcements.filter(announcement => announcement.priority === priority);
    }
    
    // Apply pagination
    const total = announcements.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedAnnouncements = announcements.slice(startIndex, startIndex + limit);

    return NextResponse.json<PaginatedResponse>({
      success: true,
      data: paginatedAnnouncements,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse>({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateAnnouncement({ ...body, created_by: userId });
    
    if (!validation.success) {
      return NextResponse.json<ApiResponse>({ 
        error: 'Validation failed', 
        details: validation.error.format() 
      }, { status: 400 });
    }

    const announcement = await createAnnouncement(validation.data);
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: announcement,
      message: 'Announcement created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to create announcement' }, { status: 500 });
  }
}