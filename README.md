# ⚡ LearnAI — AI-Powered Online Course Management System

> **Diploma Final Year / Capstone Group Project**  
> Formatted into 2 distinct folders:
> 1. **`frontend/`** — Built with **React + TypeScript** using **Meta's Astryx Design System** (`facebook/astryx`).
> 2. **`backend/`** — Built with **Next.js (App Router)** powering the API and 10-Model NVIDIA NIM AI Engine.

---

## 🚀 How to Run the Project

### Option A: Run Next.js Backend (Port 5000)
```bash
npm run dev:backend
```
*API is live at [http://localhost:5000](http://localhost:5000).*

### Option B: Run React Frontend (Port 5173)
```bash
npm run dev:frontend
```
*UI is live at [http://localhost:5173](http://localhost:5173).*

### Option C: Single-Command All-in-One Server (Port 5000)
```bash
npm run server
```
*Opens full LMS directly at [http://localhost:5000](http://localhost:5000).*

---

## 📂 Project Architecture

```text
d:\Diploma LMS Group Project\
├── frontend/                      <-- 1. Frontend using React + Meta's Astryx Library
│   ├── package.json
│   ├── index.html
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx                <-- Astryx AppShell & Multi-Page View Navigator
│   │   └── styles/
│   │       └── astryx-theme.css   <-- Astryx Design System (Cards, Tables, Chat Layout)
│   └── vite.config.ts
│
└── backend/                       <-- 2. Backend using Next.js (TypeScript)
    ├── package.json
    ├── next.config.mjs
    ├── tsconfig.json
    └── src/
        ├── lib/
        │   ├── aiEngine.ts        <-- 10 NVIDIA NIM Models + 40 RPM Rate Limit Guard
        │   └── db.ts              <-- Structured Data Store (Courses, Quizzes, Users)
        └── app/
            └── api/               <-- Next.js App Router API Routes
                ├── health/route.ts
                ├── auth/route.ts
                ├── courses/route.ts
                ├── courses/[id]/route.ts
                ├── learning/route.ts
                ├── quizzes/route.ts
                ├── certificates/route.ts
                ├── ai/chat/route.ts
                ├── ai/models/route.ts
                ├── ai/recommend/route.ts
                └── admin/stats/route.ts
```

---

## 🎨 Complete Page Coverage from `Website_pages.md`

All 5 core suites are directly accessible from the Astryx navigation bar:

### 1. 🌐 Public Website Suite
- **Home**: Hero with AI Course Finder, why LearnAI, featured categories & courses.
- **All Courses**: Search & category filters (`Programming`, `Web Dev`, `AI`, `Networking`).
- **Course Details**: Full syllabus curriculum modal, learning outcomes, and enrollment.
- **Categories**: Domain explorer cards.
- **Instructors**: Leading instructors directory with student counts & ratings.
- **Pricing**: Free vs. Lifetime Pro Pass comparison.
- **About Us & Contact**: Institutional description & message desk.
- **Legal**: Terms of service & privacy policy.
- **Auth**: Modal for Login, Register, and Password Recovery.

### 2. 👨‍🎓 Student / Learner Suite
- **Dashboard**: Hours studied, enrolled courses, quiz scores, certificates.
- **My Courses**: Enrolled courses gallery with progress indicators.
- **Classroom Video Player**: Embed video stream, lesson content, notes, and discussion board.
- **Curriculum Sidebar**: Checklist with *"Mark as Completed"* and progress percentage.
- **Quizzes**: Interactive test with scoring and detailed explanations.
- **Assignments**: Project submissions (GitHub link / solution prompt).
- **Certificates**: Verified digital credentials with Certificate ID and distinction grade.
- **Cart & Checkout**: Tuition payment simulation.
- **Profile**: Personal student profile and security settings.

### 3. 🤖 AI Suite (The Project's Killer Feature)
- **Full-Screen AI Assistant Studio**: ChatGPT-style conversational thread with Astryx Chat Composer.
- **10-Model Engine Telemetry**: Real-time status of all 10 verified models on NVIDIA NIM with **Nemotron 3 Super 120B** as primary.
- **40 RPM Rate Limit Guard**: Live request tracking with automatic 30s cooldown failover to prevent HTTP 429 errors.
- **6-Month Roadmap Generator**: Milestone-based technical roadmaps for junior developers.
- **Contextual Lesson Assistant**: Grounded answers using active lesson content.
- **Weekly Study Planner**: Study hours scheduling.

### 4. 👨‍🏫 Instructor Suite
- **Dashboard**: Enrolled students, course ratings, and monthly revenue.
- **Course Builder**: Publish new courses with modules and lessons.
- **Students Roster**: View enrolled student progress.
- **Reviews & Feedback**: Student course evaluations.

### 5. 🛠️ Admin Suite
- **Platform KPIs**: Total revenue (`৳11,796,320`), students (`9,680`), courses, and AI calls.
- **10-Model AI Controller**: Dropdown switcher to toggle primary models live and monitor 40 RPM quota.
- **User Management**: Switch between Student, Instructor, and Admin roles.
