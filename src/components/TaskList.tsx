'use client';

import { Task } from '@/types';
import { Clock, Check, Trash2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  const formatTimeRange = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return '';
    
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours));
      date.setMinutes(parseInt(minutes));
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };

    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`bg-gray-800 p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg ${
            task.completed ? 'opacity-75' : ''
          }`}
        >
          <div className="flex items-start gap-3">
            <button
              onClick={() => onToggleTask(task.id)}
              className={`shrink-0 h-6 w-6 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                task.completed
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <Check className={`h-4 w-4 ${task.completed ? 'text-white' : 'text-transparent'}`} />
            </button>

            <div className="flex-1 min-w-0">
              <h3 className={`font-medium truncate ${task.completed ? 'line-through text-gray-400' : ''}`}>
                {task.title}
              </h3>

              {(task.startTime || task.endTime) && (
                <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatTimeRange(task.startTime, task.endTime)}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => onDeleteTask(task.id)}
              className="shrink-0 h-6 w-6 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-all duration-300 hover:scale-110 flex items-center justify-center"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {tasks.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No tasks yet. Add one to get started!</p>
        </div>
      )}
    </div>
  );
}
