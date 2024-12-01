'use client';

import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/localStorage';

interface StopwatchState {
  time: number;
  laps: number[];
}

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = getStorageItem<StopwatchState>(STORAGE_KEYS.STOPWATCH_STATE, {
      time: 0,
      laps: []
    });

    setTime(savedState.time);
    setLaps(savedState.laps);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.STOPWATCH_STATE, {
      time,
      laps
    });
  }, [time, laps]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 10); // Update every 10ms for smoother display
      }, 10);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const addLap = () => {
    setLaps(prev => [...prev, time]);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-center">
      <div className="text-4xl font-bold mb-4 font-mono">
        {formatTime(time)}
      </div>
      
      <div className="space-x-4 mb-4">
        <button
          onClick={toggleTimer}
          className={`px-6 py-2 rounded transition-all duration-300 transform hover:scale-105 ${
            isRunning
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        
        <button
          onClick={resetTimer}
          className="px-6 py-2 rounded bg-gray-600 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
        >
          Reset
        </button>
        
        <button
          onClick={addLap}
          disabled={!isRunning}
          className={`px-6 py-2 rounded transition-all duration-300 transform hover:scale-105 ${
            isRunning
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-700 cursor-not-allowed'
          }`}
        >
          Lap
        </button>
      </div>
      
      {laps.length > 0 && (
        <div className="mt-4 border-t border-gray-700 pt-4">
          <h4 className="text-lg font-semibold mb-2">Laps</h4>
          <div className="max-h-40 overflow-y-auto">
            {laps.map((lapTime, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-1 px-2 hover:bg-gray-700 rounded transition-colors duration-200"
              >
                <span>Lap {index + 1}</span>
                <span className="font-mono">{formatTime(lapTime)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
