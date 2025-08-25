import axios from 'axios';
import { Interview, UploadResponse, InterviewStatus } from '@/types/interview';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const interviewApi = {
  // Upload interview file
  uploadInterview: async (file: File): Promise<Interview> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/interviews/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all interviews
  getInterviews: async (): Promise<Interview[]> => {
    try {
      const response = await api.get('/api/interviews');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch interviews:', error);
      return mockInterviews;
    }
  },

  // Get single interview
  getInterview: async (id: string): Promise<Interview> => {
    const response = await api.get(`/api/interviews/${id}`);
    return response.data;
  },

  // Start transcription
  transcribeInterview: async (id: string): Promise<UploadResponse> => {
    const response = await api.post(`/api/interviews/${id}/transcribe`);
    return response.data;
  },

  // Get interview status
  getInterviewStatus: async (id: string): Promise<InterviewStatus> => {
    const response = await api.get(`/api/interviews/${id}/status`);
    return response.data;
  },
};

// Mock data for development
export const mockInterviews: Interview[] = [
  {
    id: '1',
    filename: 'interview_1.mp4',
    original_name: 'Software_Developer_Interview_1.mp4',
    file_size: 52428800,
    file_path: '/uploads/interview_1.mp4',
    upload_date: '2024-01-15T10:30:00Z',
    status: 'completed',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:35:00Z',
  },
  {
    id: '2',
    filename: 'interview_2.mp3',
    original_name: 'Product_Manager_Interview_2.mp3',
    file_size: 31457280,
    file_path: '/uploads/interview_2.mp3',
    upload_date: '2024-01-14T14:20:00Z',
    status: 'processing',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-14T14:22:00Z',
  },
  {
    id: '3',
    filename: 'interview_3.wav',
    original_name: 'Designer_Interview_3.wav',
    file_size: 20971520,
    file_path: '/uploads/interview_3.wav',
    upload_date: '2024-01-13T09:15:00Z',
    status: 'uploaded',
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
  },
];
