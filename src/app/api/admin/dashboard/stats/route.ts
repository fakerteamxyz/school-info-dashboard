import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/db';
import { ApiResponse } from '@/lib/validations';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse>({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await getDashboardStats();
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json<ApiResponse>({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}