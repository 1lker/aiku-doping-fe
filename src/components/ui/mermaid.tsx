'use client';

import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Maximize2, Download, Minimize2, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

interface MermaidRendererProps {
  initialCode?: string;
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({
  initialCode = ''
}) => {
  const [mermaidCode, setMermaidCode] = useState<string>(initialCode || '');
  const [renderedDiagram, setRenderedDiagram] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
  }, []);

  useEffect(() => {
    // Clear any existing timeout
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }

    // Set a new timeout to render the diagram
    renderTimeoutRef.current = setTimeout(() => {
      const renderDiagram = async () => {
        try {
          setError(null);
          const { svg } = await mermaid.render('mermaid-diagram', mermaidCode);
          setRenderedDiagram(svg);
        } catch (err) {
          setError(
            'Error rendering diagram. Please check your Mermaid syntax.'
          );
          console.error(err);
          setRenderedDiagram('');
        }
      };

      if (mermaidCode.trim()) {
        renderDiagram();
      }
    }, 2000);

    // Cleanup timeout on unmount or code change
    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [mermaidCode]);

  const handleExport = () => {
    if (!renderedDiagram) return;

    // Start export process
    setIsExporting(true);

    // Create a temporary canvas to convert SVG to high-resolution image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Increase resolution (4x scaling)
        const scaleFactor = 4;
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;

        // Scale context before drawing
        ctx?.scale(scaleFactor, scaleFactor);
        ctx?.drawImage(img, 0, 0);

        // Reset scale for toDataURL
        ctx?.scale(1 / scaleFactor, 1 / scaleFactor);

        // Convert to high-res data URL and download
        const link = document.createElement('a');
        link.download = 'mermaid-diagram-hd.png';
        link.href = canvas.toDataURL('image/png', 1.0); // Highest quality
        link.click();

        // Show success toast
        toast({
          title: 'Export Successful',
          description: 'High-resolution diagram has been downloaded.',
          duration: 3000
        });
      } catch (error) {
        // Show error toast
        toast({
          title: 'Export Failed',
          description: 'There was an error exporting the diagram.',
          variant: 'destructive',
          duration: 3000
        });
      } finally {
        // Always set exporting to false
        setIsExporting(false);
      }
    };

    img.onerror = () => {
      // Handle image loading error
      toast({
        title: 'Export Failed',
        description: 'Could not load diagram for export.',
        variant: 'destructive',
        duration: 3000
      });
      setIsExporting(false);
    };

    // Create SVG blob for image source
    const svgBlob = new Blob([renderedDiagram], { type: 'image/svg+xml' });
    img.src = URL.createObjectURL(svgBlob);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const renderDiagramContent = (isDialog = false) => (
    <div className={`overflow-x-auto ${isDialog ? 'p-4' : ''}`}>
      {error ? (
        <p className='text-red-500'>{error}</p>
      ) : renderedDiagram ? (
        <div
          className={`relative ${isDialog ? 'max-h-[80vh] max-w-full overflow-auto' : ''}`}
          dangerouslySetInnerHTML={{ __html: renderedDiagram }}
        />
      ) : (
        <p className='text-gray-500'>
          Diagram will render automatically in 2 seconds...
        </p>
      )}
    </div>
  );

  return (
    <div className='mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 lg:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle>Mermaid Code</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={mermaidCode}
            onChange={(e) => setMermaidCode(e.target.value)}
            placeholder='Enter your Mermaid code here...'
            className='min-h-[400px] font-mono'
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Rendered Diagram</CardTitle>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='icon'
              onClick={handleExport}
              disabled={!renderedDiagram}
            >
              <Download className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={toggleFullScreen}
              disabled={!renderedDiagram}
            >
              {isFullScreen ? (
                <Minimize2 className='h-4 w-4' />
              ) : (
                <Maximize2 className='h-4 w-4' />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>{renderDiagramContent()}</CardContent>
      </Card>

      <Dialog open={isFullScreen} onOpenChange={toggleFullScreen}>
        <DialogContent className='h-full max-h-[90vh] w-full max-w-[90vw]'>
          <DialogHeader>
            <DialogTitle>Fullscreen Diagram</DialogTitle>
          </DialogHeader>
          {renderDiagramContent(true)}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isExporting} onOpenChange={setIsExporting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className='flex items-center gap-2'>
                <Loader2 className='h-6 w-6 animate-spin' />
                Exporting Diagram
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Generating high-resolution diagram. Please wait...
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MermaidRenderer;
