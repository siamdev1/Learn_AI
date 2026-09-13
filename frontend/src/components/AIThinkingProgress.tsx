import React, { useState, useEffect } from 'react';

interface AIThinkingProgressProps {
  modelName: string;
}

export const AIThinkingProgress: React.FC<AIThinkingProgressProps> = ({ modelName }) => {
  const [progress, setProgress] = useState(15);
  const [elapsed, setElapsed] = useState(0);
  const [stage, setStage] = useState('Initializing neural reasoning & query semantics...');

  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const seconds = (Date.now() - startTime) / 1000;
      setElapsed(parseFloat(seconds.toFixed(1)));

      // 15-second window stages
      if (seconds < 3.0) {
        setProgress(Math.min(30, Math.floor(seconds * 10) + 10));
        setStage('Initializing MoE neural reasoning & semantic embeddings...');
      } else if (seconds < 7.0) {
        setProgress(Math.min(60, 30 + Math.floor((seconds - 3.0) * 7.5)));
        setStage('Activating MoE expert routing on NVIDIA NIM...');
      } else if (seconds < 12.0) {
        setProgress(Math.min(88, 60 + Math.floor((seconds - 7.0) * 5.6)));
        setStage('Synthesizing structured markdown tables & response...');
      } else if (seconds < 15.0) {
        setProgress(Math.min(97, 88 + Math.floor((seconds - 12.0) * 3)));
        setStage('Finalizing output stream (<15s speed budget)...');
      } else {
        setProgress(99);
        setStage('⏳ 15s limit reached. Auto-switching to next model in failover chain...');
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const isNearTimeout = elapsed >= 13.0;

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: isNearTimeout ? '1px solid #F59E0B' : '1px solid #BFDBFE',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.08)',
        maxWidth: '560px',
        margin: '10px 0',
        transition: 'border-color 0.3s ease'
      }}
    >
      {/* Header with Brain Icon & Model Name */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-block',
              animation: 'astryx-pulse 1.4s infinite ease-in-out',
              fontSize: '18px'
            }}
          >
            {isNearTimeout ? '⏳' : '🧠'}
          </span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{isNearTimeout ? '15s Auto-Failover Monitor' : 'AI Thinking & Reasoning'}</span>
              <span
                style={{
                  fontSize: '10px',
                  background: isNearTimeout ? '#FEF3C7' : '#EFF6FF',
                  color: isNearTimeout ? '#B45309' : '#2563EB',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  border: isNearTimeout ? '1px solid #FCD34D' : '1px solid #DBEAFE',
                  fontWeight: 700
                }}
              >
                {elapsed}s / 15s max
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Querying: <strong style={{ color: isNearTimeout ? '#D97706' : '#2563EB' }}>{modelName.split('/').pop()}</strong>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '13px', fontWeight: 800, color: isNearTimeout ? '#D97706' : '#2563EB' }}>
          {progress}%
        </div>
      </div>

      {/* Animated Glowing Progress Bar */}
      <div
        style={{
          height: '8px',
          background: '#F1F5F9',
          borderRadius: '9999px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: isNearTimeout
              ? 'linear-gradient(90deg, #F59E0B 0%, #EA580C 50%, #EF4444 100%)'
              : 'linear-gradient(90deg, #2563EB 0%, #7C3AED 50%, #06B6D4 100%)',
            backgroundSize: '200% 100%',
            animation: 'astryx-gradient-flow 2s linear infinite',
            borderRadius: '9999px',
            transition: 'width 0.25s ease-out',
            boxShadow: isNearTimeout ? '0 0 10px rgba(245, 158, 11, 0.5)' : '0 0 10px rgba(37, 99, 235, 0.4)'
          }}
        />
      </div>

      {/* Stage Subtitle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '11px', color: '#64748B' }}>
        <span style={{ color: isNearTimeout ? '#B45309' : '#64748B' }}>{stage}</span>
        <span style={{ fontStyle: 'italic', whiteSpace: 'nowrap' }}>
          {isNearTimeout ? 'Auto-switching...' : '<15s auto-primary'}
        </span>
      </div>
    </div>
  );
};
