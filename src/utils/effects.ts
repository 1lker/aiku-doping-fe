// src/features/express-doping/utils/effects.ts
import confetti from 'canvas-confetti';

class GameEffects {
  private audioContext: AudioContext | null = null;
  private soundCache: { [key: string]: AudioBuffer } = {};
  private soundGain: GainNode | null = null;

  constructor() {
    // AudioContext'i kullanıcı etkileşimi ile başlatmak için boş bırakıyoruz
    this.initAudio();
  }

  private async initAudio() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      this.soundGain = this.audioContext.createGain();
      this.soundGain.connect(this.audioContext.destination);
    }
  }

  public async playCorrectAnimation() {
    // Konfeti efekti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4CAF50', '#8BC34A', '#CDDC39']
    });

    // Doğru cevap sesi
    await this.playSound('/sounds/correct.mp3');
  }

  public async playWrongAnimation() {
    // Yanlış cevap görsel efekti
    const shake = [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(0)' }
    ];

    document.body.animate(shake, {
      duration: 200,
      iterations: 1
    });

    // Yanlış cevap sesi
    await this.playSound('/sounds/wrong.mp3');
  }

  public async playTickSound() {
    await this.playSound('/sounds/tick.mp3');
  }

  public async playWinSound() {
    await this.playSound('/sounds/win.mp3');
  }

    public async playPointSound() {
        await this.playSound('/sounds/point.mp3');
    }

  public celebrateWin() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    let skew = 1;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const frame = () => {
      const timeLeft = animationEnd - Date.now();
      const ticks = Math.max(200, 500 * (timeLeft / duration));

      skew = Math.max(0.8, skew - 0.001);

      confetti({
        particleCount: 1,
        startVelocity: 0,
        ticks: ticks,
        origin: {
          x: Math.random(),
          y: Math.random() * skew - 0.2,
        },
        colors: ['#FFD700', '#FFA500', '#FF4500'],
        shapes: ['star'],
        gravity: randomInRange(0.4, 0.6),
        scalar: randomInRange(0.8, 1.4),
        drift: randomInRange(-0.4, 0.4),
      });

      if (timeLeft > 0) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }

  private async playSound(url: string) {
    try {
      await this.initAudio();

      if (!this.audioContext || !this.soundGain) return;

      // Önbellekte var mı kontrol et
      if (!this.soundCache[url]) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        this.soundCache[url] = await this.audioContext.decodeAudioData(arrayBuffer);
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = this.soundCache[url];
      source.connect(this.soundGain);
      source.start(0);
    } catch (error) {
      console.error('Sound playback failed:', error);
    }
  }

  public getTimerAnimation(timeLeft: number) {
    if (timeLeft <= 5) {
      return {
        scale: [1, 1.2, 1],
        color: ['#EF4444', '#000000']
      };
    }
    return {};
  }

  public getQuestionTransition() {
    return {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 },
      transition: { type: "spring", duration: 0.5 }
    };
  }

  public getAnswerAnimation(index: number) {
    return {
      initial: { x: 50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      transition: {
        delay: 0.1 * index,
        type: "spring",
        stiffness: 100
      }
    };
  }
}

export const gameEffects = new GameEffects();