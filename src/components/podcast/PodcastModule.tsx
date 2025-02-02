'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Loader2, Mic, Download, Play, Pause } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PodcastModuleProps {
  courseId: string;
  unitId: string;
  questionId: string;
}

export function PodcastModule({
  courseId,
  unitId,
  questionId
}: PodcastModuleProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [podcastUrl, setPodcastUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [progress, setProgress] = useState(0);

  const generatePodcast = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-podcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId, unitId, questionId })
      });
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      const data = await response.json();
      setPodcastUrl(data.podcastUrl);
    } catch (error) {
      console.error('Error generating podcast:', error);
      // Burada bir hata mesajı gösterebilirsiniz
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayPause = useCallback(() => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [audioElement, isPlaying]);

  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
  }, []);

  const updateProgress = useCallback(() => {
    if (audioElement) {
      const progressValue =
        (audioElement.currentTime / audioElement.duration) * 100;
      setProgress(progressValue);
    }
  }, [audioElement]);

  useEffect(() => {
    if (podcastUrl) {
      const audio = new Audio(podcastUrl);
      audio.addEventListener('ended', handleAudioEnded);
      audio.addEventListener('timeupdate', updateProgress);
      setAudioElement(audio);
      return () => {
        audio.removeEventListener('ended', handleAudioEnded);
        audio.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, [podcastUrl, handleAudioEnded, updateProgress]);

  return (
    <Card className='bg-white/90 shadow-lg backdrop-blur-sm'>
      <CardHeader>
        <CardTitle className='text-xl font-semibold text-indigo-700'>
          Podcast Oluştur
        </CardTitle>
        <CardDescription>
          Seçilen soru için bir podcast oluşturun
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <AnimatePresence mode='wait'>
          {!podcastUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='w-full'
            >
              <Button
                className='w-full transform rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 font-medium text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:from-indigo-600 hover:to-purple-700'
                onClick={generatePodcast}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                    Podcast Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Mic className='mr-2 h-5 w-5' />
                    Podcast Oluştur
                  </>
                )}
              </Button>
            </motion.div>
          )}
          {podcastUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='w-full space-y-4'
            >
              <div className='flex justify-center space-x-4'>
                <Button
                  onClick={togglePlayPause}
                  className='transform rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-600'
                >
                  {isPlaying ? (
                    <Pause className='h-5 w-5' />
                  ) : (
                    <Play className='h-5 w-5' />
                  )}
                  {isPlaying ? 'Duraklat' : 'Oynat'}
                </Button>
                <Button
                  variant='outline'
                  asChild
                  className='transform rounded-lg bg-white px-4 py-2 font-medium text-indigo-600 shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-gray-100'
                >
                  <a href={podcastUrl} download>
                    <Download className='mr-2 h-5 w-5' />
                    İndir
                  </a>
                </Button>
              </div>
              <div className='relative pt-1'>
                <Progress value={progress} className='h-2 w-full' />
                <div className='mt-1 flex justify-between text-xs text-gray-600'>
                  <span>{Math.floor(progress)}%</span>
                  <span>{100 - Math.floor(progress)}%</span>
                </div>
              </div>
              <audio
                src={podcastUrl}
                className='w-full'
                controls
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
