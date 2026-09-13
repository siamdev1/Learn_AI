export default function BackendHomePage() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#0F172A' }}>⚡ LearnAI Next.js Backend API Engine</h1>
      <p style={{ color: '#64748B', fontSize: '16px' }}>
        Next.js App Router Backend powering the LearnAI LMS Platform with 10 NVIDIA AI Models, Auto-Failover, and Rate-Limit Guard.
      </p>

      <div style={{ marginTop: '24px', padding: '20px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#1E293B' }}>Core API Endpoints:</h3>
        <ul style={{ lineHeight: '1.8', color: '#2563EB' }}>
          <li><code>/api/health</code> - System health & active primary model diagnostics</li>
          <li><code>/api/courses</code> - Course catalog, search, and category filtering</li>
          <li><code>/api/auth</code> - User authentication and rapid role switcher</li>
          <li><code>/api/learning</code> - Student enrollments & lesson completion tracking</li>
          <li><code>/api/quizzes</code> - Interactive evaluations & automatic grading</li>
          <li><code>/api/certificates</code> - Verified credentials generation</li>
          <li><code>/api/ai/chat</code> - 10-model AI Tutor & Course Assistant</li>
          <li><code>/api/ai/models</code> - 10-model catalog, RPM tracker & failover stats</li>
          <li><code>/api/ai/recommend</code> - AI Course Recommendation Wizard</li>
          <li><code>/api/admin/stats</code> - Platform revenue and learning metrics</li>
        </ul>
      </div>
    </div>
  );
}
