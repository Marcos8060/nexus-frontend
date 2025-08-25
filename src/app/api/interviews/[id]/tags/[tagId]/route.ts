import { NextRequest, NextResponse } from 'next/server';
import { INTERVIEW_API_URL } from '@/lib/api-endpoints';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; tagId: string } }
) {
  try {
    const { id, tagId } = params;
    
    const backendUrl = `${INTERVIEW_API_URL.BASE_URL}${INTERVIEW_API_URL.DELETE_TAG}/${id}/tags/${tagId}`;

    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}
