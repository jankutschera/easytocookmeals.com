'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Instruction } from '@/types/recipe';

interface CookModeProps {
  instructions: Instruction[];
  recipeTitle: string;
  onClose: () => void;
}

export function CookMode({ instructions, recipeTitle, onClose }: CookModeProps) {
  const sortedInstructions = [...instructions].sort(
    (a, b) => a.step_number - b.step_number
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPreset, setTimerPreset] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Wake lock to prevent screen from sleeping
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Request wake lock on mount
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        }
      } catch (err) {
        console.log('Wake lock not available:', err);
      }
    };

    requestWakeLock();

    return () => {
      wakeLockRef.current?.release();
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            // Play sound when timer completes
            playTimerSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerRunning, timerSeconds]);

  const playTimerSound = () => {
    // Simple beep using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 500);
    } catch (err) {
      console.log('Audio not available');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = (minutes: number) => {
    setTimerSeconds(minutes * 60);
    setTimerPreset(minutes);
    setTimerRunning(true);
  };

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(timerPreset ? timerPreset * 60 : 0);
  };

  const currentInstruction = sortedInstructions[currentStep];
  const progress = ((currentStep + 1) / sortedInstructions.length) * 100;

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < sortedInstructions.length) {
      setCurrentStep(step);
    }
  }, [sortedInstructions.length]);

  const markComplete = () => {
    setCompletedSteps((prev) => new Set(prev).add(currentInstruction.step_number));
    if (currentStep < sortedInstructions.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  const isComplete = completedSteps.size === sortedInstructions.length;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        if (currentStep < sortedInstructions.length - 1) {
          goToStep(currentStep + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStep > 0) {
          goToStep(currentStep - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, sortedInstructions.length, goToStep, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-ink flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 bg-ink-dark px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-2"
            aria-label="Exit cook mode"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div>
            <p className="text-white/50 text-sm">Cook Mode</p>
            <h1 className="text-white font-medium truncate max-w-[200px] md:max-w-none">
              {recipeTitle}
            </h1>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="text-white text-right">
          <p className="text-2xl font-bold">
            {currentStep + 1}<span className="text-white/50">/{sortedInstructions.length}</span>
          </p>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-white/10">
        <div
          className="h-full bg-terracotta-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 md:p-12 flex flex-col items-center justify-center">
        {isComplete ? (
          // Completion screen
          <div className="text-center">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-4xl md:text-5xl font-display text-white mb-4">
              Recipe Complete!
            </h2>
            <p className="text-white/70 text-xl mb-8">
              You've finished all the steps. Enjoy your meal!
            </p>
            <button
              onClick={onClose}
              className="px-8 py-4 bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium rounded-organic transition-colors text-lg"
            >
              Exit Cook Mode
            </button>
          </div>
        ) : (
          // Step display
          <div className="max-w-3xl w-full text-center">
            {/* Step number */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-terracotta-500 text-white text-2xl font-bold mb-8">
              {currentInstruction.step_number}
            </div>

            {/* Step text */}
            <p className="text-2xl md:text-4xl lg:text-5xl text-white leading-relaxed font-body mb-8">
              {currentInstruction.text}
            </p>

            {/* Step tip */}
            {currentInstruction.tip && (
              <div className="inline-flex items-start gap-3 p-4 bg-amber-500/20 rounded-xl text-left max-w-lg">
                <span className="text-2xl flex-shrink-0">💡</span>
                <p className="text-amber-200 text-lg">{currentInstruction.tip}</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Timer section */}
      <div className="flex-shrink-0 bg-ink-dark border-t border-white/10 px-4 py-4">
        <div className="max-w-xl mx-auto">
          {/* Timer display */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-4xl md:text-5xl font-mono text-white">
              {formatTime(timerSeconds)}
            </div>

            {timerSeconds > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={toggleTimer}
                  className={`p-3 rounded-full transition-colors ${
                    timerRunning
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                  aria-label={timerRunning ? 'Pause timer' : 'Start timer'}
                >
                  {timerRunning ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={resetTimer}
                  className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                  aria-label="Reset timer"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Timer presets */}
          <div className="flex flex-wrap justify-center gap-2">
            {[1, 3, 5, 10, 15, 20, 30].map((mins) => (
              <button
                key={mins}
                onClick={() => startTimer(mins)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-organic transition-colors text-sm"
              >
                {mins} min
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation footer */}
      <footer className="flex-shrink-0 bg-ink-dark border-t border-white/10 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {/* Previous button */}
          <button
            onClick={() => goToStep(currentStep - 1)}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-organic transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden md:inline">Previous</span>
          </button>

          {/* Step dots */}
          <div className="flex gap-2 overflow-x-auto py-2">
            {sortedInstructions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToStep(idx)}
                className={`w-3 h-3 rounded-full flex-shrink-0 transition-all ${
                  idx === currentStep
                    ? 'bg-terracotta-500 scale-125'
                    : completedSteps.has(sortedInstructions[idx].step_number)
                    ? 'bg-green-500'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next / Complete button */}
          {currentStep < sortedInstructions.length - 1 ? (
            <button
              onClick={markComplete}
              className="flex items-center gap-2 px-6 py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-organic transition-colors font-medium"
            >
              <span>Done</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={markComplete}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-organic transition-colors font-medium"
            >
              <span>Finish</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
