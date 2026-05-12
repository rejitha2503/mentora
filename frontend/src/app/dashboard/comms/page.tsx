'use client';

import React, { useState } from 'react';
import styles from './Comms.module.css';
import { careerApi } from '@/lib/api';

export default function CommunicationPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState<any>(null);

  const startRecording = async () => {
    setIsRecording(true);
    
    try {
      // Simulate recording duration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const response = await careerApi.analyzeComms("mock_audio_data");
      
      setResults({
        clarity: response.score,
        pace: 75,
        vocabulary: 92,
        feedback: response.feedback,
        tips: [
          "Try to pause more between key points.",
          "Maintain a steady breathing rhythm.",
          "Use more transition words to guide your audience."
        ]
      });
    } catch (error) {
      console.error('Comms analysis failed:', error);
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Comm Practice 🎤</h1>
        <p className={styles.subtitle}>Practice your elevator pitch or interview answers and get real-time AI feedback.</p>
      </header>

      <div className={styles.practiceSection}>
        <div className={styles.micBox}>
          <div className={`${styles.micCircle} ${isRecording ? styles.pulse : ''}`}>
            <span>{isRecording ? '⏹️' : '🎤'}</span>
          </div>
          <p className={styles.statusText}>
            {isRecording ? 'Listening and analyzing...' : 'Click to start practicing'}
          </p>
          <button 
            className="btn-primary" 
            onClick={startRecording}
            disabled={isRecording}
            style={{ padding: '16px 40px', fontSize: '18px' }}
          >
            {isRecording ? 'Stop Practice' : 'Start Practice Session'}
          </button>
        </div>

        {results && (
          <div className={styles.resultsGrid}>
            <div className={styles.resultCard}>
              <div className={styles.resultLabel}>Clarity</div>
              <div className={styles.resultValue}>{results.clarity}%</div>
              <div className={styles.miniBar}><div className={styles.barFill} style={{ width: `${results.clarity}%`, background: 'var(--success)' }} /></div>
            </div>
            <div className={styles.resultCard}>
              <div className={styles.resultLabel}>Pace</div>
              <div className={styles.resultValue}>{results.pace}%</div>
              <div className={styles.miniBar}><div className={styles.barFill} style={{ width: `${results.pace}%`, background: 'var(--warning)' }} /></div>
            </div>
            <div className={styles.resultCard}>
              <div className={styles.resultLabel}>Vocab</div>
              <div className={styles.resultValue}>{results.vocabulary}%</div>
              <div className={styles.miniBar}><div className={styles.barFill} style={{ width: `${results.vocabulary}%`, background: 'var(--primary)' }} /></div>
            </div>
          </div>
        )}

        {results && (
          <div className={styles.feedbackSection}>
            <div className={styles.feedbackCard}>
              <h3>AI Performance Summary</h3>
              <p>{results.feedback}</p>
              <ul className={styles.tipsList}>
                {results.tips.map((tip: string, i: number) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className={styles.promptSection}>
        <h3>Need a prompt?</h3>
        <div className={styles.prompts}>
          <button className={styles.promptBtn}>"Tell me about yourself"</button>
          <button className={styles.promptBtn}>"Where do you see yourself in 5 years?"</button>
          <button className={styles.promptBtn}>"Explain a complex project you led"</button>
        </div>
      </div>
    </div>
  );
}
