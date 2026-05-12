'use client';

import React from 'react';
import styles from './Roadmap.module.css';
import { careerApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const DEFAULT_STEPS = [
  { 
    id: '1', 
    title: 'Foundations of Web Development', 
    description: 'Master HTML5, CSS3, and modern layouts using Flexbox and Grid.',
    skills: ['HTML5', 'CSS3', 'Responsive Design'],
    status: 'completed',
    xp: 500
  },
  { 
    id: '2', 
    title: 'JavaScript Mastery', 
    description: 'Deep dive into ES6+, async programming, and DOM manipulation.',
    skills: ['JavaScript', 'Async/Await', 'ES6+'],
    status: 'current',
    xp: 750
  },
  { 
    id: '3', 
    title: 'React & Frontend Frameworks', 
    description: 'Build complex UIs with React, hooks, and state management.',
    skills: ['React', 'Next.js', 'Tailwind CSS'],
    status: 'locked',
    xp: 1000
  },
  { 
    id: '4', 
    title: 'Backend & APIs', 
    description: 'Learn to build scalable servers and RESTful APIs.',
    skills: ['Node.js', 'FastAPI', 'PostgreSQL'],
    status: 'locked',
    xp: 1200
  },
];

export default function RoadmapPage() {
  const { user } = useAuth();
  const [steps, setSteps] = React.useState(DEFAULT_STEPS);

  React.useEffect(() => {
    if (user) {
      careerApi.getRoadmap(user.id).then(data => {
        if (data.steps && data.steps.length > 0) {
          setSteps(data.steps);
        }
      });
    }
  }, [user]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Career Roadmap 🗺️</h1>
        <p className={styles.subtitle}>Your personalized path to becoming a Senior Full-Stack Developer.</p>
      </header>

      <div className={styles.timeline}>
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`${styles.stepCard} ${styles[step.status as keyof typeof styles] || ''}`}
          >
            <div className={styles.stepMarker}>
              <div className={styles.markerCircle}>
                {step.status === 'completed' ? '✓' : index + 1}
              </div>
              {index !== steps.length - 1 && <div className={styles.markerLine} />}
            </div>
            
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <span className={styles.xpBadge}>+{step.xp} XP</span>
              </div>
              <p className={styles.stepDescription}>{step.description}</p>
              <div className={styles.skillsList}>
                {step.skills.map(skill => (
                  <span key={skill} className={styles.skillTag}>{skill}</span>
                ))}
              </div>
              {step.status === 'current' && (
                <button className="btn-primary" style={{ marginTop: '16px' }}>Start Module</button>
              )}
              {step.status === 'locked' && (
                <div className={styles.lockedOverlay}>
                  <span>🔒 Module Locked</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
