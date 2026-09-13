import React, { useEffect } from 'react';

interface ModelChangeAlertProps {
  modelName: string;
  isFailover: boolean;
  isAutoPromoted?: boolean;
  durationSeconds?: number;
  onClose: () => void;
}

export const ModelChangeAlert: React.FC<ModelChangeAlertProps> = ({
  modelName,
  isFailover,
  isAutoPromoted,
  durationSeconds,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 7000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isGreenSpeed = Boolean(isAutoPromoted);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        background: isGreenSpeed ? '#F0FDF4' : isFailover ? '#FFFBEB' : '#EFF6FF',
        border: isGreenSpeed ? '2px solid #22C55E' : isFailover ? '2px solid #F59E0B' : '2px solid #3B82F6',
        borderRadius: '12px',
        padding: '14px 20px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '460px',
        animation: 'astryx-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: isGreenSpeed ? '#16A34A' : isFailover ? '#F59E0B' : '#3B82F6',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          flexShrink: 0
        }}
      >
        {isGreenSpeed ? '⚡' : isFailover ? '⏳' : '🤖'}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 800,
            color: isGreenSpeed ? '#15803D' : isFailover ? '#92400E' : '#1E40AF',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>
            {isGreenSpeed
              ? '⚡ Auto-Promoted to Primary Model!'
              : isFailover
              ? '⏳ 15s Timeout / Failover Switched'
              : 'Active Model Switched'}
          </span>
          {isGreenSpeed ? (
            <span
              style={{
                fontSize: '10px',
                background: '#DCFCE7',
                color: '#15803D',
                padding: '1px 6px',
                borderRadius: '4px',
                border: '1px solid #86EFAC',
                fontWeight: 700
              }}
            >
              Speed: {durationSeconds ? `${durationSeconds}s` : '<15s'}
            </span>
          ) : isFailover ? (
            <span
              style={{
                fontSize: '10px',
                background: '#FEF3C7',
                color: '#B45309',
                padding: '1px 6px',
                borderRadius: '4px',
                border: '1px solid #FCD34D',
                fontWeight: 700
              }}
            >
              15s Guard Active
            </span>
          ) : null}
        </div>
        <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px', wordBreak: 'break-all' }}>
          {isGreenSpeed
            ? `Responded in under 15s! Set as default primary: `
            : `Auto-switched active engine: `}
          <strong style={{ color: '#0F172A' }}>{modelName}</strong>
        </div>
      </div>

      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#94A3B8',
          fontSize: '16px',
          cursor: 'pointer',
          padding: '4px',
          lineHeight: 1
        }}
      >
        ✕
      </button>
    </div>
  );
};
