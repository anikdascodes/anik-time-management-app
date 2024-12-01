'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { Clock } from 'lucide-react';

export default function AddTaskForm({ onAddTask }: { onAddTask: (task: Task) => void }) {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      startTime,
      endTime,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    onAddTask(newTask);
    setTitle('');
    setStartTime('');
    setEndTime('');
    setIsLoading(false);
  };

  // Helper function to get current time rounded to nearest 30 minutes
  const getRoundedTime = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 30) * 30;
    now.setMinutes(roundedMinutes);
    now.setSeconds(0);
    return now.toTimeString().slice(0, 5);
  };

  // Set default times when time inputs are focused
  const handleTimeFieldFocus = (field: 'start' | 'end') => {
    if (field === 'start' && !startTime) {
      setStartTime(getRoundedTime());
    } else if (field === 'end' && !endTime) {
      const start = startTime || getRoundedTime();
      const [hours, minutes] = start.split(':').map(Number);
      const endDate = new Date();
      endDate.setHours(hours);
      endDate.setMinutes(minutes + 30);
      setEndTime(endDate.toTimeString().slice(0, 5));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 p-4 rounded-lg shadow-lg">
      <div>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Clock className="w-4 h-4" />
          </div>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            onFocus={() => handleTimeFieldFocus('start')}
            className="w-full pl-10 p-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Clock className="w-4 h-4" />
          </div>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            onFocus={() => handleTimeFieldFocus('end')}
            className="w-full pl-10 p-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!title.trim() || isLoading}
        className={`w-full p-2 rounded text-white font-medium transition-all duration-300 ${
          isLoading
            ? 'bg-blue-600 cursor-wait'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isLoading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}
