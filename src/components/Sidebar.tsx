'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { href: '/dashboard',           icon: '🏠', label: 'Dashboard'       },
  { href: '/dashboard/roadmap',   icon: '🗺️', label: 'Career Roadmap'  },
  { href: '/dashboard/tasks',     icon: '⚡', label: 'Daily Tasks'     },
  { href: '/dashboard/chat',      icon: '🤖', label: 'AI Mentor'       },
  { href: '/dashboard/resume',    icon: '📄', label: 'Resume Analyzer' },
  { href: '/dashboard/comms',     icon: '🎤', label: 'Comm Practice'   },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const xpInLevel = user ? user.xp % 500 : 0;
  const xpPercent = (xpInLevel / 500) * 100;

  const SidebarContent = () => (
    <div className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>M</div>
        <span className={styles.logoText}>Mentora</span>
      </div>

      {/* User Card */}
      {user && (
        <div className={styles.userCard}>
          <div className={styles.avatar}>
            {user.avatar_url
              ? <img src={user.avatar_url} alt={user.full_name} />
              : <span>{user.full_name?.charAt(0) || 'U'}</span>
            }
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user.full_name || 'User'}</p>
            <p className={styles.userGoal}>{user.career_goal || 'Career Explorer'}</p>
          </div>
        </div>
      )}

      {/* XP Bar */}
      {user && (
        <div className={styles.xpSection}>
          <div className={styles.xpHeader}>
            <span className={styles.xpLevel}>Lvl {user.level}</span>
            <span className={styles.xpCount}>{user.xp.toLocaleString()} XP</span>
          </div>
          <div className="xp-bar">
            <div className="xp-fill" style={{ width: `${xpPercent}%` }} />
          </div>
          <div className={styles.xpFooter}>
            <span>🔥 {user.streak} day streak</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
              {isActive && <span className={styles.activePill} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Controls */}
      <div className={styles.bottom}>
        <button className={styles.themeBtn} onClick={toggleTheme}>
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button className={styles.signOutBtn} onClick={handleSignOut}>
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={styles.desktopSidebar}>
        <SidebarContent />
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className={styles.mobileBar}>
        {NAV_ITEMS.slice(0, 5).map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ''}`}
            >
              <span className={styles.mobileIcon}>{item.icon}</span>
              <span className={styles.mobileLabel}>{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
