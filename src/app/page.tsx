'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AddTaskForm from '@/components/AddTaskForm';
import TaskList from '@/components/TaskList';
import Tools from '@/components/Tools';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/localStorage';
import { Task } from '@/types';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = getStorageItem<Task[]>(STORAGE_KEYS.TASKS, []);
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.TASKS, tasks);
  }, [tasks]);

  const handleAddTask = (task: Task) => {
    setTasks(prevTasks => [...prevTasks, task]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Header />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Task Management */}
        <div className="space-y-6">
          <AddTaskForm onAddTask={handleAddTask} />
          <TaskList
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
        
        {/* Right Column - Tools */}
        <div>
          <Tools />
        </div>
      </div>
    </main>
  );
}
