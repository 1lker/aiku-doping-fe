// src/features/mind-map/utils/export.ts
export const exportToImage = async (
  elementId: string,
  filename: string = 'mindmap.png'
) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  // Dynamic import html2canvas
  const html2canvas = (await import('html2canvas')).default;

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2, // Better quality
      logging: false
    });

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
  } catch (err) {
    console.error('Error exporting image:', err);
    throw err;
  }
};
