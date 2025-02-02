// /mind-map/components/ErrorBoundary.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Card className='border-red-200 bg-red-50'>
          <CardContent className='p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <AlertTriangle className='h-6 w-6 text-red-500' />
              <h3 className='text-lg font-medium text-red-700'>
                Bir Hata Oluştu
              </h3>
            </div>
            <p className='mb-4 text-red-600'>
              Harita yüklenirken beklenmedik bir hata oluştu. Lütfen sayfayı
              yenileyin veya daha sonra tekrar deneyin.
            </p>
            <Button
              variant='outline'
              onClick={() => window.location.reload()}
              className='flex items-center gap-2'
            >
              <RefreshCcw className='h-4 w-4' />
              Sayfayı Yenile
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
