'use client';

import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/localStorage';

interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  isBreak: boolean;
  timeLeft: number;
}

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = getStorageItem<PomodoroSettings>(STORAGE_KEYS.POMODORO_SETTINGS, {
      workDuration: 25,
      breakDuration: 5,
      isBreak: false,
      timeLeft: 25 * 60
    });

    setWorkDuration(savedSettings.workDuration);
    setBreakDuration(savedSettings.breakDuration);
    setIsBreak(savedSettings.isBreak);
    setTimeLeft(savedSettings.timeLeft);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.POMODORO_SETTINGS, {
      workDuration,
      breakDuration,
      isBreak,
      timeLeft
    });
  }, [workDuration, breakDuration, isBreak, timeLeft]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Play sound when timer ends
      const audio = new Audio('/notification.mp3');
      audio.play().catch(err => console.log('Audio play failed:', err));
      
      // Switch between work and break
      setIsBreak(prev => !prev);
      setTimeLeft(isBreak ? workDuration * 60 : breakDuration * 60);
      setIsRunning(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, isBreak, workDuration, breakDuration]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(workDuration * 60);
  };

  const updateDuration = (type: 'work' | 'break', value: number) => {
    if (value < 1) value = 1;
    if (value > 60) value = 60;
    
    if (type === 'work') {
      setWorkDuration(value);
      if (!isBreak && !isRunning) {
        setTimeLeft(value * 60);
      }
    } else {
      setBreakDuration(value);
      if (isBreak && !isRunning) {
        setTimeLeft(value * 60);
      }
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-center">
      <h3 className="text-lg font-semibold mb-4">
        {isBreak ? 'Break Time' : 'Work Time'}
      </h3>
      
      <div className="text-4xl font-bold mb-4 font-mono">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Work Duration (min)</label>
          <input
            type="number"
            value={workDuration}
            onChange={(e) => updateDuration('work', parseInt(e.target.value))}
            className="w-20 p-1 bg-gray-700 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="60"
            disabled={isRunning}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Break Duration (min)</label>
          <input
            type="number"
            value={breakDuration}
            onChange={(e) => updateDuration('break', parseInt(e.target.value))}
            className="w-20 p-1 bg-gray-700 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="60"
            disabled={isRunning}
          />
        </div>
      </div>
      
      <div className="space-x-4">
        <button
          onClick={toggleTimer}
          className={`px-6 py-2 rounded transition-all duration-300 transform hover:scale-105 ${
            isRunning
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={resetTimer}
          className="px-6 py-2 rounded bg-gray-600 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
