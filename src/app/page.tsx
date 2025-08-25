
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileAudio, Brain, Search, Tag, TrendingUp } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to interviews page after 3 seconds
    const timer = setTimeout(() => {
      router.push('/interviews');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            <FileAudio className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-3xl font-bold">HR Interview Transcription & Analysis</CardTitle>
          <CardDescription className="text-lg">
            Upload, transcribe, and analyze your interview recordings with AI-powered insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <FileAudio className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <p className="text-sm font-medium">File Upload</p>
              <p className="text-xs text-muted-foreground">MP3, WAV, MP4, MOV</p>
            </div>
            <div className="text-center">
              <Brain className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <p className="text-sm font-medium">AI Analysis</p>
              <p className="text-xs text-muted-foreground">Summary & Insights</p>
            </div>
            <div className="text-center">
              <Search className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <p className="text-sm font-medium">Smart Search</p>
              <p className="text-xs text-muted-foreground">Find & Highlight</p>
            </div>
            <div className="text-center">
              <Tag className="h-8 w-8 mx-auto text-orange-500 mb-2" />
              <p className="text-sm font-medium">Tagging</p>
              <p className="text-xs text-muted-foreground">Organize & Track</p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push('/interviews')} size="lg">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Redirecting to dashboard in 3 seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
