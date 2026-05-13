'use client';

import React, { useState } from 'react';
import styles from './Resume.module.css';
import { apiRequest } from '@/lib/api';

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
      const formData = new FormData();
      formData.append('file', file);

      // We use fetch directly for FormData/File upload
      const response = await fetch('/.netlify/functions/main/resume/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Analysis failed');
      const data = await response.json();
      
      setReport(data);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze resume. Make sure your backend is deployed.');
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
              <p>Status: <strong>Analysis Complete</strong></p>
            </div>
          </div>

          <div className={styles.analysisGrid}>
            <div className={styles.analysisCard}>
              <div className={styles.cardHeader}>
                <h4>✅ Strengths</h4>
              </div>
              <ul className={styles.feedbackList}>
                {report.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className={styles.analysisCard}>
              <div className={styles.cardHeader}>
                <h4>⚠️ Weaknesses</h4>
              </div>
              <ul className={styles.feedbackList}>
                {report.weaknesses?.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className={styles.analysisCard}>
              <div className={styles.cardHeader}>
                <h4>🛠️ Missing Skills</h4>
              </div>
              <div className={styles.skillsTags}>
                {report.missing_skills?.map((s: string, i: number) => (
                  <span key={i} className={styles.skillTag}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.suggestionsCard}>
            <h3>General Feedback</h3>
            <ul className={styles.suggestionsList}>
              {report.feedback?.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
