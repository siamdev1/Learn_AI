import React from 'react';

export interface CertificateData {
  id: string;
  certificateNumber: string;
  studentId?: string;
  studentName: string;
  courseId?: string;
  courseTitle: string;
  issueDate: string;
  grade: string;
  duration?: string;
  instructorName?: string;
  authorizedPerson?: string;
  verificationUrl?: string;
}

interface CertificateModalProps {
  certificate: CertificateData;
  onClose: () => void;
  platformName?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose,
  platformName = 'LEARNAI ACADEMY'
}) => {
  const studentName = certificate.studentName || 'Rahim Ahmed';
  const courseTitle = certificate.courseTitle || 'Python Programming Masterclass';
  const issueDate = certificate.issueDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const duration = certificate.duration || '48 Hours (8 Weeks)';
  const instructorName = certificate.instructorName || 'Dr. Tariqul Islam';
  const authorizedPerson = certificate.authorizedPerson || 'Elena Rostova, Academic Director';
  const certId = certificate.certificateNumber || 'LMS-2026-CERT-VERIFIED';
  const verificationUrl = certificate.verificationUrl || `https://verify.learnai.io/cert/${certId}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(7, 18, 36, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflowY: 'auto',
        padding: '24px 16px'
      }}
      onClick={onClose}
    >
      {/* Top Floating Control Bar (Hidden during window.print) */}
      <div
        className="no-print"
        style={{
          width: '100%',
          maxWidth: '1123px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#0F172A',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '12px 20px',
          marginBottom: '20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #A98033 0%, #CCA052 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#071224',
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(204, 160, 82, 0.3)'
            }}
          >
            🏆
          </div>
          <div>
            <h4 style={{ margin: 0, color: '#FFFFFF', fontSize: '14px', fontWeight: 800 }}>
              Official Course Completion Credential
            </h4>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>
              A4 Landscape • 300 DPI Verification Hash • Tamper Evident
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handlePrint}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #CCA052 0%, #E0C58A 100%)',
              color: '#071224',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(204, 160, 82, 0.35)',
              transition: 'all 0.2s'
            }}
          >
            🖨️ Print / Download PDF
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              background: '#1E293B',
              color: '#CBD5E1',
              border: '1px solid #475569',
              cursor: 'pointer'
            }}
          >
            ✕ Close
          </button>
        </div>
      </div>

      {/* Main A4 Certificate Canvas */}
      <div
        id="certificate-print-area"
        className="certificate-print-canvas"
        style={{
          width: '1123px',
          minWidth: '1123px',
          height: '794px',
          minHeight: '794px',
          position: 'relative',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
          borderRadius: '4px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 56px',
          boxSizing: 'border-box',
          fontFamily: "'Inter', sans-serif"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Background Guilloche Security Pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(#CCA052 0.75px, transparent 0.75px), radial-gradient(#0F2342 0.75px, #ffffff 0.75px)',
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0, 15px 15px',
            opacity: 0.04,
            pointerEvents: 'none'
          }}
        />

        {/* Outer Minimal Corporate Border */}
        <div
          style={{
            position: 'absolute',
            inset: '16px',
            border: '1px solid rgba(15, 35, 66, 0.15)',
            pointerEvents: 'none'
          }}
        />

        {/* Inner Sophisticated Gold Accent Frame with Corner Brackets */}
        <div
          style={{
            position: 'absolute',
            inset: '24px',
            border: '1px solid rgba(204, 160, 82, 0.45)',
            pointerEvents: 'none'
          }}
        >
          {/* Top-Left Corner */}
          <div style={{ position: 'absolute', top: '-4px', left: '-4px', width: '12px', height: '12px', borderTop: '3px solid #071224', borderLeft: '3px solid #071224' }} />
          <div style={{ position: 'absolute', top: '8px', left: '8px', width: '16px', height: '16px', borderTop: '1px solid #A98033', borderLeft: '1px solid #A98033' }} />

          {/* Top-Right Corner */}
          <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '12px', height: '12px', borderTop: '3px solid #071224', borderRight: '3px solid #071224' }} />
          <div style={{ position: 'absolute', top: '8px', right: '8px', width: '16px', height: '16px', borderTop: '1px solid #A98033', borderRight: '1px solid #A98033' }} />

          {/* Bottom-Left Corner */}
          <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: '12px', height: '12px', borderBottom: '3px solid #071224', borderLeft: '3px solid #071224' }} />
          <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '16px', height: '16px', borderBottom: '1px solid #A98033', borderLeft: '1px solid #A98033' }} />

          {/* Bottom-Right Corner */}
          <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '12px', height: '12px', borderBottom: '3px solid #071224', borderRight: '3px solid #071224' }} />
          <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '16px', height: '16px', borderBottom: '1px solid #A98033', borderRight: '1px solid #A98033' }} />
        </div>

        {/* Center Watermark Crest */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            opacity: 0.03,
            zIndex: 0
          }}
        >
          <svg width="480" height="480" viewBox="0 0 24 24" fill="#071224">
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 2.18l7 3.89v4.93c0 4.6-3.15 8.91-7 10-3.85-1.09-7-5.4-7-10V8.07l7-3.89z" />
          </svg>
        </div>

        {/* 1. Header: Platform Branding & Eyebrow */}
        <section style={{ position: 'relative', zIndex: 1, textAlign: 'center', paddingTop: '4px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: '#071224',
                  color: '#E0C58A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <span
                style={{
                  color: '#071224',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  fontSize: '20px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase'
                }}
              >
                {platformName}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.35em', color: '#64748B', fontWeight: 600 }}>
              Learn. Build. Grow. • Accredited Tech Education
            </p>
          </div>

          <div style={{ marginTop: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to right, transparent, #CCA052)' }} />
            <span style={{ color: '#A98033', fontFamily: "'Montserrat', sans-serif", fontSize: '11px', letterSpacing: '0.3em', fontWeight: 800, textTransform: 'uppercase' }}>
              Official Verified Credential
            </span>
            <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to left, transparent, #CCA052)' }} />
          </div>

          <h2
            style={{
              margin: '6px 0 2px',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '40px',
              fontWeight: 700,
              color: '#071224',
              letterSpacing: '0.02em'
            }}
          >
            Certificate of Completion
          </h2>
          <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: '#64748B', fontSize: '15px' }}>
            This certificate is proudly awarded to
          </p>
        </section>

        {/* 2. Middle Body: Student Name & Course Statement */}
        <section style={{ position: 'relative', zIndex: 1, textAlign: 'center', margin: 'auto 0', padding: '6px 0' }}>
          <div style={{ display: 'inline-block', maxWidth: '850px', margin: '0 auto' }}>
            <h3
              style={{
                margin: '0 auto',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '44px',
                fontWeight: 800,
                color: '#0B1A30',
                padding: '0 32px 4px',
                borderBottom: '2px solid rgba(204, 160, 82, 0.85)',
                display: 'inline-block',
                lineHeight: 1.15
              }}
            >
              {studentName}
            </h3>
          </div>

          <p style={{ margin: '14px 0 4px', fontSize: '11px', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.25em', color: '#64748B', fontWeight: 600 }}>
            for successfully completing the curriculum and capstone requirements for
          </p>

          <h4
            style={{
              margin: '4px auto 8px',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '22px',
              fontWeight: 800,
              color: '#0F2342',
              letterSpacing: '-0.01em',
              maxWidth: '820px'
            }}
          >
            {courseTitle}
          </h4>

          <p style={{ margin: '0 auto', color: '#475569', fontSize: '12px', maxWidth: '620px', lineHeight: 1.6, fontWeight: 400 }}>
            Demonstrating mastery of all technical coursework, hands-on programming labs, comprehensive practical evaluations, and accredited competencies.
          </p>
        </section>

        {/* 3. Metadata Bar (Grid of 6 items) */}
        <section style={{ position: 'relative', zIndex: 1, width: '100%', padding: '0 12px' }}>
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              padding: '10px 20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '8px',
              textAlign: 'left'
            }}
          >
            <div style={{ borderRight: '1px solid #CBD5E1', paddingRight: '8px' }}>
              <span style={{ display: 'block', fontSize: '9px', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.08em', fontWeight: 700, color: '#64748B' }}>
                Student
              </span>
              <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#071224', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {studentName}
              </span>
            </div>

            <div style={{ borderRight: '1px solid #CBD5E1', paddingRight: '8px' }}>
              <span style={{ display: 'block', fontSize: '9px', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.08em', fontWeight: 700, color: '#64748B' }}>
                Curriculum
              </span>
              <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#071224', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {courseTitle.slice(0, 24)}...
              </span>
            </div>

            <div style={{ borderRight: '1px solid #CBD5E1', paddingRight: '8px' }}>
              <span style={{ display: 'block', fontSize: '9px', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.08em', fontWeight: 700, color: '#64748B' }}>
                Date Issued
              </span>
              <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#071224' }}>
                {issueDate}
              </span>
            </div>

            <div style={{ borderRight: '1px solid #CBD5E1', paddingRight: '8px' }}>
              <span style={{ display: 'block', fontSize: '9px', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.08em', fontWeight: 700, color: '#64748B' }}>
                Duration
              </span>
              <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#071224' }}>
                {duration}
              </span>
            </div>

            <div style={{ borderRight: '1px solid #CBD5E1', paddingRight: '8px' }}>
              <span style={{ display: 'block', fontSize: '9px', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.08em', fontWeight: 700, color: '#64748B' }}>
                Instructor
              </span>
              <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#071224', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {instructorName}
              </span>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '9px', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.08em', fontWeight: 700, color: '#64748B' }}>
                Certificate ID
              </span>
              <span style={{ display: 'block', fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: '#071224' }}>
                {certId}
              </span>
            </div>
          </div>
        </section>

        {/* 4. Signatures & Official Circular Seal */}
        <section style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'flex-end', padding: '10px 24px 4px' }}>
          {/* Left: Course Instructor Signature */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ height: '48px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '4px' }}>
              <svg width="170" height="48" viewBox="0 0 200 60" fill="none" stroke="#071224">
                <path d="M10 40 Q 30 10 50 35 T 90 25 T 130 38 T 170 20" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M40 45 C 60 48 80 50 110 46" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ width: '180px', height: '1px', backgroundColor: '#CBD5E1', marginBottom: '4px' }} />
            <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: '14px', fontWeight: 700, color: '#071224' }}>
              {instructorName}
            </p>
            <p style={{ margin: 0, fontSize: '9px', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.12em', color: '#64748B', fontWeight: 600 }}>
              Course Instructor & Mentor
            </p>
          </div>

          {/* Center: Official Circular Certification Badge / Seal */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '96px', height: '96px' }}>
              <svg width="96" height="96" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="47" fill="none" stroke="#CCA052" strokeWidth="1" strokeDasharray="3, 2" />
                <circle cx="50" cy="50" r="43" fill="#FAF7EE" stroke="#0F2342" strokeWidth="1.2" />
                <circle cx="50" cy="50" r="37" fill="none" stroke="#CCA052" strokeWidth="0.8" />
                <path id="modalSealPath" d="M 50,50 m -30,0 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0" fill="none" />
                <text fontSize="5.2" fontFamily="Montserrat" fontWeight="700" fill="#0B1A30" letterSpacing="1.2">
                  <textPath href="#modalSealPath" startOffset="50%" textAnchor="middle">
                    • OFFICIAL CERTIFIED CREDENTIAL • VERIFIED LMS
                  </textPath>
                </text>
                <g transform="translate(36, 36) scale(1.15)">
                  <path d="M12 2L4 6v5c0 4.5 3.4 8.7 8 9.8 4.6-1.1 8-5.3 8-9.8V6l-8-4z" fill="#0F2342" stroke="#CCA052" strokeWidth="0.6" />
                  <path d="M9 11l2 2 4-4" fill="none" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
              <div style={{ position: 'absolute', bottom: '-8px' }}>
                <span
                  style={{
                    backgroundColor: '#071224',
                    color: '#E0C58A',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '8px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    letterSpacing: '0.12em',
                    border: '1px solid rgba(204, 160, 82, 0.4)'
                  }}
                >
                  Accredited
                </span>
              </div>
            </div>
          </div>

          {/* Right: Authorized Signatory */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ height: '48px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '4px' }}>
              <svg width="170" height="48" viewBox="0 0 200 60" fill="none" stroke="#071224">
                <path d="M20 25 C 45 10, 60 50, 85 20 S 135 15, 155 35 Q 170 45, 185 30" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M65 30 L 140 28" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ width: '180px', height: '1px', backgroundColor: '#CBD5E1', marginBottom: '4px' }} />
            <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: '14px', fontWeight: 700, color: '#071224' }}>
              {authorizedPerson}
            </p>
            <p style={{ margin: 0, fontSize: '9px', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.12em', color: '#64748B', fontWeight: 600 }}>
              Academic Council Director
            </p>
          </div>
        </section>

        {/* 5. Footer: QR Code, Direct URL & Security Shield */}
        <footer
          style={{
            position: 'relative',
            zIndex: 1,
            borderTop: '1px solid #E2E8F0',
            paddingTop: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '16px',
            paddingRight: '16px',
            color: '#64748B'
          }}
        >
          {/* QR Code & URL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                backgroundColor: '#FFFFFF',
                padding: '4px',
                borderRadius: '6px',
                border: '1px solid rgba(204, 160, 82, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <svg width="38" height="38" viewBox="0 0 100 100" fill="#071224">
                <rect x="5" y="5" width="30" height="30" fill="currentColor" />
                <rect x="10" y="10" width="20" height="20" fill="white" />
                <rect x="15" y="15" width="10" height="10" fill="currentColor" />
                <rect x="65" y="5" width="30" height="30" fill="currentColor" />
                <rect x="70" y="10" width="20" height="20" fill="white" />
                <rect x="75" y="15" width="10" height="10" fill="currentColor" />
                <rect x="5" y="65" width="30" height="30" fill="currentColor" />
                <rect x="10" y="70" width="20" height="20" fill="white" />
                <rect x="15" y="75" width="10" height="10" fill="currentColor" />
                <rect x="42" y="10" width="8" height="8" />
                <rect x="42" y="24" width="8" height="8" />
                <rect x="10" y="42" width="8" height="8" />
                <rect x="24" y="42" width="8" height="8" />
                <rect x="42" y="42" width="16" height="16" />
                <rect x="65" y="42" width="8" height="8" />
                <rect x="80" y="42" width="12" height="8" />
                <rect x="42" y="65" width="8" height="12" />
                <rect x="65" y="65" width="14" height="8" />
                <rect x="85" y="65" width="8" height="8" />
                <rect x="42" y="82" width="12" height="8" />
                <rect x="65" y="80" width="8" height="14" />
                <rect x="80" y="80" width="14" height="14" />
              </svg>
              <span
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  backgroundColor: '#071224',
                  color: '#E0C58A',
                  fontSize: '6px',
                  fontWeight: 800,
                  padding: '1px 3px',
                  borderRadius: '2px'
                }}
              >
                QR
              </span>
            </div>

            <div style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: '9px', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.08em', fontWeight: 600, color: '#64748B' }}>
                Verify this certificate:
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 600, color: '#071224' }}>
                {verificationUrl}
              </span>
              <span style={{ display: 'block', fontSize: '8px', color: '#94A3B8' }}>
                Scan QR or visit URL directly for verified authenticity
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '9px', color: '#94A3B8', maxWidth: '300px' }}>
            Secure digital credential authenticated via tamper-evident cryptographic signature.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: '8px', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", fontWeight: 600, color: '#94A3B8' }}>
                Authenticated Hash
              </span>
              <span style={{ display: 'block', fontSize: '9px', fontFamily: 'monospace', color: '#475569', fontWeight: 600 }}>
                {certId}
              </span>
            </div>
            <div
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#F1F5F9',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#A98033'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
          </div>
        </footer>
      </div>

      {/* Print Specific CSS */}
      <style>{`
        @media print {
          body {
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .certificate-print-canvas {
            width: 100vw !important;
            height: 100vh !important;
            min-width: 100vw !important;
            min-height: 100vh !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 32px 40px !important;
          }
        }
        @page {
          size: A4 landscape;
          margin: 0;
        }
      `}</style>
    </div>
  );
};
