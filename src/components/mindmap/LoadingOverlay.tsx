// src/features/mind-map/components/LoadingOverlay.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export const LoadingOverlay: React.FC<{ message?: string }> = ({
  message = 'Harita Oluşturuluyor...'
}) => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm'>
      <div className='text-center'>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className='mb-4 inline-block'
        >
          <Brain className='h-12 w-12 text-blue-500' />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='text-lg font-medium text-gray-700'
        >
          {message}
        </motion.div>
      </div>
    </div>
  );
};
