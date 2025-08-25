import { NextRequest, NextResponse } from 'next/server';
import { INTERVIEW_API_URL } from '@/lib/api-endpoints';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create new FormData for backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const backendUrl = `${INTERVIEW_API_URL.BASE_URL}${INTERVIEW_API_URL.UPLOAD}`;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      body: backendFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading interview:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload interview' },
      { status: 500 }
    );
  }
}
