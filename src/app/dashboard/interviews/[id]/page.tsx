'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchInterview, setCurrentTime, setIsPlaying } from '@/redux/features/interviewSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Download, 
  Search, 
  Tag, 
  Brain, 
  FileText,
  Clock,
  ArrowLeft,
  Share2,
  MoreHorizontal
} from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';


export default function InterviewDetailPage() {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { currentInterview, currentTime, isPlaying, loading, error } = useSelector((state: RootState) => state.interview);
  
  // Debug logging
  console.log('Interview Detail Page State:', {
    loading,
    error,
    currentInterview: currentInterview ? {
      id: currentInterview.id,
      original_name: currentInterview.original_name,
      cloudinary_url: currentInterview.cloudinary_url,
      status: currentInterview.status
    } : null
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [playerRef, setPlayerRef] = useState<HTMLVideoElement | null>(null);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    if (params.id) {
      console.log('Fetching interview with ID:', params.id);
      dispatch(fetchInterview(params.id as string));
    }
  }, [dispatch, params.id]);

  // Reset player state when interview changes
  useEffect(() => {
    if (currentInterview) {
      setIsPlayerReady(false);
      setPlayerError(null);
      dispatch(setCurrentTime(0));
      dispatch(setIsPlaying(false));
    }
  }, [currentInterview, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Pause playback when component unmounts
      dispatch(setIsPlaying(false));
      setPlayerRef(null);
    };
  }, [dispatch]);

  const handlePlayPause = async () => {
    try {
      if (playerRef && isPlayerReady) {
        if (isPlaying) {
          playerRef.pause();
        } else {
          playerRef.play();
        }
      }
    } catch (error) {
      console.error('Play/Pause error:', error);
      setPlayerError('Failed to control playback');
    }
  };

  const handleSeek = (time: number) => {
    try {
      if (playerRef && isPlayerReady) {
        playerRef.currentTime = time;
        dispatch(setCurrentTime(time));
      }
    } catch (error) {
      console.error('Seek error:', error);
      setPlayerError('Failed to seek to position');
    }
  };

  const handleSkip = (seconds: number) => {
    try {
      if (playerRef && isPlayerReady) {
        const newTime = Math.max(0, currentTime + seconds);
        playerRef.currentTime = newTime;
        dispatch(setCurrentTime(newTime));
      }
    } catch (error) {
      console.error('Skip error:', error);
      setPlayerError('Failed to skip');
    }
  };



  // Helper function to get video URL
  const getVideoUrl = (filePath: string): string => {
    // If the interview has a Cloudinary URL, use it
    if (currentInterview?.cloudinary_url) {
      console.log('Using Cloudinary URL:', currentInterview.cloudinary_url);
      return currentInterview.cloudinary_url;
    }
    
    // If it's already a full URL (Cloudinary), return as is
    if (filePath.startsWith('http')) {
      console.log('Using direct URL:', filePath);
      return filePath;
    }
    
    // Fallback to mock video for testing
    console.log('Using fallback video URL');
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Interview</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button asChild>
          <Link href="/dashboard/interviews">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Interviews
          </Link>
        </Button>
      </div>
    );
  }

  if (!currentInterview) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Interview not found</h2>
        <p className="text-muted-foreground mb-6">The interview you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/dashboard/interviews">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Interviews
          </Link>
        </Button>
      </div>
    );
  }

  // Mock transcript data
  const transcript = [
    { start: 0, end: 5, text: "Hello, welcome to our interview today. Can you tell us a bit about yourself?" },
    { start: 5, end: 15, text: "Sure! I'm a software developer with 5 years of experience in React and Node.js." },
    { start: 15, end: 25, text: "That's great! Can you walk us through your experience with TypeScript?" },
    { start: 25, end: 40, text: "I've been using TypeScript for about 3 years now. I find it really helpful for catching errors early." },
    { start: 40, end: 55, text: "Excellent. What about your experience with cloud platforms like AWS?" },
    { start: 55, end: 70, text: "I've worked extensively with AWS, particularly with EC2, S3, and Lambda functions." },
  ];

  // Mock analysis data
  const analysis = {
    summary: "This interview covers the candidate's experience with modern web development technologies including React, TypeScript, and AWS. The candidate demonstrates strong technical knowledge and practical experience.",
    sentiment: "positive",
    keywords: ["React", "TypeScript", "AWS", "Node.js", "development"],
    questions: [
      "Can you tell us about yourself?",
      "What's your experience with TypeScript?",
      "How familiar are you with AWS?"
    ]
  };

  const filteredTranscript = transcript.filter(item => 
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/interviews">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{currentInterview.original_name}</h1>
            <p className="text-muted-foreground">Interview Analysis & Transcript</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Media Player */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Media Player
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Video/Audio Player */}
            <div className="relative bg-slate-900 rounded-lg overflow-hidden">
              {playerError ? (
                <div className="flex items-center justify-center h-64 bg-slate-800 text-white">
                  <div className="text-center">
                    <p className="text-red-400 mb-2">{playerError}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setPlayerError(null);
                        setIsPlayerReady(false);
                      }}
                    >
                      Retry
                    </Button>
                  </div>
                </div>
                             ) : (
                 <div className="relative w-full h-64">
                   <video
                     ref={setPlayerRef}
                     src={getVideoUrl(currentInterview.file_path)}
                     className="w-full h-full object-cover"
                     onTimeUpdate={(e) => {
                       const video = e.target as HTMLVideoElement;
                       dispatch(setCurrentTime(video.currentTime));
                     }}
                     onPlay={() => dispatch(setIsPlaying(true))}
                     onPause={() => dispatch(setIsPlaying(false))}
                     onLoadedData={() => setIsPlayerReady(true)}
                     onError={() => setPlayerError('Failed to load video')}
                   />
                 </div>
               )}
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSkip(-10)}
                  disabled={!isPlayerReady}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={handlePlayPause} 
                  size="sm"
                  disabled={!isPlayerReady}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSkip(10)}
                  disabled={!isPlayerReady}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {formatTime(currentTime)} / {formatTime(transcript[transcript.length - 1]?.end || 0)}
                </span>
                {!isPlayerReady && (
                  <span className="text-xs text-amber-600">Loading...</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transcript */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Transcript
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search transcript..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-48"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTranscript.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentTime >= item.start && currentTime <= item.end
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => handleSeek(item.start)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {formatTime(item.start)} - {formatTime(item.end)}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Tag className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <h4 className="font-semibold mb-2">Interview Summary</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {analysis.summary}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Key Questions Asked</h4>
                  <ul className="space-y-1">
                    {analysis.questions.map((question, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="sentiment" className="space-y-4">
                <div className="text-center p-6 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-emerald-600" />
                  <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
                    Positive Sentiment
                  </h3>
                  <p className="text-emerald-700 dark:text-emerald-300">
                    The interview shows a positive and engaging conversation
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg border">
                    <div className="text-2xl font-bold text-emerald-600">87%</div>
                    <div className="text-xs text-muted-foreground">Positive</div>
                  </div>
                  <div className="text-center p-3 rounded-lg border">
                    <div className="text-2xl font-bold text-slate-600">13%</div>
                    <div className="text-xs text-muted-foreground">Neutral</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="keywords" className="space-y-4">
                <div className="space-y-3">
                  {analysis.keywords.map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <span className="font-medium">{keyword}</span>
                      <Badge variant="secondary">
                        {Math.floor(Math.random() * 20) + 10} mentions
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Interview Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">1:15:30</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">File Size</p>
                <p className="text-sm text-muted-foreground">52.4 MB</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                  Completed
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
