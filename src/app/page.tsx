'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import styles from './landing.module.css';

export default function LandingPage() {
  const { user, signInWithGoogle, loginAsDemo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!mounted) return null;

  return (
    <div className={styles.page}>
      {/* Animated background */}
      <div className={styles.bgOrbs}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>M</div>
            <span className={styles.logoText}>Mentora</span>
          </div>
          <div className={styles.navRight}>
            <button
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button className="btn-primary" onClick={signInWithGoogle}>
              Sign In
            </button>
            <button className="btn-secondary" onClick={loginAsDemo}>
              Demo Mode
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            AI-Powered Career Intelligence
          </div>
          <h1 className={styles.heroTitle}>
            Your Career Journey,{' '}
            <span className="gradient-text">Supercharged by AI</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Mentora creates personalized career roadmaps, daily growth tasks, and
            provides AI-powered mentorship to transform you from student to industry-ready professional.
          </p>
          <div className={styles.heroCTA}>
            <button className="btn-primary" onClick={signInWithGoogle} id="hero-signin">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
            <button className="btn-secondary" onClick={loginAsDemo}>
              Try Demo Mode
            </button>
          </div>

          {/* Stats */}
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>50K+</span>
              <span className={styles.statLabel}>Active Users</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>95%</span>
              <span className={styles.statLabel}>Career Growth</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>4.9★</span>
              <span className={styles.statLabel}>User Rating</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className={styles.heroVisual}>
          <div className={styles.dashboardPreview}>
            <div className={styles.previewHeader}>
              <div className={styles.previewDots}>
                <span /><span /><span />
              </div>
              <span className={styles.previewTitle}>Dashboard</span>
            </div>
            <div className={styles.previewBody}>
              <div className={styles.previewCard}>
                <div className={styles.previewLabel}>Level 7 • Full-Stack Dev</div>
                <div className="xp-bar" style={{ marginTop: 8 }}>
                  <div className="xp-fill" style={{ width: '68%' }} />
                </div>
                <div className={styles.previewXP}>2,450 / 3,500 XP</div>
              </div>
              <div className={styles.previewTasks}>
                <div className={styles.previewTask}>
                  <span className={styles.taskCheck}>✓</span>
                  <span>Complete React tutorial</span>
                  <span className={styles.taskXP}>+50 XP</span>
                </div>
                <div className={styles.previewTask}>
                  <span className={styles.taskCheck}>✓</span>
                  <span>Practice SQL queries</span>
                  <span className={styles.taskXP}>+30 XP</span>
                </div>
                <div className={`${styles.previewTask} ${styles.taskActive}`}>
                  <span className={styles.taskCircle} />
                  <span>Build portfolio project</span>
                  <span className={styles.taskXP}>+100 XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Everything You Need to{' '}
            <span className="gradient-text">Level Up</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Powerful AI-driven tools designed to accelerate your career growth
          </p>
        </div>

        <div className={styles.featureGrid}>
          {[
            {
              icon: '🗺️',
              title: 'AI Career Roadmap',
              desc: 'Get a personalized, step-by-step career path tailored to your goals, skills, and timeline.',
              color: '#6C63FF',
            },
            {
              icon: '⚡',
              title: 'Daily Growth Tasks',
              desc: 'Curated daily tasks with XP rewards to keep you motivated and consistently improving.',
              color: '#10B981',
            },
            {
              icon: '🤖',
              title: 'AI Mentor Chat',
              desc: 'Get instant career advice, technical guidance, and motivational support from your AI mentor.',
              color: '#FF6B9D',
            },
            {
              icon: '📄',
              title: 'Resume Analyzer',
              desc: 'AI-powered resume analysis with actionable feedback to make your resume stand out.',
              color: '#F59E0B',
            },
            {
              icon: '🎤',
              title: 'Communication Coach',
              desc: 'Practice interviews, presentations, and professional communication with real-time AI feedback.',
              color: '#8B5CF6',
            },
            {
              icon: '🏆',
              title: 'Gamified Progress',
              desc: 'Earn XP, level up, maintain streaks, and unlock achievements as you grow your career.',
              color: '#EC4899',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className={styles.featureCard}
              style={{ animationDelay: `${i * 0.1}s`, '--accent-color': feature.color } as React.CSSProperties}
            >
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>
            Ready to Transform Your Career?
          </h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of students who are already leveling up with Mentora
          </p>
          <button className="btn-primary" onClick={loginAsDemo} style={{ fontSize: 18, padding: '16px 40px' }}>
            Start Your Journey — Try Demo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>
            <div className={styles.logoIcon}>M</div>
            <span className={styles.logoText}>Mentora</span>
          </div>
          <p className={styles.footerText}>
            © 2026 Mentora. AI-powered career growth for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
}
