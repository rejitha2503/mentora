'use client';

import React, { useState } from 'react';
import styles from './Comms.module.css';
import { careerApi } from '@/lib/api';

export default function CommunicationPage() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const analyzePitch = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    
    try {
      const response = await careerApi.analyzeComms(text);
      
      setResults({
        score: response.score,
        tone: response.tone,
        confidence: response.confidence,
        grammar: response.grammar_check,
        fluency: response.fluency_feedback,
        suggestions: response.suggestions
      });
    } catch (error) {
      console.error('Comms analysis failed:', error);
      alert('Analysis failed. Please check your backend.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Comm Practice 🎤</h1>
        <p className={styles.subtitle}>Type your elevator pitch or interview answer and get AI-powered feedback on impact, tone, and confidence.</p>
      </header>

      <div className={styles.practiceSection}>
        <div className={styles.inputBox}>
          <textarea
            className={styles.textArea}
            placeholder="Type or paste your professional response here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
          />
          <button 
            className="btn-primary" 
            onClick={analyzePitch}
            disabled={isAnalyzing || !text.trim()}
            style={{ padding: '16px 40px', fontSize: '18px', width: '100%', marginTop: '16px' }}
          >
            {isAnalyzing ? 'Analyzing with AI...' : 'Analyze My Pitch'}
          </button>
        </div>

        {results && (
          <div className={styles.resultsGrid}>
            <div className={styles.resultCard}>
              <div className={styles.resultLabel}>Impact Score</div>
              <div className={styles.resultValue}>{results.score}%</div>
              <div className={styles.miniBar}><div className={styles.barFill} style={{ width: `${results.score}%`, background: 'var(--success)' }} /></div>
            </div>
            <div className={styles.resultCard}>
              <div className={styles.resultLabel}>Tone</div>
              <div className={styles.resultValue} style={{ fontSize: '18px' }}>{results.tone}</div>
            </div>
            <div className={styles.resultCard}>
              <div className={styles.resultLabel}>Confidence</div>
              <div className={styles.resultValue} style={{ fontSize: '18px' }}>{results.confidence}</div>
            </div>
          </div>
        )}

        {results && (
          <div className={styles.feedbackSection}>
            <div className={styles.feedbackCard}>
              <h3>AI Performance Summary</h3>
              <div className={styles.feedbackItem}>
                <strong>Grammar & Clarity:</strong>
                <p>{results.grammar}</p>
              </div>
              <div className={styles.feedbackItem}>
                <strong>Fluency:</strong>
                <p>{results.fluency}</p>
              </div>
              <div className={styles.suggestions}>
                <strong>Key Suggestions:</strong>
                <ul className={styles.tipsList}>
                  {results.suggestions.map((tip: string, i: number) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.promptSection}>
        <h3>Need a prompt?</h3>
        <div className={styles.prompts}>
          <button className={styles.promptBtn} onClick={() => setText("Hi, I'm Alex. I've been a software engineer for 5 years, specializing in React and Python. I love building user-centric applications.")}>"Tell me about yourself"</button>
          <button className={styles.promptBtn} onClick={() => setText("In five years, I hope to be a senior lead developer, helping mentor junior engineers and driving architecture decisions for complex cloud systems.")}>"Where do you see yourself in 5 years?"</button>
          <button className={styles.promptBtn} onClick={() => setText("Recently I led a team to migrate our monolith to microservices. It was challenging because of the legacy database, but we succeeded by using a phased approach.")}>"Explain a complex project you led"</button>
        </div>
      </div>
    </div>
  );
}
