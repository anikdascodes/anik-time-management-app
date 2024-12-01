'use client';

import { useState, useEffect } from 'react';
import Calendar from './tools/Calendar';
import PomodoroTimer from './tools/PomodoroTimer';
import Stopwatch from './tools/Stopwatch';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/localStorage';

export default function Tools() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  // Load active tool from localStorage on mount
  useEffect(() => {
    const savedActiveTool = getStorageItem<string | null>(STORAGE_KEYS.ACTIVE_TOOL, null);
    setActiveTool(savedActiveTool);
  }, []);

  // Save active tool to localStorage whenever it changes
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ACTIVE_TOOL, activeTool);
  }, [activeTool]);

  const tools = [
    { name: 'Calendar', icon: '📅', component: Calendar },
    { name: 'Pomodoro', icon: '⏲️', component: PomodoroTimer },
    { name: 'Stopwatch', icon: '⏱️', component: Stopwatch },
  ];

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-xl font-bold mb-4">Tools</h2>
      <div className="space-y-4">
        {tools.map((tool) => (
          <div key={tool.name} className="space-y-2">
            <button
              onClick={() => setActiveTool(activeTool === tool.name ? null : tool.name)}
              className={`w-full p-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] ${
                activeTool === tool.name
                  ? 'bg-blue-600 text-white shadow-lg scale-[1.02]'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <span className="text-2xl mr-2 transition-transform duration-300 inline-block group-hover:scale-110">
                {tool.icon}
              </span>
              {tool.name}
            </button>
            
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                activeTool === tool.name
                  ? 'max-h-[500px] opacity-100 transform translate-y-0'
                  : 'max-h-0 opacity-0 transform -translate-y-4'
              }`}
            >
              {activeTool === tool.name && (
                <div className="transform transition-all duration-300">
                  {(() => {
                    const ToolComponent = tool.component;
                    return <ToolComponent />;
                  })()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
