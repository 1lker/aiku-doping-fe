// src/utils/feedback.ts
import confetti from 'canvas-confetti';

export const playCorrectAnswerFeedback = () => {
  // Konfeti efekti
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#4ade80', '#22c55e', '#16a34a'],
  });

  // Ses efekti (opsiyonel)
  const audio = new Audio('/sounds/correct.mp3');
  audio.play().catch(() => {}); // Ses çalmazsa hata verme
};

export const playWrongAnswerFeedback = () => {
  // Shake animasyonu için element class'ı değiştir
  document.body.classList.add('shake');
  setTimeout(() => {
    document.body.classList.remove('shake');
  }, 500);

  // Ses efekti (opsiyonel)
  const audio = new Audio('/sounds/wrong.mp3');
  audio.play().catch(() => {});
};