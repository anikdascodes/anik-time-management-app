'use client';

import { useState, useEffect } from 'react';
import { CalendarDays } from "lucide-react";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/localStorage';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Note {
  date: string;
  content: string;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = getStorageItem<Note[]>(STORAGE_KEYS.CALENDAR_NOTES, []);
    setNotes(savedNotes);
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.CALENDAR_NOTES, notes);
  }, [notes]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + offset)));
  };

  const handleDateClick = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateString);
    const existingNote = notes.find(note => note.date === dateString);
    setNoteContent(existingNote?.content || '');
    setShowDialog(true);
  };

  const handleSaveNote = () => {
    if (selectedDate && noteContent.trim()) {
      setNotes(prevNotes => {
        const newNotes = prevNotes.filter(note => note.date !== selectedDate);
        return [...newNotes, { date: selectedDate, content: noteContent.trim() }];
      });
    }
    setShowDialog(false);
  };

  const handleDeleteNote = () => {
    if (selectedDate) {
      setNotes(prevNotes => prevNotes.filter(note => note.date !== selectedDate));
    }
    setShowDialog(false);
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-10"></div>);
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const hasNote = notes.some(note => note.date === dateString);
    const isToday = new Date().getDate() === i && 
                    new Date().getMonth() === currentDate.getMonth() &&
                    new Date().getFullYear() === currentDate.getFullYear();
    
    const dayElement = (
      <div
        key={i}
        onClick={() => handleDateClick(i)}
        className={`h-10 flex items-center justify-center rounded-full cursor-pointer
          ${isToday ? 'bg-blue-600 text-white' : ''}
          ${hasNote ? 'border-2 border-green-500' : 'hover:bg-gray-700'}`}
      >
        {hasNote ? (
          <HoverCard>
            <HoverCardTrigger>
              <div className="w-full h-full flex items-center justify-center">
                {i}
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-gray-800 text-white border-gray-700">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Note</h4>
                  <p className="text-sm">
                    {notes.find(note => note.date === dateString)?.content}
                  </p>
                  <div className="flex items-center pt-2">
                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                    <span className="text-xs text-gray-400">
                      {dateString}
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ) : (
          i
        )}
      </div>
    );
    
    days.push(dayElement);
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="p-2 hover:bg-gray-700 rounded"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button
          onClick={() => changeMonth(1)}
          className="p-2 hover:bg-gray-700 rounded"
        >
          →
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-gray-400 text-sm">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>{selectedDate ? `Notes for ${selectedDate}` : 'Add Note'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full h-32 p-2 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your note here..."
            />
          </div>
          <DialogFooter className="flex justify-between">
            <button
              onClick={handleDeleteNote}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={handleSaveNote}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
