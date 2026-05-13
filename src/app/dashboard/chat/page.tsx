'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './Chat.module.css';
import { useAuth } from '@/context/AuthContext';
import { careerApi } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message only once
  useEffect(() => {
    if (user && messages.length === 0) {
      setMessages([
        { role: 'assistant', content: `Hello ${user.full_name.split(' ')[0]}! I'm your Mentora AI Career Assistant. How can I help you today?` }
      ]);
    }
  }, [user, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user) return;

    const userMessage = input.trim();
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    
    setInput('');
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Send history for context
      const response = await careerApi.chat(userMessage, user.id, newMessages);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.response 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I'm having trouble connecting to the brain. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatBox}>
        <div className={styles.messages}>
          {messages.map((m, i) => (
            <div key={i} className={`${styles.messageWrapper} ${styles[m.role]}`}>
              <div className={styles.avatar}>
                {m.role === 'assistant' ? '🤖' : '👤'}
              </div>
              <div className={styles.message}>
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.messageWrapper} ${styles.assistant}`}>
              <div className={styles.avatar}>🤖</div>
              <div className={`${styles.message} ${styles.typing}`}>
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className={styles.inputArea} onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your career..."
            className={styles.input}
          />
          <button type="submit" className={styles.sendBtn} disabled={isLoading}>
            <span>🚀</span>
          </button>
        </form>
      </div>
    </div>
  );
}
