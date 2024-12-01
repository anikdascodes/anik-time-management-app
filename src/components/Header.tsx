'use client';

import { useEffect, useState } from 'react';

export default function Header() {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [day, setDay] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Update time (HH:MM:SS)
      setTime(now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
      }));

      // Update date (DD-MM-YYYY)
      setDate(now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }));

      // Update day
      setDay(now.toLocaleDateString('en-US', { weekday: 'long' }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-gray-900 p-4 rounded-lg shadow-lg mb-6">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-2">
        <h1 className="text-4xl font-bold tracking-wider">{time}</h1>
        <div className="flex space-x-4 text-gray-300">
          <p>{date}</p>
          <span>|</span>
          <p>{day}</p>
        </div>
      </div>
    </header>
  );
}
