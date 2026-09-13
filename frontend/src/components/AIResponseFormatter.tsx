import React, { useState } from 'react';
import { Streamdown } from 'streamdown';
import 'streamdown/styles.css';

interface AIResponseFormatterProps {
  content: string;
  modelUsed?: string;
  failoverOccurred?: boolean;
  isStreaming?: boolean;
  onQuickReply?: (reply: string) => void;
}

export const AIResponseFormatter: React.FC<AIResponseFormatterProps> = ({
  content,
  modelUsed: propModelUsed,
  failoverOccurred: propFailover,
  isStreaming = false,
  onQuickReply
}) => {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  // 1. Extract embedded model badge if present in the raw text
  let rawText = content || '';
  let modelName = propModelUsed;
  let isFailover = propFailover || false;

  const modelHeaderMatch = rawText.match(/^⚡\s*Model:\s*([^\n\r]+)/m);
  if (modelHeaderMatch) {
    const fullLine = modelHeaderMatch[0];
    const matchVal = modelHeaderMatch[1].trim();
    if (matchVal.includes('Failover Switched') || matchVal.includes('🛡️')) {
      isFailover = true;
      modelName = matchVal.replace(/\[?🛡️?\s*Failover Switched\]?/gi, '').trim();
    } else {
      modelName = matchVal;
    }
    rawText = rawText.replace(fullLine, '').trim();
  }

  // Also catch secondary failover lines in the middle if any
  const secondaryModelMatch = rawText.match(/⚡\s*Model:\s*([^\n\r]+)/);
  if (secondaryModelMatch && !modelName) {
    const sLine = secondaryModelMatch[0];
    const sVal = secondaryModelMatch[1].trim();
    if (sVal.includes('Failover')) isFailover = true;
    modelName = sVal.replace(/\[?🛡️?\s*Failover Switched\]?/gi, '').trim();
    rawText = rawText.replace(sLine, '').trim();
  }

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  return (
    <div style={{ width: '100%', wordBreak: 'break-word' }}>
      {/* Dynamic Model Header Pill */}
      {modelName && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 14px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 700,
            marginBottom: '12px',
            background: isFailover
              ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
              : 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            border: isFailover ? '1px solid #F59E0B' : '1px solid #93C5FD',
            color: isFailover ? '#B45309' : '#1D4ED8',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
          }}
        >
          <span style={{ fontSize: '13px' }}>{isFailover ? '🛡️' : '⚡'}</span>
          <span>Model: <strong>{modelName}</strong></span>
          {isFailover && (
            <span
              style={{
                background: '#D97706',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '10px',
                letterSpacing: '0.02em',
                boxShadow: '0 0 8px rgba(217, 119, 6, 0.4)'
              }}
            >
              Failover Switched
            </span>
          )}
        </div>
      )}

      {/* Streamdown Streaming Markdown Renderer with Custom Astryx Components */}
      <div className="astryx-markdown-content" style={{ lineHeight: 1.7, color: '#1E293B', fontSize: '14px' }}>
        <Streamdown
          animated={true}
          isAnimating={isStreaming}
          parseIncompleteMarkdown={true}
          components={{
            // 1. Table Wrapper & Table Head/Body
            table: ({ children, ...props }) => (
              <div
                style={{
                  margin: '18px 0',
                  overflowX: 'auto',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
                  background: '#FFFFFF'
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '13px',
                    textAlign: 'left'
                  }}
                  {...props}
                >
                  {children}
                </table>
              </div>
            ),
            thead: ({ children, ...props }) => (
              <thead
                style={{
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  color: '#FFFFFF'
                }}
                {...props}
              >
                {children}
              </thead>
            ),
            th: ({ children, ...props }) => (
              <th
                style={{
                  padding: '12px 16px',
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  borderBottom: '2px solid #334155',
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap'
                }}
                {...props}
              >
                {children}
              </th>
            ),
            tr: ({ children, ...props }) => (
              <tr
                style={{
                  borderBottom: '1px solid #E2E8F0',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#EFF6FF';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent';
                }}
                {...props}
              >
                {children}
              </tr>
            ),
            td: ({ children, ...props }) => (
              <td
                style={{
                  padding: '11px 16px',
                  color: '#1E293B',
                  fontSize: '13px',
                  lineHeight: '1.5'
                }}
                {...props}
              >
                {children}
              </td>
            ),

            // 2. Headings with rich accents
            h1: ({ children, ...props }) => (
              <h1
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: '20px 0 12px',
                  borderBottom: '2px solid #E2E8F0',
                  paddingBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                {...props}
              >
                {children}
              </h1>
            ),
            h2: ({ children, ...props }) => {
              const textStr = String(children || '');
              const isProTip = textStr.includes('💡') || textStr.toLowerCase().includes('tip');
              return (
                <h2
                  style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: isProTip ? '#B45309' : '#1E293B',
                    margin: '18px 0 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  {...props}
                >
                  {children}
                </h2>
              );
            },
            h3: ({ children, ...props }) => (
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#334155',
                  margin: '14px 0 6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                {...props}
              >
                {children}
              </h3>
            ),

            // 3. Task List Checkboxes (remark-gfm GFM checklists)
            input: ({ type, checked, ...props }) => {
              if (type === 'checkbox') {
                return (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: checked ? '2px solid #16A34A' : '2px solid #94A3B8',
                      background: checked ? '#16A34A' : '#FFFFFF',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 800,
                      marginRight: '8px',
                      verticalAlign: 'middle',
                      cursor: 'pointer'
                    }}
                  >
                    {checked ? '✓' : ''}
                  </span>
                );
              }
              return <input type={type} {...props} />;
            },

            // 4. Code Blocks & Inline Code
            code: ({ className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match && !String(children).includes('\n');
              const codeString = String(children).replace(/\n$/, '');

              if (isInline) {
                return (
                  <code
                    style={{
                      background: '#F1F5F9',
                      color: '#0F172A',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      fontSize: '12px',
                      border: '1px solid #E2E8F0'
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              const lang = match ? match[1] : 'code';
              const blockId = Math.random();

              return (
                <div
                  style={{
                    margin: '14px 0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#0F172A',
                    border: '1px solid #334155'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 14px',
                      background: '#1E293B',
                      color: '#94A3B8',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}
                  >
                    <span>{lang}</span>
                    <button
                      onClick={() => handleCopy(codeString, blockId as any)}
                      style={{
                        background: copiedCodeIdx === (blockId as any) ? '#16A34A' : 'rgba(255,255,255,0.1)',
                        color: '#FFFFFF',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        border: 'none',
                        transition: 'background 0.2s ease'
                      }}
                    >
                      {copiedCodeIdx === (blockId as any) ? '✓ Copied!' : '📋 Copy Code'}
                    </button>
                  </div>
                  <pre
                    style={{
                      padding: '14px',
                      margin: 0,
                      color: '#F8FAFC',
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      fontSize: '13px',
                      lineHeight: '1.5',
                      overflowX: 'auto'
                    }}
                  >
                    <code>{codeString}</code>
                  </pre>
                </div>
              );
            },

            // 5. Horizontal Rules
            hr: () => (
              <div
                style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, #CBD5E1, transparent)',
                  margin: '20px 0'
                }}
              />
            ),

            // 6. Blockquote
            blockquote: ({ children, ...props }) => (
              <blockquote
                style={{
                  borderLeft: '4px solid #2563EB',
                  background: '#EFF6FF',
                  padding: '12px 18px',
                  borderRadius: '0 8px 8px 0',
                  margin: '14px 0',
                  color: '#1E3A8A',
                  fontStyle: 'italic'
                }}
                {...props}
              >
                {children}
              </blockquote>
            ),

            // 7. Lists
            ul: ({ children, ...props }) => (
              <ul style={{ paddingLeft: '22px', margin: '8px 0' }} {...props}>
                {children}
              </ul>
            ),
            ol: ({ children, ...props }) => (
              <ol style={{ paddingLeft: '22px', margin: '8px 0' }} {...props}>
                {children}
              </ol>
            ),
            li: ({ children, ...props }) => (
              <li style={{ margin: '4px 0', lineHeight: 1.6 }} {...props}>
                {children}
              </li>
            ),

            // 8. Paragraphs & Interactive Prompt Detection
            p: ({ children, ...props }) => {
              const textContent = String(children || '');
              const isFollowUp = textContent.includes('customize this for a specific role?') || textContent.includes('Tell me:');

              if (isFollowUp) {
                return (
                  <div
                    style={{
                      margin: '16px 0',
                      padding: '14px 18px',
                      borderRadius: '8px',
                      background: '#F0FDF4',
                      border: '1px solid #BBF7D0'
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#166534', fontSize: '13px', marginBottom: '6px' }}>
                      💡 Interactive Quick Replies
                    </div>
                    <p style={{ margin: '0 0 10px', color: '#1E293B', fontSize: '13px' }} {...props}>
                      {children}
                    </p>
                    {onQuickReply && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['🎓 Student Role', '💼 Professional', '🚀 Entrepreneur', '📅 10h Weekly Goal'].map(chip => (
                          <button
                            key={chip}
                            onClick={() => onQuickReply(chip)}
                            style={{
                              background: '#FFFFFF',
                              border: '1px solid #86EFAC',
                              color: '#15803D',
                              padding: '5px 12px',
                              borderRadius: '9999px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLButtonElement).style.background = '#DCFCE7';
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF';
                            }}
                          >
                            + {chip}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <p style={{ margin: '6px 0' }} {...props}>
                  {children}
                </p>
              );
            }
          }}
        >
          {rawText}
        </Streamdown>
      </div>
    </div>
  );
};
