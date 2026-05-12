'use client';

import React, { useState } from 'react';
import styles from './Resume.module.css';
import { careerApi } from '@/lib/api';

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const analyzeResume = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    
    try {
      // In a real app, we'd upload the file to Supabase Storage and send the URL
      const response = await careerApi.analyzeResume(file.name);
      
      setReport({
        score: response.score,
        ats_compatibility: response.score > 80 ? 'High' : 'Medium',
        sections: [
          { name: 'Keywords', score: 75, feedback: response.feedback[0] },
          { name: 'Formatting', score: 95, feedback: 'Clean and professional layout.' },
          { name: 'Impact', score: 80, feedback: response.feedback[1] }
        ],
        suggestions: response.feedback
      });
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Resume Analyzer 📄</h1>
        <p className={styles.subtitle}>Get AI-powered feedback to optimize your resume for ATS and recruiters.</p>
      </header>

      <div className={styles.uploadSection}>
        <div className={styles.uploadBox}>
          <input 
            type="file" 
            id="resume-upload" 
            className={styles.fileInput} 
            onChange={handleUpload}
            accept=".pdf,.doc,.docx"
          />
          <label htmlFor="resume-upload" className={styles.uploadLabel}>
            <span className={styles.uploadIcon}>📁</span>
            {file ? <span className={styles.fileName}>{file.name}</span> : <span>Upload your Resume (PDF/Word)</span>}
          </label>
        </div>
        <button 
          className="btn-primary" 
          onClick={analyzeResume} 
          disabled={!file || isAnalyzing}
          style={{ width: '100%', marginTop: '16px', height: '56px' }}
        >
          {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
        </button>
      </div>

      {report && (
        <div className={styles.reportSection}>
          <div className={styles.scoreCard}>
            <div className={styles.mainScore}>
              <span className={styles.scoreNumber}>{report.score}</span>
              <span className={styles.scoreLabel}>Overall Score</span>
            </div>
            <div className={styles.scoreDetails}>
              <p>ATS Compatibility: <strong>{report.ats_compatibility}</strong></p>
              <p>Rank: <strong>Top 15%</strong> of applicants</p>
            </div>
          </div>

          <div className={styles.analysisGrid}>
            {report.sections.map((s: any) => (
              <div key={s.name} className={styles.analysisCard}>
                <div className={styles.cardHeader}>
                  <h4>{s.name}</h4>
                  <span className={styles.miniScore}>{s.score}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${s.score}%` }} />
                </div>
                <p className={styles.feedback}>{s.feedback}</p>
              </div>
            ))}
          </div>

          <div className={styles.suggestionsCard}>
            <h3>Key Improvements</h3>
            <ul className={styles.suggestionsList}>
              {report.suggestions.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
