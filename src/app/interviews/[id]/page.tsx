'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchInterview, transcribeInterview, setCurrentTime, setIsPlaying, addTag, setSearchQuery, setSearchResults, clearSearch } from '@/redux/features/interviewSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Search, 
  Tag, 
  Download, 
  Share2,
  Clock,
  FileText,
  Brain,
  TrendingUp,
  MessageSquare,
  Hash
} from 'lucide-react';
import { formatTime, formatDate } from '@/lib/utils';
import { TranscriptItem, Tag as TagType } from '@/types/interview';
import { toast } from 'sonner';
import ReactPlayer from 'react-player';
import sampleTranscript from '@/data/sample_transcript.json';
import sampleAnalysis from '@/data/sample_analysis.json';

export default function InterviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentInterview, currentTime, isPlaying, tags, searchResults, searchQuery } = useSelector((state: RootState) => state.interview);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [showVolume, setShowVolume] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [tagColor, setTagColor] = useState('#3B82F6');
  const [tagText, setTagText] = useState('');
  const playerRef = useRef<ReactPlayer>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const interviewId = params.id as string;

  useEffect(() => {
    if (interviewId) {
      dispatch(fetchInterview(interviewId));
    }
  }, [interviewId, dispatch]);

  // Load sample data for development
  const transcript = currentInterview?.transcript || sampleTranscript.transcript;
  const analysis = currentInterview?.analysis || sampleAnalysis;

  const handlePlayPause = () => {
    dispatch(setIsPlaying(!isPlaying));
  };

  const handleSeek = (time: number) => {
    dispatch(setCurrentTime(time));
    if (playerRef.current) {
      playerRef.current.seekTo(time / duration);
    }
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    dispatch(setCurrentTime(state.playedSeconds));
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSkip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    handleSeek(newTime);
  };

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
    if (!query.trim()) {
      dispatch(setSearchResults([]));
      return;
    }

    const results = transcript
      .map((item: TranscriptItem, index: number) => ({
        text: item.text,
        start: item.start,
        end: item.end,
        index,
      }))
      .filter((item: any) => 
        item.text.toLowerCase().includes(query.toLowerCase())
      );

    dispatch(setSearchResults(results));
  };

  const handleTranscribe = async () => {
    try {
      await dispatch(transcribeInterview(interviewId)).unwrap();
      toast.success('Transcription started!');
    } catch (error) {
      toast.error('Failed to start transcription');
    }
  };

  const handleAddTag = () => {
    if (!tagText.trim() || !selectedText.trim()) return;

    const newTag: TagType = {
      id: Date.now().toString(),
      text: tagText,
      color: tagColor,
      start: currentTime,
      end: currentTime + 5, // 5 second duration
    };

    dispatch(addTag(newTag));
    setTagText('');
    setSelectedText('');
    toast.success('Tag added successfully!');
  };

  const getCurrentTranscriptItem = () => {
    return transcript.find((item: TranscriptItem) => 
      currentTime >= item.start && currentTime <= item.end
    );
  };

  const scrollToCurrentItem = () => {
    const currentItem = getCurrentTranscriptItem();
    if (currentItem && transcriptRef.current) {
      const element = document.getElementById(`transcript-${currentItem.start}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  useEffect(() => {
    scrollToCurrentItem();
  }, [currentTime]);

  if (!currentInterview) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading interview...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{currentInterview.original_name}</h1>
            <p className="text-muted-foreground">
              Uploaded {formatDate(currentInterview.upload_date)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={currentInterview.status === 'completed' ? 'default' : 'secondary'}>
            {currentInterview.status}
          </Badge>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Audio/Video Player */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Media Player
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Player */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <ReactPlayer
                ref={playerRef}
                url={`/api/interviews/${interviewId}/media`} // Mock URL
                playing={isPlaying}
                volume={volume}
                onProgress={handleProgress}
                onDuration={handleDuration}
                width="100%"
                height="200px"
                controls={false}
                style={{ backgroundColor: '#000' }}
              />
            </div>

            {/* Custom Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSkip(-10)}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSkip(10)}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-[100px]">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onMouseEnter={() => setShowVolume(true)}
                    onMouseLeave={() => setShowVolume(false)}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  {showVolume && (
                    <div className="absolute bottom-full right-0 mb-2 p-2 bg-background border rounded-lg">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-20"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <Progress 
              value={(currentTime / duration) * 100} 
              className="w-full"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = clickX / rect.width;
                handleSeek(percentage * duration);
              }}
            />

            {/* Transcribe Button */}
            {currentInterview.status === 'uploaded' && (
              <Button onClick={handleTranscribe} className="w-full">
                <Brain className="h-4 w-4 mr-2" />
                Start Transcription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transcript */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Transcript
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search transcript..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  {searchResults.length > 0 && (
                    <Badge variant="secondary">
                      {searchResults.length} results
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div ref={transcriptRef} className="space-y-2">
                  {transcript.map((item: TranscriptItem, index: number) => {
                    const isCurrent = currentTime >= item.start && currentTime <= item.end;
                    const isSearchResult = searchResults.some(result => result.index === index);
                    
                    return (
                      <div
                        key={`${item.start}-${index}`}
                        id={`transcript-${item.start}`}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          isCurrent 
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
                            : isSearchResult
                            ? 'bg-yellow-50 dark:bg-yellow-900/20'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-900/50'
                        }`}
                        onClick={() => handleSeek(item.start)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">
                              {formatTime(item.start)} - {formatTime(item.end)}
                            </p>
                            <p className="text-sm leading-relaxed">{item.text}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedText(item.text);
                            }}
                          >
                            <Tag className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Tags */}
          {tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      style={{ backgroundColor: tag.color }}
                      className="text-white"
                    >
                      {tag.text}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Analysis Sidebar */}
        <div className="space-y-4">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {analysis.summary}
              </p>
            </CardContent>
          </Card>

          {/* Sentiment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Sentiment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge 
                variant={analysis.sentiment === 'positive' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {analysis.sentiment}
              </Badge>
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {analysis.keywords?.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Q&A */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Questions & Answers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.questions?.map((qa, index) => (
                  <div key={index} className="space-y-2">
                    <p className="text-sm font-medium">{qa.question}</p>
                    <p className="text-sm text-muted-foreground">{qa.answer}</p>
                    {index < analysis.questions!.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Metrics */}
          {analysis.metrics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{formatTime(analysis.metrics.total_duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speaker turns:</span>
                    <span>{analysis.metrics.speaker_turns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg response:</span>
                    <span>{analysis.metrics.average_response_length}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Technical terms:</span>
                    <span>{analysis.metrics.technical_terms_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence:</span>
                    <span>{(analysis.metrics.confidence_score * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Tag Modal */}
      {selectedText && (
        <Card className="fixed bottom-4 right-4 w-80 z-50">
          <CardHeader>
            <CardTitle className="text-sm">Add Tag</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Selected text:</p>
              <p className="text-sm bg-gray-50 dark:bg-gray-900 p-2 rounded">
                {selectedText}
              </p>
            </div>
            <Input
              placeholder="Tag name"
              value={tagText}
              onChange={(e) => setTagText(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Color:</span>
              <input
                type="color"
                value={tagColor}
                onChange={(e) => setTagColor(e.target.value)}
                className="w-8 h-8 rounded border"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddTag}>
                Add Tag
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setSelectedText('')}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
