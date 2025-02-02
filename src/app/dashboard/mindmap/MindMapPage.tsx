'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CourseSelection } from '@/components/study/CourseSelection';
import { UnitSelection } from '@/components/study/UnitSelection';
import { LoadingOverlay } from '@/components/mindmap/LoadingOverlay';
import { ErrorBoundary } from '@/components/mindmap/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Book, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MermaidRenderer from '@/components/ui/mermaid';

const SAMPLE_UNITS = [
  {
    value: 'unit1',
    label: 'Solunum Sistemi'
  },
  {
    value: 'unit2',
    label: 'Dolaşım Sistemi'
  }
];

export default function MindMapPage() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [loading, setLoading] = useState(false);
  const [mindMapData, setMindMapData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateMindMap = async () => {
    if (!selectedCourse || !selectedUnit) {
      toast({
        title: 'Hata',
        description: 'Lütfen ders ve ünite seçin.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/mindmap/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseId: selectedCourse,
          unitId: selectedUnit
        })
      });

      if (!response.ok) {
        throw new Error('Mindmap oluşturulurken bir hata oluştu');
      }

      const data = await response.json();
      setMindMapData(data[0]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu'
      );
      toast({
        title: 'Hata',
        description: 'Harita oluşturulurken bir hata oluştu.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className='container mx-auto max-w-7xl space-y-6 px-4 py-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-blue-900'>Konu Haritası</h1>
            <p className='mt-2 text-gray-600'>
              Konuları görsel olarak keşfet ve bağlantıları öğren
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          >
            <Brain className='h-12 w-12 text-blue-500' />
          </motion.div>
        </div>

        {!mindMapData ? (
          <motion.div
            key='setup'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='space-y-6'
          >
            <Card>
              <CardContent className='p-6'>
                <div className='grid gap-6 md:grid-cols-2'>
                  <div>
                    <CourseSelection
                      courses={[
                        {
                          value: 'biology',
                          label: 'Biyoloji',
                          description: '9. Sınıf Biyoloji',
                          icon: <Book className='h-5 w-5 text-green-500' />
                        }
                      ]}
                      selectedCourse={selectedCourse}
                      onSelect={setSelectedCourse}
                    />
                  </div>

                  {selectedCourse && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <UnitSelection
                        units={SAMPLE_UNITS}
                        selectedUnits={selectedUnit ? [selectedUnit] : []}
                        onSelectUnits={(units) => setSelectedUnit(units[0])}
                      />
                    </motion.div>
                  )}
                </div>

                {selectedCourse && selectedUnit && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mt-6'
                  >
                    <Button
                      size='lg'
                      className='w-full'
                      onClick={handleGenerateMindMap}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Harita Oluşturuluyor...
                        </>
                      ) : (
                        <>
                          <Brain className='mr-2 h-4 w-4' />
                          Harita Oluştur
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key='mindmap'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='space-y-4'
          >
            <Button
              variant='outline'
              onClick={() => {
                setMindMapData(null);
                setSelectedUnit('');
              }}
            >
              Yeni Harita
            </Button>
            <MermaidRenderer initialCode={mindMapData} />
          </motion.div>
        )}

        {loading && <LoadingOverlay />}
      </div>
    </ErrorBoundary>
  );
}
