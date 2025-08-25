'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchInterviews, uploadInterview } from '@/redux/features/interviewSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileAudio, 
  FileVideo, 
  Clock, 
  Search, 
  Filter,
  Play,
  Pause,
  Download,
  Trash2,
  Eye
} from 'lucide-react';
import { formatBytes, formatDate } from '@/lib/utils';
import { Interview } from '@/types/interview';
import { toast } from 'sonner';
import Link from 'next/link';

export default function InterviewsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { interviews = [], loading, error } = useSelector((state: RootState) => state.interview);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchInterviews());
  }, [dispatch]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'video/mp4', 'video/mov', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid audio or video file (MP3, WAV, MP4, MOV)');
      return;
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('File size must be less than 100MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await dispatch(uploadInterview(file)).unwrap();
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      toast.success('Interview uploaded successfully!');
      
      // Reset form
      event.target.value = '';
    } catch (error) {
      toast.error('Failed to upload interview');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'processing':
        return '⏳';
      case 'failed':
        return '❌';
      default:
        return '📁';
    }
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.original_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || interview.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'mp3':
      case 'wav':
        return <FileAudio className="h-8 w-8 text-blue-500" />;
      case 'mp4':
      case 'mov':
        return <FileVideo className="h-8 w-8 text-purple-500" />;
      default:
        return <FileAudio className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interview Manager</h1>
          <p className="text-muted-foreground">
            Upload, transcribe, and analyze your interview recordings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Interview
          </CardTitle>
          <CardDescription>
            Upload audio or video files (MP3, WAV, MP4, MOV) up to 100MB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">Drop your interview file here</p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse your files
            </p>
            <Input
              type="file"
              accept="audio/*,video/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild disabled={isUploading}>
                <span>
                  {isUploading ? 'Uploading...' : 'Choose File'}
                </span>
              </Button>
            </label>
            {isUploading && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  {uploadProgress}% complete
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search interviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background"
        >
          <option value="all">All Status</option>
          <option value="uploaded">Uploaded</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Interviews List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Interviews ({filteredInterviews.length})</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredInterviews.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileAudio className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No interviews found</h3>
                <p className="text-muted-foreground">
                  Upload your first interview to get started
                </p>
              </CardContent>
            </Card>
          ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {filteredInterviews.map((interview) => (
                 <Card key={interview.id} className="hover:shadow-lg transition-shadow" data-testid="interview-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      {getFileIcon(interview.filename)}
                      <Badge className={getStatusColor(interview.status)}>
                        {getStatusIcon(interview.status)} {interview.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg truncate">
                      {interview.original_name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {formatDate(interview.upload_date)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">File size:</span>
                        <span>{formatBytes(interview.file_size)}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button asChild size="sm" className="flex-1">
                          <Link href={`/interviews/${interview.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                        
                        {interview.status === 'uploaded' && (
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4 mr-2" />
                            Transcribe
                          </Button>
                        )}
                        
                        {interview.status === 'completed' && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="text-center text-muted-foreground py-8">
            Recent interviews will appear here
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="text-center text-muted-foreground py-8">
            Completed interviews will appear here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
