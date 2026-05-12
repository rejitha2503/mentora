'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './DashboardContent.module.css';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  const roadmapPreview = [
    { id: '1', title: 'HTML & CSS Fundamentals', status: 'completed', icon: '✓' },
    { id: '2', title: 'JavaScript Essentials', status: 'current', icon: '2' },
    { id: '3', title: 'React Framework', status: 'locked', icon: '3' },
  ];

  const dailyTasks = [
    { id: '1', title: 'Solve 1 LeetCode problem', xp: 50, done: true },
    { id: '2', title: 'Watch a React tutorial', xp: 30, done: false },
    { id: '3', title: 'Update LinkedIn profile', xp: 20, done: false },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.welcome}>Welcome back, {user?.full_name.split(' ')[0]}! 👋</h1>
        <p className={styles.subtitle}>You're doing great. Keep up the momentum to reach your goal.</p>
      </header>

      <div className={styles.grid}>
        {/* Left Column: Roadmap */}
        <section className={styles.roadmapSection}>
          <h2 className={styles.sectionTitle}>
            <span>🗺️</span> Current Roadmap
          </h2>
          <div className={styles.card}>
            <div className={styles.roadmapList}>
              {roadmapPreview.map((step) => (
                <div 
                  key={step.id} 
                  className={`${styles.roadmapItem} ${step.status === 'current' ? styles.roadmapItemActive : ''}`}
                >
                  <div className={`
                    ${styles.stepIcon} 
                    ${step.status === 'completed' ? styles.stepIconDone : ''}
                    ${step.status === 'current' ? styles.stepIconCurrent : ''}
                    ${step.status === 'locked' ? styles.stepIconLocked : ''}
                  `}>
                    {step.icon}
                  </div>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepStatus}>
                      {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                    </p>
                  </div>
                  {step.status === 'current' && (
                    <Link href="/dashboard/roadmap" className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                      Continue
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <Link href="/dashboard/roadmap" style={{ display: 'block', marginTop: '20px', textAlign: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '600' }}>
              View Full Roadmap →
            </Link>
          </div>

          <h2 className={styles.sectionTitle} style={{ marginTop: '32px' }}>
            <span>🚀</span> Quick Actions
          </h2>
          <div className={styles.quickActions}>
            <Link href="/dashboard/chat" className={styles.actionCard}>
              <span className={styles.actionIcon}>🤖</span>
              <span className={styles.actionLabel}>AI Mentor</span>
            </Link>
            <Link href="/dashboard/resume" className={styles.actionCard}>
              <span className={styles.actionIcon}>📄</span>
              <span className={styles.actionLabel}>Analyze Resume</span>
            </Link>
            <Link href="/dashboard/comms" className={styles.actionCard}>
              <span className={styles.actionIcon}>🎤</span>
              <span className={styles.actionLabel}>Practice Pitch</span>
            </Link>
          </div>
        </section>

        {/* Right Column: Daily Tasks & Stats */}
        <aside className={styles.sidebarSection}>
          <h2 className={styles.sectionTitle}>
            <span>⚡</span> Daily Tasks
          </h2>
          <div className={styles.card}>
            <div className={styles.taskList}>
              {dailyTasks.map((task) => (
                <div key={task.id} className={styles.taskItem}>
                  <div className={`${styles.taskCheck} ${task.done ? styles.taskCheckDone : ''}`}>
                    {task.done && '✓'}
                  </div>
                  <span className={styles.taskLabel}>{task.title}</span>
                  <span className={styles.taskXP}>+{task.xp} XP</span>
                </div>
              ))}
            </div>
            <Link href="/dashboard/tasks" style={{ display: 'block', marginTop: '20px', textAlign: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '600' }}>
              All Tasks →
            </Link>
          </div>

          <h2 className={styles.sectionTitle} style={{ marginTop: '32px' }}>
            <span>🏆</span> Your Stats
          </h2>
          <div className={styles.card}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Current Level</span>
                  <span style={{ fontWeight: '700', color: 'var(--primary)' }}>Level {user?.level}</span>
                </div>
                <div className="xp-bar">
                  <div className="xp-fill" style={{ width: `${((user?.xp || 0) % 500) / 500 * 100}%` }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '8px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '800' }}>🔥 {user?.streak}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Streak</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '800' }}>✨ {user?.xp}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Total XP</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
