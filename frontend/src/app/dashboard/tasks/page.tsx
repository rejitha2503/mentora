'use client';

import React, { useState } from 'react';
import styles from './Tasks.module.css';
import { careerApi } from '@/lib/api';

const INITIAL_TASKS = [
  { id: '1', title: 'Complete HTML/CSS Module', category: 'Learning', xp: 100, done: true },
  { id: '2', title: 'Solve 2 JavaScript Challenges', category: 'Practice', xp: 50, done: false },
  { id: '3', title: 'Update Resume with new skills', category: 'Career', xp: 150, done: false },
  { id: '4', title: 'Network with 2 alumni', category: 'Networking', xp: 200, done: false },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (!task.done) {
      try {
        await careerApi.completeTask(id);
      } catch (error) {
        console.error('Failed to complete task:', error);
      }
    }
    
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const completedCount = tasks.filter(t => t.done).length;
  const progress = (completedCount / tasks.length) * 100;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Daily Quests ⚡</h1>
        <p className={styles.subtitle}>Complete your daily tasks to earn XP and level up your career.</p>
      </header>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span>Daily Goal</span>
          <span>{completedCount} / {tasks.length} Completed</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={styles.taskList}>
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`${styles.taskCard} ${task.done ? styles.taskDone : ''}`}
            onClick={() => toggleTask(task.id)}
          >
            <div className={styles.taskCheck}>
              {task.done && '✓'}
            </div>
            <div className={styles.taskInfo}>
              <h3 className={styles.taskTitle}>{task.title}</h3>
              <span className={styles.taskCategory}>{task.category}</span>
            </div>
            <div className={styles.taskXP}>+{task.xp} XP</div>
          </div>
        ))}
      </div>

      <div className={styles.streakCard}>
        <span className={styles.streakIcon}>🔥</span>
        <div className={styles.streakInfo}>
          <h3>12 Day Streak!</h3>
          <p>You're on fire! Keep it up for 3 more days to reach a 15-day milestone.</p>
        </div>
      </div>
    </div>
  );
}
