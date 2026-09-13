// ============================================================================
// LearnAI — AI Powered Online Course Management System (Frontend)
// Built with React + TypeScript + Meta Astryx Component Architecture
//
// Structured by Page Suites (Covering all pages from Website_pages.md):
// 1. PUBLIC SUITE: Home, Catalog, Details, Categories, Instructors, Pricing, About, Contact, Auth, Legal
// 2. STUDENT SUITE: Dashboard, My Courses, Classroom Player, Notes, Discussions, Quizzes, Assignments, Certificates, Cart, Checkout
// 3. AI SUITE: Full-Screen Assistant Studio, 10 Models Telemetry, Recommendation Wizard, 6-Month Roadmap, Career Advisor, Lesson Assistant, Quiz Practice, Study Planner
// 4. INSTRUCTOR SUITE: Dashboard, Course Builder, Curriculum Manager, Students, Reviews, Revenue
// 5. ADMIN SUITE: Dashboard, User Directory, Course Approvals, Orders, 10-Model AI Controller with 40 RPM Monitor, Settings
// ============================================================================

import { useState, useEffect, useRef } from 'react';
import './styles/astryx-theme.css';
import { AIResponseFormatter } from './components/AIResponseFormatter';
import { AIThinkingProgress } from './components/AIThinkingProgress';
import { ModelChangeAlert } from './components/ModelChangeAlert';
import { CertificateModal } from './components/CertificateModal';

// Types & Data Contracts
export type UserRole = 'student' | 'instructor' | 'admin';
export type MainSuite = 'public' | 'student' | 'ai' | 'instructor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title?: string;
  bio?: string;
  phone?: string;
  learningGoal?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  duration: string;
  videoUrl: string;
  content: string;
  order: number;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  headline: string;
  description: string;
  fullDescription?: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  price: number;
  originalPrice: number;
  rating: number;
  ratingCount: number;
  reviewsCount: number;
  instructor: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    role?: string;
    bio?: string;
  };
  thumbnail: string;
  previewVideoUrl?: string;
  badge?: string;
  duration: string;
  lessonsCount: number;
  studentsCount: number;
  certificate?: boolean;
  learningOutcomes: string[];
  modules: Module[];
  projects?: string[];
  requirements?: string[];
  suitableFor?: string[];
  tags?: string[];
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  progressPercent: number;
  completedLessonIds: string[];
  quizScore?: number;
  isCertified: boolean;
  certificateId?: string;
  paymentStatus?: 'completed' | 'pending' | 'failed';
  paidAmount?: number;
  paymentMethod?: string;
  couponUsed?: string | null;
  discountPercent?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  explanation?: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface Certificate {
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

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  modelUsed?: string;
  failoverOccurred?: boolean;
  isStreaming?: boolean;
  timestamp?: string;
  responseTimeSec?: number;
  recommendedCourses?: Course[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  modelUsed?: string;
  messages: ChatMessage[];
}

// Helper to detect course recommendations from AI text
function detectRecommendedCourses(text: string, allCourses: Course[]): Course[] {
  if (!text || !allCourses || allCourses.length === 0) return [];
  const textLower = text.toLowerCase();
  const matched: Course[] = [];

  // 1. Tag match [RECOMMENDED_COURSE: id=...] or [COURSE_CARD: id=...]
  const tagMatches = text.matchAll(/\[(?:RECOMMENDED_COURSE|COURSE_CARD):\s*(?:id=)?([a-zA-Z0-9_-]+)\]/gi);
  for (const tm of tagMatches) {
    const idOrSlug = tm[1].trim();
    const found = allCourses.find(c => c.id === idOrSlug || c.slug === idOrSlug);
    if (found && !matched.some(m => m.id === found.id)) matched.push(found);
  }

  // 2. Exact or substring course title match
  for (const course of allCourses) {
    if (textLower.includes(course.title.toLowerCase())) {
      if (!matched.some(m => m.id === course.id)) matched.push(course);
    }
  }

  // 3. Fallback keywords
  if (matched.length === 0) {
    if (textLower.includes('selenium') || textLower.includes('playwright') || textLower.includes('sqa')) {
      const sqa = allCourses.find(c => c.id === 'course-sqa-automation');
      if (sqa) matched.push(sqa);
    }
    if (textLower.includes('mern') || textLower.includes('full stack ecommerce')) {
      const mern = allCourses.find(c => c.id === 'course-mern-ecommerce');
      if (mern && !matched.some(m => m.id === mern.id)) matched.push(mern);
    }
    if (textLower.includes('ai agent') || (textLower.includes('python') && textLower.includes('agent'))) {
      const ai = allCourses.find(c => c.id === 'course-ai-agent');
      if (ai && !matched.some(m => m.id === ai.id)) matched.push(ai);
    }
    if (textLower.includes('docker') || textLower.includes('devops') || textLower.includes('kubernetes')) {
      const devops = allCourses.find(c => c.id === 'course-docker-devops');
      if (devops && !matched.some(m => m.id === devops.id)) matched.push(devops);
    }
    if (textLower.includes('ui/ux') || textLower.includes('figma')) {
      const uiux = allCourses.find(c => c.id === 'course-uiux-figma');
      if (uiux && !matched.some(m => m.id === uiux.id)) matched.push(uiux);
    }
    if (textLower.includes('next.js') || textLower.includes('nextjs')) {
      const nextjs = allCourses.find(c => c.id === 'course-nextjs-fullstack');
      if (nextjs && !matched.some(m => m.id === nextjs.id)) matched.push(nextjs);
    }
  }

  return matched.slice(0, 2);
}

const API_BASE = typeof window !== 'undefined' && window.location.origin.includes('localhost')
  ? `${window.location.origin}/api`
  : 'http://localhost:5000/api';

export default function App() {
  // Navigation & Suite States
  const [currentSuite, setCurrentSuite] = useState<MainSuite>('public');
  const [currentPage, setCurrentPage] = useState<string>('home');

  // Application Data States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeEnrollment, setActiveEnrollment] = useState<Enrollment | null>(null);
  const [myCoursesList, setMyCoursesList] = useState<Array<{ enrollment: Enrollment; course: Course }>>([]);

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 10-Model AI & Rate Limit Telemetry States
  const [primaryModel, setPrimaryModel] = useState<string>('google/diffusiongemma-26b-a4b-it');
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [currentRpm, setCurrentRpm] = useState<number>(1);
  const [activeLiveModel, setActiveLiveModel] = useState<string>('google/diffusiongemma-26b-a4b-it');

  // Sessions & History Management (Assistant-UI Design Pattern)
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('learnai_chat_sessions_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: 'session_default',
        title: 'New Conversation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        modelUsed: 'google/diffusiongemma-26b-a4b-it',
        messages: [
          {
            sender: 'ai',
            text: 'Hello! I am your **LearnAI Educational Assistant**.\nPowered by Google DiffusionGemma 26B diffusion-based LLM with high-speed token generation & intelligent reasoning.\nAsk me to explain concepts, guide you through a lesson, generate a study schedule, or build a 6-month career roadmap!',
            modelUsed: 'google/diffusiongemma-26b-a4b-it'
          }
        ]
      }
    ];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('learnai_chat_sessions_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].id;
      }
    } catch (e) {}
    return 'session_default';
  });

  const [sessionSearchQuery, setSessionSearchQuery] = useState<string>('');
  const [feedbackState, setFeedbackState] = useState<{ [msgKey: string]: 'like' | 'dislike' }>({});
  const [copiedMsgIdx, setCopiedMsgIdx] = useState<number | null>(null);

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];
  const chatMessages = currentSession?.messages || [];

  const setChatMessages = (updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
    setSessions(prevSessions => {
      return prevSessions.map(s => {
        if (s.id === currentSessionId) {
          const updatedMessages = typeof updater === 'function' ? updater(s.messages) : updater;
          return {
            ...s,
            messages: updatedMessages,
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      });
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem('learnai_chat_sessions_v2', JSON.stringify(sessions));
    } catch (e) {}
  }, [sessions]);

  const [chatInput, setChatInput] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiSubMode, setAiSubMode] = useState<'tutor' | 'course-assistant' | 'roadmap' | 'planner' | 'recommendation'>('tutor');
  const [modelChangeNotification, setModelChangeNotification] = useState<{
    model: string;
    isFailover: boolean;
    isAutoPromoted?: boolean;
    durationSeconds?: number;
  } | null>(null);
  const [highlightPill, setHighlightPill] = useState<boolean>(false);

  // Course Details Page States
  const [courseDetailsTab, setCourseDetailsTab] = useState<'overview' | 'curriculum' | 'projects' | 'requirements' | 'instructor' | 'faq'>('overview');
  const [expandedCourseModules, setExpandedCourseModules] = useState<{ [modId: string]: boolean }>({});
  const [isPlayingCoursePreview, setIsPlayingCoursePreview] = useState<boolean>(false);

  // Public AI vs Private Student AI States & Coupon Token Engine
  const [aiAccessMode, setAiAccessMode] = useState<'public-sales' | 'private-student'>('public-sales');
  const [latestCouponOffer, setLatestCouponOffer] = useState<{
    code: string;
    discount: number;
    locked: boolean;
    claimed: boolean;
  } | null>(null);
  const [claimedCoupons, setClaimedCoupons] = useState<Array<{ code: string; discountPercent: number }>>([]);

  // Automatically synchronize AI mode based on login status:
  // Logged OUT: 'public-sales' (🌐 Public AI: Course Sales & Advisor)
  // Logged IN:  'private-student' (🎓 Private AI: Enrolled Student Mentor)
  useEffect(() => {
    if (currentUser) {
      setAiAccessMode('private-student');
    } else {
      setAiAccessMode('public-sales');
    }
  }, [currentUser]);

  // Interactive Modals
  const [showCourseDetailModal, setShowCourseDetailModal] = useState<boolean>(false);
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizResult, setQuizResult] = useState<any | null>(null);

  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  const [showAiFinderModal, setShowAiFinderModal] = useState<boolean>(false);

  // Course Checkout & Development Payment Simulator States
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState<string>('');
  const [couponInputCode, setCouponInputCode] = useState<string>('');
  const [couponError, setCouponError] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'bkash' | 'nagad' | 'card' | 'direct'>('bkash');
  const [devPaymentStatus, setDevPaymentStatus] = useState<'completed' | 'pending' | 'failed'>('completed');
  const [isSubmittingCheckout, setIsSubmittingCheckout] = useState<boolean>(false);

  // Student LMS Modules States
  const [certificatesList, setCertificatesList] = useState<Certificate[]>([]);
  const [assignmentsList, setAssignmentsList] = useState<any[]>([]);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<{ [asgId: string]: string }>({});
  const [activeAssignmentSubmitId, setActiveAssignmentSubmitId] = useState<string | null>(null);
  const [githubRepoUrl, setGithubRepoUrl] = useState<string>('');
  const [assignmentNotes, setAssignmentNotes] = useState<string>('');
  const [profileSaveMsg, setProfileSaveMsg] = useState<string>('');
  const [editProfileName, setEditProfileName] = useState<string>('Rahim Ahmed');
  const [editProfilePhone, setEditProfilePhone] = useState<string>('+880 1711-223344');
  const [editProfileBio, setEditProfileBio] = useState<string>('Diploma in Computer Engineering student focusing on full-stack web and AI systems.');
  const [editProfileGoal, setEditProfileGoal] = useState<string>('Become an Industry-Ready Full Stack & AI Engineer');

  // Comprehensive Authentication, OTP & 2FA States
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register-student' | 'register-tutor'>('login');
  const [authStep, setAuthStep] = useState<'form' | 'otp' | '2fa' | 'success'>('form');
  const [authEmail, setAuthEmail] = useState<string>('student@learnai.com');
  const [authPassword, setAuthPassword] = useState<string>('password123');
  const [authName, setAuthName] = useState<string>('');
  const [authPhone, setAuthPhone] = useState<string>('+880 1711-223344');
  const [authExpertise, setAuthExpertise] = useState<string>('Python & Artificial Intelligence');
  const [authBio, setAuthBio] = useState<string>('Passionate educator and software engineer.');
  const [otpDeliveryMethod, setOtpDeliveryMethod] = useState<'email' | 'sms'>('email');
  const [authSessionId, setAuthSessionId] = useState<string>('');
  const [simulatedDevOtp, setSimulatedDevOtp] = useState<string>('');
  const [otpInput, setOtpInput] = useState<string>('');
  const [twoFactorInput, setTwoFactorInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string>('');
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [targetContactMasked, setTargetContactMasked] = useState<string>('');

  // Live Multi-User RPM Telemetry States
  const [rpmResetSeconds, setRpmResetSeconds] = useState<number>(60);
  const [isRpmExhausted, setIsRpmExhausted] = useState<boolean>(false);

  // Role Permission Restriction Notice State
  const [permissionDeniedAlert, setPermissionDeniedAlert] = useState<{
    suite: string;
    reason: string;
  } | null>(null);

  const [adminStats, setAdminStats] = useState<any | null>(null);
  const [showNewCourseModal, setShowNewCourseModal] = useState<boolean>(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState('999');

  // Classroom Extras (Notes, Discussions, Resources)
  const [lessonNotes, setLessonNotes] = useState<string>('Important: Review class constructors and super() inheritance logic.');
  const [classroomTab, setClassroomTab] = useState<'content' | 'notes' | 'resources' | 'discussion'>('content');
  const [discussionMessages, setDiscussionMessages] = useState<Array<{ name: string; text: string; time: string }>>([
    { name: 'Dr. Tariqul Islam', text: 'Welcome students! Drop your questions regarding this lesson here.', time: '10:00 AM' },
    { name: 'Rahim Ahmed', text: 'Is super() required when overriding a method in Python?', time: '10:15 AM' }
  ]);
  const [discussionInput, setDiscussionInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    if (currentPage === 'ai-assistant') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiLoading, currentPage]);

  // Initialize
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const userRes = await fetch(`${API_BASE}/auth`);
      if (userRes.ok) {
        const u = await userRes.json();
        setCurrentUser(u);
      }

      const coursesRes = await fetch(`${API_BASE}/courses`);
      if (coursesRes.ok) {
        const list = await coursesRes.json();
        setCourses(list);
        if (list.length > 0) {
          setActiveCourse(list[0]);
          if (list[0].modules?.[0]?.lessons?.[0]) {
            setSelectedLesson(list[0].modules[0].lessons[0]);
          }
        }
      }

      const modelsRes = await fetch(`${API_BASE}/ai/models`);
      if (modelsRes.ok) {
        const data = await modelsRes.json();
        setPrimaryModel(data.primaryModel);
        setActiveLiveModel(data.primaryModel);
        setAvailableModels(data.availableModels || []);
        setCurrentRpm(data.currentRpm || 1);
      }

      fetchMyCourses();
      fetchAdminStats();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyCourses = async () => {
    try {
      const res = await fetch(`${API_BASE}/learning`);
      if (res.ok) {
        const data = await res.json();
        setMyCoursesList(data);
      }

      const certRes = await fetch(`${API_BASE}/certificates`);
      if (certRes.ok) {
        const certData = await certRes.json();
        setCertificatesList(certData);
      }

      const assignRes = await fetch(`${API_BASE}/assignments`);
      if (assignRes.ok) {
        const assignData = await assignRes.json();
        setAssignmentsList(assignData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`);
      if (res.ok) {
        const data = await res.json();
        setAdminStats(data);
        if (data?.aiStats) {
          setAvailableModels(data.aiStats.availableModels || []);
          setCurrentRpm(data.aiStats.currentRpm || 1);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Live Global RPM Polling (every 2.5s) to synchronize all active users
  useEffect(() => {
    const rpmInterval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/ai/models`);
        if (res.ok) {
          const data = await res.json();
          setCurrentRpm(data.currentRpm || 0);
          if (data.primaryModel) {
            setPrimaryModel(data.primaryModel);
          }
          if (data.secondsUntilReset !== undefined) {
            setRpmResetSeconds(data.secondsUntilReset);
          }
          if (data.isRpmExhausted !== undefined) {
            setIsRpmExhausted(data.isRpmExhausted);
          }
        }
      } catch (e) {}
    }, 2500);

    return () => clearInterval(rpmInterval);
  }, []);

  // Role-Based Navigation & Permission Guard
  const handleNavigateSuite = (targetSuite: MainSuite, targetPage: string) => {
    // 1. Public & AI Studio are open to everyone (Public AI is free and works without login!)
    if (targetSuite === 'public' || targetSuite === 'ai') {
      setCurrentSuite(targetSuite);
      setCurrentPage(targetPage);
      if (targetSuite === 'ai') {
        setAiAccessMode(currentUser ? 'private-student' : 'public-sales');
      }
      setPermissionDeniedAlert(null);
      return;
    }

    // 2. Check if logged in for protected student, instructor, and admin suites
    if (!currentUser) {
      setAuthMode('login');
      setAuthStep('form');
      setShowAuthModal(true);
      return;
    }

    // 3. Admin has unrestricted access to all suites
    if (currentUser.role === 'admin') {
      setCurrentSuite(targetSuite);
      setCurrentPage(targetPage);
      setPermissionDeniedAlert(null);
      return;
    }

    // 4. Student permissions
    if (currentUser.role === 'student') {
      if (targetSuite === 'student') {
        setCurrentSuite(targetSuite);
        setCurrentPage(targetPage);
        setPermissionDeniedAlert(null);
      } else {
        setPermissionDeniedAlert({
          suite: targetSuite.toUpperCase(),
          reason: `Access Denied: ${targetSuite === 'instructor' ? 'Instructor / Tutor' : 'Administrator'} privileges are required. You are currently signed in as a Student (${currentUser.name}).`
        });
      }
      return;
    }

    // 5. Instructor permissions
    if (currentUser.role === 'instructor') {
      if (targetSuite === 'instructor') {
        setCurrentSuite(targetSuite);
        setCurrentPage(targetPage);
        setPermissionDeniedAlert(null);
      } else if (targetSuite === 'student' && (targetPage === 'classroom' || targetPage === 'my-courses')) {
        setCurrentSuite(targetSuite);
        setCurrentPage(targetPage);
        setPermissionDeniedAlert(null);
      } else {
        setPermissionDeniedAlert({
          suite: targetSuite.toUpperCase(),
          reason: `Access Denied: Administrator credentials required for ${targetSuite.toUpperCase()} Suite. You are signed in as Instructor (${currentUser.name}).`
        });
      }
      return;
    }

    setCurrentSuite(targetSuite);
    setCurrentPage(targetPage);
  };

  // Auth Action: One-Click Demo User Login
  const handleDemoQuickLogin = async (role: 'student' | 'instructor' | 'admin', requireSecurityCheck: boolean = false) => {
    setIsAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE}/auth/demo-quick-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, requireSecurityCheck })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      if (data.requireOtp) {
        setAuthSessionId(data.sessionId);
        setSimulatedDevOtp(data.devOtpPreview);
        setTargetContactMasked(data.targetContact);
        setAuthStep('otp');
        setOtpInput('');
      } else if (data.user) {
        setCurrentUser(data.user);
        setShowAuthModal(false);
        setAuthStep('form');
        setPermissionDeniedAlert(null);
        fetchMyCourses();

        // Auto-unlock any pending AI Passion coupon
        if (latestCouponOffer && latestCouponOffer.locked) {
          const unlocked = { ...latestCouponOffer, locked: false, claimed: true };
          setLatestCouponOffer(unlocked);
          setClaimedCoupons(prev => [...prev, { code: unlocked.code, discountPercent: unlocked.discount }]);
          try {
            fetch(`${API_BASE}/ai/coupons/claim`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: unlocked.code, discountPercent: unlocked.discount })
            });
          } catch (e) {}
        }

        if (data.user.role === 'instructor') {
          setCurrentSuite('instructor');
          setCurrentPage('instructor-dashboard');
        } else if (data.user.role === 'admin') {
          setCurrentSuite('admin');
          setCurrentPage('admin-dashboard');
        } else {
          setCurrentSuite('student');
          setCurrentPage('student-dashboard');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Auth Action: Submit Login or Register Form
  const handleSubmitAuthForm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAuthLoading(true);
    setAuthError('');
    try {
      let endpoint = `${API_BASE}/auth/login`;
      let payload: any = {
        email: authEmail,
        password: authPassword,
        deliveryMethod: otpDeliveryMethod
      };

      if (authMode === 'register-student' || authMode === 'register-tutor') {
        endpoint = `${API_BASE}/auth/register`;
        payload = {
          name: authName || (authMode === 'register-tutor' ? 'New Instructor' : 'New Student'),
          email: authEmail,
          password: authPassword,
          role: authMode === 'register-tutor' ? 'instructor' : 'student',
          phone: authPhone,
          expertise: authExpertise,
          bio: authBio,
          deliveryMethod: otpDeliveryMethod
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      if (data.requireOtp) {
        setAuthSessionId(data.sessionId);
        setSimulatedDevOtp(data.devOtpPreview);
        setTargetContactMasked(data.targetContact);
        setAuthStep('otp');
        setOtpInput('');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Error occurred during request');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Auth Action: Resend OTP or Toggle Channel (Email / SMS)
  const handleResendOtp = async (newChannel?: 'email' | 'sms') => {
    const channelToUse = newChannel || otpDeliveryMethod;
    setOtpDeliveryMethod(channelToUse);
    setIsAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: authSessionId, deliveryMethod: channelToUse })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resend code');
      setSimulatedDevOtp(data.devOtpPreview);
      setAuthSuccessMsg(`New code sent via ${channelToUse.toUpperCase()}!`);
      setTimeout(() => setAuthSuccessMsg(''), 4000);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to resend code');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Auth Action: Verify OTP Code
  const handleVerifyOtp = async () => {
    if (!otpInput.trim()) {
      setAuthError('Please enter the 6-digit OTP code');
      return;
    }
    setIsAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: authSessionId, code: otpInput.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP verification failed');

      if (data.require2fa) {
        setAuthStep('2fa');
        setTwoFactorInput('');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Invalid code');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Auth Action: Verify 2FA & Complete Sign In
  const handleVerify2fa = async () => {
    if (!twoFactorInput.trim()) {
      setAuthError('Please enter your 6-digit 2FA token (e.g. 123456)');
      return;
    }
    setIsAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE}/auth/verify-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: authSessionId, code: twoFactorInput.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '2FA verification failed');

      if (data.authenticated && data.user) {
        setCurrentUser(data.user);
        setAuthStep('success');
        setPermissionDeniedAlert(null);
        fetchMyCourses();

        // Auto-unlock any pending AI Passion coupon
        if (latestCouponOffer && latestCouponOffer.locked) {
          const unlocked = { ...latestCouponOffer, locked: false, claimed: true };
          setLatestCouponOffer(unlocked);
          setClaimedCoupons(prev => [...prev, { code: unlocked.code, discountPercent: unlocked.discount }]);
          try {
            fetch(`${API_BASE}/ai/coupons/claim`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: unlocked.code, discountPercent: unlocked.discount })
            });
          } catch (e) {}
        }

        setTimeout(() => {
          setShowAuthModal(false);
          setAuthStep('form');
          if (data.user.role === 'instructor') {
            setCurrentSuite('instructor');
            setCurrentPage('instructor-dashboard');
          } else if (data.user.role === 'admin') {
            setCurrentSuite('admin');
            setCurrentPage('admin-dashboard');
          } else {
            setCurrentSuite('student');
            setCurrentPage('student-dashboard');
          }
        }, 1200);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Invalid 2FA code');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Auth Action: Logout
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    } catch (e) {}
    setCurrentUser(null);
    setAiAccessMode('public-sales');
    setCurrentSuite('public');
    setCurrentPage('home');
    setPermissionDeniedAlert(null);
  };


  // Course Checkout & Enrollment Flow
  const openCheckout = (course: Course) => {
    if (!currentUser) {
      setAuthMode('login');
      setAuthStep('form');
      setShowAuthModal(true);
      return;
    }
    setCheckoutCourse(course);
    // Pre-apply unlocked AI coupon if available
    if (latestCouponOffer && !latestCouponOffer.locked) {
      setAppliedCoupon({ code: latestCouponOffer.code, discount: latestCouponOffer.discount });
    } else if (claimedCoupons.length > 0) {
      const topCoupon = [...claimedCoupons].sort((a, b) => b.discountPercent - a.discountPercent)[0];
      setAppliedCoupon({ code: topCoupon.code, discount: topCoupon.discountPercent });
    } else {
      setAppliedCoupon(null);
    }
    setCouponInputCode('');
    setCouponError('');
    setDevPaymentStatus('completed');
    setShowCheckoutModal(true);
  };

  const handleApplyCustomCoupon = async (codeToApply?: string) => {
    const targetCode = (codeToApply || couponCodeInput || couponInputCode).trim();
    if (!targetCode) return;
    try {
      const res = await fetch(`${API_BASE}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: targetCode })
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({ code: data.code, discount: data.discountPercent });
        setCouponError('');
      } else {
        setCouponError(data.message || 'Invalid coupon code');
      }
    } catch (e) {
      setCouponError('Could not validate coupon');
    }
  };

  const handleConfirmCheckout = async () => {
    if (!checkoutCourse) return;
    setIsSubmittingCheckout(true);

    const originalPrice = checkoutCourse.price;
    const discountAmount = appliedCoupon ? Math.round(originalPrice * (appliedCoupon.discount / 100)) : 0;
    const finalAmount = Math.max(0, originalPrice - discountAmount);

    try {
      const res = await fetch(`${API_BASE}/learning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enroll',
          courseId: checkoutCourse.id,
          couponCode: appliedCoupon?.code || null,
          discountPercent: appliedCoupon?.discount || 0,
          paymentMethod: selectedPaymentMethod,
          paidAmount: finalAmount,
          paymentStatus: devPaymentStatus
        })
      });

      if (res.ok) {
        const data = await res.json();
        await fetchMyCourses();
        setShowCheckoutModal(false);

        if (devPaymentStatus === 'completed') {
          setActiveEnrollment(data.enrollment);
          openClassroom(checkoutCourse);
        } else if (devPaymentStatus === 'pending') {
          setCurrentSuite('student');
          setCurrentPage('my-courses');
        } else {
          alert('Simulated Payment Failure: Transaction was cancelled. You can retry with Completed/Paid status.');
        }
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to complete checkout');
      }
    } catch (err) {
      console.error(err);
      alert('Checkout error');
    } finally {
      setIsSubmittingCheckout(false);
    }
  };

  const handleApprovePendingPayment = async (courseId: string) => {
    try {
      const res = await fetch(`${API_BASE}/learning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update-payment-status', courseId, paymentStatus: 'completed' })
      });
      if (res.ok) {
        await fetchMyCourses();
        const target = courses.find(c => c.id === courseId);
        if (target) {
          openClassroom(target);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openClassroom = async (course: Course) => {
    setActiveCourse(course);
    if (course.modules?.[0]?.lessons?.[0]) {
      setSelectedLesson(course.modules[0].lessons[0]);
    }
    try {
      const res = await fetch(`${API_BASE}/courses/${course.id}`);
      if (res.ok) {
        const data = await res.json();
        setActiveEnrollment(data.enrollment);
        if (data.enrollment?.completedLessonIds?.length && course.modules) {
          for (const m of course.modules) {
            const nextLes = m.lessons.find(l => !data.enrollment.completedLessonIds.includes(l.id));
            if (nextLes) {
              setSelectedLesson(nextLes);
              break;
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
    setCurrentSuite('student');
    setCurrentPage('classroom');
  };

  const handleCompleteLesson = async (lessonId: string) => {
    if (!activeCourse) return;
    try {
      const res = await fetch(`${API_BASE}/learning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete-lesson', courseId: activeCourse.id, lessonId })
      });
      if (res.ok) {
        const data = await res.json();
        if (activeEnrollment) {
          setActiveEnrollment({
            ...activeEnrollment,
            progressPercent: data.progressPercent,
            completedLessonIds: data.completedLessonIds,
            isCertified: data.isCertified,
            certificateId: data.certificateId
          });
        }
        fetchMyCourses();
        if (data.isCertified && data.certificateId) {
          handleViewCertificate(data.certificateId);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Quizzes
  const openQuiz = async (specificCourseId?: string) => {
    const targetId = specificCourseId || activeCourse?.id;
    if (!targetId) return;
    try {
      const res = await fetch(`${API_BASE}/quizzes?courseId=${targetId}`);
      if (res.ok) {
        const data = await res.json();
        const q = Array.isArray(data) ? data[0] : data;
        if (q) {
          setQuizData(q);
          setQuizAnswers({});
          setQuizResult(null);
          setShowQuizModal(true);
        } else {
          alert('Quiz for this course is being curated by the instructor.');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitQuiz = async () => {
    const courseId = quizData?.courseId || activeCourse?.id;
    if (!courseId) return;
    try {
      const res = await fetch(`${API_BASE}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, answers: quizAnswers })
      });
      if (res.ok) {
        const data = await res.json();
        setQuizResult(data);
        fetchMyCourses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewCertificate = async (certIdOrCourseId: string, customCourse?: Course) => {
    const studentName = currentUser?.name || 'Rahim Ahmed';
    const targetCourse = customCourse || courses.find(c => c.id === certIdOrCourseId) || activeCourse;

    try {
      const res = await fetch(`${API_BASE}/certificates/${certIdOrCourseId}`);
      if (res.ok) {
        const cert = await res.json();
        setActiveCert({
          ...cert,
          studentName: studentName,
          courseTitle: targetCourse?.title || cert.courseTitle || 'Python Programming Masterclass',
          instructorName: targetCourse?.instructor?.name || cert.instructorName || 'Dr. Tariqul Islam',
          duration: targetCourse?.duration || cert.duration || '48 Hours (8 Weeks)'
        });
        setShowCertModal(true);
        return;
      }
    } catch (err) {
      console.error(err);
    }

    // Fallback: construct certificate on the fly for this specific student and course
    const finalCourse = targetCourse || courses[0];
    const certNum = `LMS-2026-${(finalCourse?.id || 'GEN').replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    setActiveCert({
      id: `cert-${finalCourse?.id || 'gen'}-${Date.now()}`,
      certificateNumber: certNum,
      studentId: currentUser?.id || 'user-student-1',
      studentName: studentName,
      courseId: finalCourse?.id || 'course-python-101',
      courseTitle: finalCourse?.title || 'Python Programming Masterclass',
      issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      grade: 'Distinction (98%)',
      duration: finalCourse?.duration || '48 Hours (8 Weeks)',
      instructorName: finalCourse?.instructor?.name || 'Dr. Tariqul Islam',
      authorizedPerson: 'Elena Rostova, Academic Director',
      verificationUrl: `https://verify.learnai.io/cert/${certNum}`
    });
    setShowCertModal(true);
  };

  const handleSubmitAssignment = async (assignmentId: string, courseId: string) => {
    if (!githubRepoUrl.trim()) {
      alert('Please enter your GitHub solution repository URL.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/assignments/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          courseId,
          githubUrl: githubRepoUrl.trim(),
          notes: assignmentNotes
        })
      });
      if (res.ok) {
        setAssignmentSubmissions(prev => ({ ...prev, [assignmentId]: 'Submitted (A+ Verified)' }));
        setActiveAssignmentSubmitId(null);
        setGithubRepoUrl('');
        setAssignmentNotes('');
        alert('Assignment solution submitted and verified successfully!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editProfileName,
          phone: editProfilePhone,
          bio: editProfileBio,
          learningGoal: editProfileGoal
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setProfileSaveMsg('Profile details successfully updated!');
        setTimeout(() => setProfileSaveMsg(''), 3500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // AI Chat & Session Management (Assistant-UI)
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isAiLoading) return;
    const userText = chatInput.trim();
    setChatInput('');

    // Auto-update session title if it's still 'New Conversation'
    if (currentSession?.title === 'New Conversation') {
      const snippet = userText.length > 28 ? userText.slice(0, 28) + '...' : userText;
      setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, title: snippet } : s));
    }

    const newHistory: ChatMessage[] = [
      ...chatMessages,
      { sender: 'user', text: userText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ];
    setChatMessages(newHistory);
    setIsAiLoading(true);

    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: aiSubMode,
          aiType: aiAccessMode,
          question: userText,
          courseId: activeCourse?.id,
          lessonId: selectedLesson?.id,
          isLoggedIn: Boolean(currentUser),
          userName: currentUser?.name,
          studentData: currentUser ? {
            name: currentUser.name,
            email: currentUser.email,
            enrolledCourses: myCoursesList.map(m => ({
              title: m.course.title,
              progressPercent: m.enrollment.progressPercent,
              completedLessons: m.enrollment.completedLessonIds.length,
              totalLessons: m.course.lessonsCount,
              isCertified: m.enrollment.isCertified
            })),
            activeCourseTitle: activeCourse?.title,
            currentProgressPercent: activeEnrollment?.progressPercent
          } : undefined,
          history: newHistory.slice(-4).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.couponOffer) {
          setLatestCouponOffer(data.couponOffer);
          if (!data.couponOffer.locked) {
            setClaimedCoupons(prev => {
              if (prev.some(c => c.code === data.couponOffer.code)) return prev;
              return [...prev, { code: data.couponOffer.code, discountPercent: data.couponOffer.discount }];
            });
          }
        }
        const effectiveModel = data.modelUsed || primaryModel;
        const durationSec = data.responseTimeMs ? parseFloat((data.responseTimeMs / 1000).toFixed(1)) : undefined;

        if (data.autoPromotedToPrimary) {
          // Model responded in < 15s and was automatically promoted to Primary!
          setPrimaryModel(effectiveModel);
          setActiveLiveModel(effectiveModel);
          setModelChangeNotification({
            model: effectiveModel,
            isFailover: false,
            isAutoPromoted: true,
            durationSeconds: durationSec
          });
          setHighlightPill(true);
          setTimeout(() => setHighlightPill(false), 3000);
        } else if (data.failoverOccurred || (data.modelUsed && data.modelUsed !== activeLiveModel)) {
          setActiveLiveModel(effectiveModel);
          setModelChangeNotification({
            model: effectiveModel,
            isFailover: Boolean(data.failoverOccurred),
            isAutoPromoted: false,
            durationSeconds: durationSec
          });
          setHighlightPill(true);
          setTimeout(() => setHighlightPill(false), 2400);
        }

        const fullContent = data.content || '';
        const effectiveModelUsed = data.modelUsed;
        const effectiveFailover = data.failoverOccurred;
        const detectedRecCourses = (data.recommendedCourses && data.recommendedCourses.length > 0)
          ? data.recommendedCourses
          : detectRecommendedCourses(fullContent, courses);

        if (fullContent.length <= 60) {
          setChatMessages(prev => [
            ...prev,
            {
              sender: 'ai',
              text: fullContent,
              modelUsed: effectiveModelUsed,
              failoverOccurred: effectiveFailover,
              responseTimeSec: durationSec,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isStreaming: false,
              recommendedCourses: detectedRecCourses
            }
          ]);
        } else {
          // Token-by-token streaming playback rendered smoothly by Streamdown
          const words = fullContent.split(/(\s+)/);
          let currentChunkIndex = 0;

          setChatMessages(prev => [
            ...prev,
            {
              sender: 'ai',
              text: '',
              modelUsed: effectiveModelUsed,
              failoverOccurred: effectiveFailover,
              responseTimeSec: durationSec,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isStreaming: true,
              recommendedCourses: detectedRecCourses
            }
          ]);

          const streamInterval = setInterval(() => {
            currentChunkIndex += 4;
            if (currentChunkIndex >= words.length) {
              clearInterval(streamInterval);
              setChatMessages(prev => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last && last.sender === 'ai') {
                  last.text = fullContent;
                  last.isStreaming = false;
                  last.responseTimeSec = durationSec;
                  last.recommendedCourses = detectedRecCourses;
                }
                return next;
              });
            } else {
              const partial = words.slice(0, currentChunkIndex).join('');
              setChatMessages(prev => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last && last.sender === 'ai') {
                  last.text = partial;
                  last.isStreaming = true;
                  last.responseTimeSec = durationSec;
                }
                return next;
              });
            }
          }, 20);
        }
        fetchAdminStats();
      }
    } catch (err) {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Safe fallback response engaged.',
          modelUsed: 'local-fallback',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Assistant-UI Session & History Actions
  const handleCreateNewChat = () => {
    const newId = `session_${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      modelUsed: activeLiveModel,
      messages: [
        {
          sender: 'ai',
          text: 'Hello! I am your **LearnAI Educational Assistant**.\nPowered by Google DiffusionGemma 26B diffusion-based LLM with high-speed token generation & intelligent reasoning.\nAsk me to explain concepts, guide you through a lesson, generate a study schedule, or build a 6-month career roadmap!',
          modelUsed: activeLiveModel,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setChatInput('');
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setChatInput('');
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      handleCreateNewChat();
      return;
    }
    const filtered = sessions.filter(s => s.id !== sessionId);
    setSessions(filtered);
    if (currentSessionId === sessionId) {
      setCurrentSessionId(filtered[0].id);
    }
  };

  const handleClearCurrentThread = () => {
    setChatMessages(() => [
      {
        sender: 'ai',
        text: 'Thread cleared. What topic would you like to explore next?',
        modelUsed: activeLiveModel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleCopyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgIdx(idx);
    setTimeout(() => setCopiedMsgIdx(null), 2000);
  };

  const handleToggleFeedback = (idx: number, type: 'like' | 'dislike') => {
    const key = `${currentSessionId}_${idx}`;
    setFeedbackState(prev => ({
      ...prev,
      [key]: prev[key] === type ? (undefined as any) : type
    }));
  };

  const handleRegenerate = (lastPrompt?: string) => {
    if (isAiLoading) return;
    const promptToSend = lastPrompt || chatMessages.filter(m => m.sender === 'user').pop()?.text;
    if (promptToSend) {
      setChatInput(promptToSend);
      setTimeout(() => {
        const sendBtn = document.getElementById('aui-send-button');
        if (sendBtn) sendBtn.click();
      }, 50);
    }
  };

  // Switch Primary AI Model
  const handleSetPrimaryModel = async (newModelId: string) => {
    try {
      const res = await fetch(`${API_BASE}/ai/models`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelId: newModelId })
      });
      if (res.ok) {
        setPrimaryModel(newModelId);
        setActiveLiveModel(newModelId);
        setModelChangeNotification({
          model: newModelId,
          isFailover: false
        });
        setHighlightPill(true);
        setTimeout(() => setHighlightPill(false), 2400);
        fetchAdminStats();
      }
    } catch (err) {
      console.error(err);
    }
  };


  // Filtered Courses
  const filteredCourses = courses.filter(c => {
    const matchCategory = selectedCategory === 'All' || 
      c.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(c.category.toLowerCase());
    const matchSearch = !searchQuery || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.instructor && c.instructor.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.tags && c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchCategory && matchSearch;
  });

  return (
    <div className="astryx-app-shell">
      {/* ====================================================================
          TOP ASTRYX TELEMETRY BANNER (PRIMARY MODEL & LIVE SHARED RPM)
          ==================================================================== */}
      <header className="astryx-demo-banner">
        {/* Left: Active Primary AI Model Telemetry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div
            className={`astryx-ai-pill ${highlightPill ? 'astryx-model-pill-highlight' : ''}`}
            style={{
              border: activeLiveModel !== primaryModel ? '1px solid #F59E0B' : '1px solid rgba(52, 211, 153, 0.4)',
              background: activeLiveModel !== primaryModel ? 'rgba(245, 158, 11, 0.18)' : 'rgba(16, 185, 129, 0.15)',
              transition: 'all 0.3s ease',
              padding: '5px 12px'
            }}
          >
            <span
              className="astryx-dot"
              style={{ background: activeLiveModel !== primaryModel ? '#F59E0B' : '#34D399' }}
            ></span>
            <span style={{ fontWeight: 700, letterSpacing: '0.2px' }}>
              ⚡ PRIMARY AI MODEL: {availableModels.find(m => m.id === primaryModel)?.name || primaryModel.split('/').pop()}
            </span>
            <span style={{ fontSize: '10px', opacity: 0.85, background: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: '4px', marginLeft: '4px' }}>
              {primaryModel}
            </span>
            {activeLiveModel !== primaryModel && (
              <span
                style={{
                  fontSize: '9px',
                  background: '#D97706',
                  color: '#FFFFFF',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  marginLeft: '4px',
                  fontWeight: 800
                }}
              >
                FAILOVER ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* Right: Live Shared RPM Telemetry for 5 Concurrent Users */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Active Users Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#60A5FA', display: 'inline-block' }}></span>
            <span>5 Concurrent Users Active</span>
          </div>

          {/* RPM Gauge Bar & Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>LIVE RPM:</span>
            <div style={{
              width: '80px',
              height: '8px',
              background: 'rgba(255,255,255,0.12)',
              borderRadius: '4px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                width: `${Math.min(100, (currentRpm / 40) * 100)}%`,
                height: '100%',
                background: currentRpm >= 36 ? '#EF4444' : currentRpm > 24 ? '#F59E0B' : '#10B981',
                borderRadius: '4px',
                transition: 'width 0.4s ease'
              }} />
            </div>
            <strong style={{
              fontSize: '12px',
              color: currentRpm >= 36 ? '#EF4444' : currentRpm > 24 ? '#F59E0B' : '#34D399',
              fontFamily: 'monospace'
            }}>
              {currentRpm}/40 RPM
            </strong>
          </div>

          {/* Countdown timer */}
          <div style={{
            fontSize: '11px',
            color: '#CBD5E1',
            background: isRpmExhausted || currentRpm >= 40 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255,255,255,0.06)',
            border: isRpmExhausted || currentRpm >= 40 ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255,255,255,0.1)',
            padding: '2px 8px',
            borderRadius: '12px'
          }}>
            ⏳ Reset: <strong>{rpmResetSeconds}s</strong>
          </div>

          {/* Current User Role Pill or Login Trigger */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#F8FAFC',
                background: currentUser.role === 'admin' ? '#7C3AED' : currentUser.role === 'instructor' ? '#2563EB' : '#059669',
                padding: '3px 8px',
                borderRadius: '4px'
              }}>
                {currentUser.role.toUpperCase()}
              </span>
              <button
                onClick={handleLogout}
                style={{ fontSize: '11px', color: '#94A3B8', textDecoration: 'underline', padding: '2px 4px' }}
                title="Sign out of current account"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode('login');
                setAuthStep('form');
                setShowAuthModal(true);
              }}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#38BDF8',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '3px 10px',
                borderRadius: '6px'
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Global RPM Exhausted Warning Banner (Visible to all 5 concurrent users) */}
      {(isRpmExhausted || currentRpm >= 40) && (
        <div style={{
          background: 'linear-gradient(90deg, #991B1B 0%, #B91C1C 50%, #7F1D1D 100%)',
          color: '#FFFFFF',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: '13px',
          fontWeight: 700,
          boxShadow: '0 4px 14px rgba(185, 28, 28, 0.45)',
          borderBottom: '2px solid #EF4444',
          zIndex: 99
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>
              <strong>RATE LIMIT REACHED (40/40 RPM EXHAUSTED):</strong> 5 concurrent users are sharing this live AI engine. Please wait for sliding window reset before generating more AI responses!
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: 'rgba(0,0,0,0.3)', padding: '4px 12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
              ⏳ Auto-Unlocking in: <strong style={{ color: '#FCA5A5', fontSize: '14px' }}>{rpmResetSeconds}s</strong>
            </span>
          </div>
        </div>
      )}

      {/* ====================================================================
          MAIN NAVBAR
          ==================================================================== */}
      <nav className="astryx-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <div
            className="astryx-logo"
            onClick={() => handleNavigateSuite('public', 'home')}
          >
            <div className="astryx-logo-badge">⚡</div>
            <span>LearnAI</span>
          </div>

          <div className="astryx-suite-tabs">
            <button
              className={`astryx-suite-tab ${currentSuite === 'public' ? 'active' : ''}`}
              onClick={() => handleNavigateSuite('public', 'home')}
            >
              🌐 Public Website
            </button>
            <button
              className={`astryx-suite-tab ${currentSuite === 'student' ? 'active' : ''}`}
              onClick={() => handleNavigateSuite('student', 'student-dashboard')}
            >
              👨‍🎓 Student LMS
            </button>
            <button
              className={`astryx-suite-tab ${currentSuite === 'ai' ? 'active' : ''}`}
              onClick={() => {
                setAiAccessMode(currentUser ? 'private-student' : 'public-sales');
                handleNavigateSuite('ai', 'ai-assistant');
              }}
            >
              🤖 AI Studio <span style={{ fontSize: '10px', background: '#10B981', color: '#FFFFFF', padding: '1px 6px', borderRadius: '999px', marginLeft: '4px', fontWeight: 800 }}>Free</span>
            </button>
            <button
              className={`astryx-suite-tab ${currentSuite === 'instructor' ? 'active' : ''}`}
              onClick={() => handleNavigateSuite('instructor', 'instructor-dashboard')}
            >
              👨‍🏫 Instructor
            </button>
            <button
              className={`astryx-suite-tab ${currentSuite === 'admin' ? 'active' : ''}`}
              onClick={() => handleNavigateSuite('admin', 'admin-dashboard')}
            >
              🛠️ Admin
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="astryx-btn-magic"
            onClick={() => {
              setAiAccessMode(currentUser ? 'private-student' : 'public-sales');
              setAiSubMode('recommendation');
              handleNavigateSuite('ai', 'ai-assistant');
            }}
          >
            🎯 AI Course Finder
          </button>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                onClick={() => {
                  if (currentUser.role === 'instructor') {
                    handleNavigateSuite('instructor', 'instructor-dashboard');
                  } else if (currentUser.role === 'admin') {
                    handleNavigateSuite('admin', 'admin-dashboard');
                  } else {
                    handleNavigateSuite('student', 'profile');
                  }
                }}
              >
                <img src={currentUser.avatar} alt={currentUser.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--astryx-primary)' }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--astryx-navy)', lineHeight: 1.2 }}>{currentUser.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--astryx-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{currentUser.role}</div>
                </div>
              </div>
              <button
                className="astryx-btn-secondary"
                style={{ padding: '6px 12px', fontSize: '11px' }}
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              className="astryx-btn-primary"
              style={{ padding: '7px 14px', fontSize: '12px' }}
              onClick={() => {
                setAuthMode('login');
                setAuthStep('form');
                setShowAuthModal(true);
              }}
            >
              🔑 Sign In / Register
            </button>
          )}
        </div>
      </nav>

      {/* Role-Based Access Denied Notification Banner */}
      {permissionDeniedAlert && (
        <div style={{
          margin: '16px 24px 0',
          padding: '14px 20px',
          background: '#FFF1F2',
          border: '1px solid #FECDD3',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          color: '#9F1239'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '22px' }}>⛔</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '13px' }}>
                ACCESS RESTRICTED: {permissionDeniedAlert.suite} SUITE
              </div>
              <div style={{ fontSize: '12px', color: '#BE123C' }}>
                {permissionDeniedAlert.reason}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              className="astryx-btn-secondary"
              style={{ fontSize: '11px', padding: '6px 12px' }}
              onClick={() => {
                if (currentUser?.role === 'instructor') {
                  handleNavigateSuite('instructor', 'instructor-dashboard');
                } else if (currentUser?.role === 'admin') {
                  handleNavigateSuite('admin', 'admin-dashboard');
                } else {
                  handleNavigateSuite('student', 'student-dashboard');
                }
              }}
            >
              Back to My Dashboard
            </button>
            <button
              className="astryx-btn-primary"
              style={{ fontSize: '11px', padding: '6px 12px' }}
              onClick={() => {
                setAuthMode('login');
                setAuthStep('form');
                setShowAuthModal(true);
              }}
            >
              Switch Demo Role / Sign In
            </button>
            <button
              onClick={() => setPermissionDeniedAlert(null)}
              style={{ fontSize: '14px', color: '#9F1239', padding: '4px 8px', fontWeight: 800 }}
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          ASTRYX SUBNAV STRIP (PAGES ROUTER FOR ACTIVE SUITE)
          ==================================================================== */}
      <div className="astryx-subnav-strip">
        {currentSuite === 'public' && (
          <>
            {[
              { id: 'home', label: '1. Home' },
              { id: 'all-courses', label: '2. All Courses' },
              { id: 'course-details', label: '3. Course Details' },
              { id: 'categories', label: '4. Categories' },
              { id: 'instructors', label: '5. Instructors' },
              { id: 'pricing', label: '6. Pricing' },
              { id: 'about', label: '7. About Us' },
              { id: 'contact', label: '8. Contact' },
              { id: 'legal', label: '9. Legal & Terms' }
            ].map(item => (
              <button
                key={item.id}
                className={`astryx-subnav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                {item.label}
              </button>
            ))}
          </>
        )}

        {currentSuite === 'student' && (
          <>
            {[
              { id: 'student-dashboard', label: '1. Dashboard' },
              { id: 'my-courses', label: '2. My Courses' },
              { id: 'classroom', label: '3. Classroom Player' },
              { id: 'quizzes', label: '4. Quizzes' },
              { id: 'assignments', label: '5. Assignments' },
              { id: 'certificates', label: '6. Certificates' },
              { id: 'cart', label: '7. Cart & Checkout' },
              { id: 'profile', label: '8. Profile & Settings' }
            ].map(item => (
              <button
                key={item.id}
                className={`astryx-subnav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                {item.label}
              </button>
            ))}
          </>
        )}

        {currentSuite === 'ai' && (
          <>
            {[
              { id: 'ai-assistant', label: '1. Full AI Assistant' },
              { id: 'ai-roadmap', label: '2. 6-Month Roadmap' },
              { id: 'ai-career', label: '3. Career Advisor' },
              { id: 'ai-practice', label: '4. AI Quiz Practice' },
              { id: 'ai-planner', label: '5. Study Planner' },
              { id: 'ai-models-view', label: '6. 10-Model Engine' }
            ].map(item => (
              <button
                key={item.id}
                className={`astryx-subnav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                {item.label}
              </button>
            ))}
          </>
        )}

        {currentSuite === 'instructor' && (
          <>
            {[
              { id: 'instructor-dashboard', label: '1. Dashboard' },
              { id: 'instructor-courses', label: '2. Course Builder' },
              { id: 'instructor-students', label: '3. Students' },
              { id: 'instructor-reviews', label: '4. Reviews' },
              { id: 'instructor-revenue', label: '5. Revenue & Analytics' }
            ].map(item => (
              <button
                key={item.id}
                className={`astryx-subnav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                {item.label}
              </button>
            ))}
          </>
        )}

        {currentSuite === 'admin' && (
          <>
            {[
              { id: 'admin-dashboard', label: '1. Platform Dashboard' },
              { id: 'admin-users', label: '2. Users' },
              { id: 'admin-courses', label: '3. Courses' },
              { id: 'admin-orders', label: '4. Orders & Payments' },
              { id: 'admin-ai-mgmt', label: '5. 10-Model AI & Rate Limit' },
              { id: 'admin-analytics', label: '6. Analytics' },
              { id: 'admin-settings', label: '7. System Settings' }
            ].map(item => (
              <button
                key={item.id}
                className={`astryx-subnav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                {item.label}
              </button>
            ))}
          </>
        )}
      </div>

      {/* ====================================================================
          PAGE SUITE 1: PUBLIC / WEBSITE PAGES
          ==================================================================== */}
      {currentSuite === 'public' && (
        <main style={{ flex: 1, padding: '32px 24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          {/* 1. HOME */}
          {currentPage === 'home' && (
            <div>
              <div style={{ textAlign: 'center', padding: '48px 0 36px' }}>
                <div style={{ display: 'inline-block', background: 'var(--astryx-primary-light)', color: 'var(--astryx-primary)', padding: '6px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, marginBottom: '16px' }}>
                  🚀 The AI-Powered Learning Experience
                </div>
                <h1 style={{ fontSize: '42px', fontWeight: 800, color: 'var(--astryx-navy)', lineHeight: 1.2, maxWidth: '780px', margin: '0 auto 16px' }}>
                  Learn Smarter. Get Personalized. <span style={{ color: 'var(--astryx-primary)' }}>Grow Faster.</span>
                </h1>
                <p style={{ fontSize: '16px', color: 'var(--astryx-text-muted)', maxWidth: '600px', margin: '0 auto 28px' }}>
                  Discover 100+ accredited tech courses with 24/7 AI tutoring, step-by-step roadmaps, automated evaluations, and verifiable credentials.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <button className="astryx-btn-primary" onClick={() => setCurrentPage('all-courses')}>
                    Explore All Courses
                  </button>
                  <button
                    className="astryx-btn-magic"
                    onClick={() => {
                      setAiAccessMode(currentUser ? 'private-student' : 'public-sales');
                      setAiSubMode('recommendation');
                      handleNavigateSuite('ai', 'ai-assistant');
                    }}
                  >
                    🎯 Find Course with AI (Free)
                  </button>
                </div>
              </div>

              {/* Public AI Course Sales & Advisor Spotlight Banner */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  borderRadius: '16px',
                  border: '1.5px solid #334155',
                  padding: '24px 28px',
                  margin: '12px 0 36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '20px',
                  boxShadow: '0 12px 32px -8px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', maxWidth: '720px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    boxShadow: '0 6px 18px rgba(59, 130, 246, 0.35)',
                    flexShrink: 0
                  }}>
                    🤖
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
                        Free 24/7 AI Course Sales & Career Advisor
                      </span>
                      <span style={{ fontSize: '11px', background: '#10B981', color: '#FFFFFF', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                        No Login Required
                      </span>
                      <span style={{ fontSize: '11px', background: '#F59E0B', color: '#FFFFFF', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                        🎟️ 5%–20% Passion Coupon
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
                      কোর্স বেছে নিতে দ্বিধায় আছেন? আমাদের AI Advisor-কে আপনার ক্যারিয়ার লক্ষ্য বলুন। AI তাৎক্ষণিক সেরা কোর্সটি রেকমেন্ড করবে এবং আপনার প্যাশনের ওপর ভিত্তি করে ৫%–২০% স্পেশাল ডিসকাউন্ট কুপন দেবে!
                    </p>
                  </div>
                </div>

                <button
                  className="astryx-btn-magic"
                  style={{ padding: '12px 22px', fontSize: '14px', fontWeight: 700 }}
                  onClick={() => {
                    setAiAccessMode(currentUser ? 'private-student' : 'public-sales');
                    setAiSubMode('recommendation');
                    handleNavigateSuite('ai', 'ai-assistant');
                  }}
                >
                  💬 Chat with AI Advisor
                </button>
              </div>

              {/* Popular Categories Grid */}
              <div style={{ marginTop: '48px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--astryx-navy)', marginBottom: '16px' }}>
                  Explore Popular Categories
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  {[
                    { title: 'Programming', count: '48 Courses', icon: '💻' },
                    { title: 'Web Development', count: '35 Courses', icon: '🌐' },
                    { title: 'AI & Data Science', count: '29 Courses', icon: '🤖' },
                    { title: 'Cloud & DevOps', count: '18 Courses', icon: '☁️' }
                  ].map((cat, i) => (
                    <div
                      key={i}
                      className="astryx-card"
                      style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }}
                      onClick={() => {
                        setSelectedCategory(cat.title.split(' ')[0]);
                        setCurrentPage('all-courses');
                      }}
                    >
                      <span style={{ fontSize: '28px' }}>{cat.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--astryx-navy)' }}>{cat.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--astryx-text-muted)' }}>{cat.count}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. ALL COURSES / CATALOG */}
          {currentPage === 'all-courses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['All', 'Web Development', 'Artificial Intelligence', 'AI & Automation', 'Design', 'Programming'].map(cat => (
                    <button
                      key={cat}
                      className={`astryx-subnav-link ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                      style={{ border: '1px solid var(--astryx-border)', padding: '6px 14px' }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Search 15+ courses, topics, instructors..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid var(--astryx-border)', width: '320px', fontSize: '13px' }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ fontSize: '12px', color: '#64748B', cursor: 'pointer' }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Course Catalog Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {filteredCourses.map(c => {
                  const discountPercent = c.originalPrice > c.price 
                    ? Math.round((1 - c.price / c.originalPrice) * 100) 
                    : 0;

                  return (
                    <div
                      key={c.id}
                      className="astryx-card"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setActiveCourse(c);
                        setCurrentPage('course-details');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      {/* Course Thumbnail with Badges */}
                      <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
                        <img
                          src={c.thumbnail}
                          alt={c.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          background: 'rgba(15, 23, 42, 0.85)',
                          backdropFilter: 'blur(4px)',
                          color: '#FFFFFF',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: 700
                        }}>
                          {c.category}
                        </div>
                        <div style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          background: 'rgba(0, 0, 0, 0.75)',
                          color: '#FFFFFF',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          ⏱️ {c.duration}
                        </div>
                      </div>

                      {/* Course Card Body */}
                      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '11px' }}>
                          <span style={{ color: 'var(--astryx-primary)', fontWeight: 700 }}>
                            {c.level}
                          </span>
                          <span style={{ color: '#F59E0B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                            ⭐ {c.rating} ({c.studentsCount.toLocaleString()})
                          </span>
                        </div>

                        <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--astryx-navy)', marginBottom: '8px', lineHeight: 1.35 }}>
                          {c.title}
                        </h4>

                        <p style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', flex: 1, marginBottom: '14px', lineHeight: 1.5 }}>
                          {c.description.length > 110 ? c.description.slice(0, 110) + '...' : c.description}
                        </p>

                        {/* Instructor Mini Pill */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                          <img
                            src={c.instructor.avatar}
                            alt={c.instructor.name}
                            style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>
                            {c.instructor.name}
                          </span>
                        </div>

                        {/* Tags Preview */}
                        {c.tags && (
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '14px' }}>
                            {c.tags.slice(0, 3).map(t => (
                              <span key={t} style={{ fontSize: '10px', background: '#F1F5F9', color: '#64748B', padding: '2px 6px', borderRadius: '4px' }}>
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Price & Actions */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--astryx-border-light)', paddingTop: '14px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                              <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--astryx-navy)' }}>৳{c.price.toLocaleString()}</span>
                              {c.originalPrice > c.price && (
                                <span style={{ fontSize: '12px', color: '#94A3B8', textDecoration: 'line-through' }}>
                                  ৳{c.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            {discountPercent > 0 && (
                              <span style={{ fontSize: '10px', color: '#DC2626', fontWeight: 700 }}>
                                {discountPercent}% OFF
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              className="astryx-btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 700 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCourse(c);
                                setCurrentPage('course-details');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                            >
                              Details
                            </button>
                            {(() => {
                              const isEnrolled = myCoursesList.some(m => m.course.id === c.id);
                              return (
                                <button
                                  className="astryx-btn-primary"
                                  style={{
                                    padding: '6px 12px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    background: isEnrolled ? 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)' : undefined
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isEnrolled) {
                                      openClassroom(c);
                                    } else {
                                      openCheckout(c);
                                    }
                                  }}
                                >
                                  {isEnrolled ? '▶ Continue' : '⚡ Enroll'}
                                </button>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. COURSE DETAILS PAGE (FULL OSTAD-INSPIRED SYLLABUS & CURRICULUM VIEW) */}
          {currentPage === 'course-details' && (
            (() => {
              const course = activeCourse || courses[0];
              if (!course) {
                return (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <h3>No course selected</h3>
                    <button className="astryx-btn-primary" onClick={() => setCurrentPage('all-courses')}>
                      Browse All Courses
                    </button>
                  </div>
                );
              }

              const discountPercent = course.originalPrice > course.price 
                ? Math.round((1 - course.price / course.originalPrice) * 100)
                : 0;

              return (
                <div style={{ paddingBottom: '60px' }}>
                  {/* Hero Header Banner with Deep Gradient */}
                  <div style={{
                    background: 'linear-gradient(135deg, #022c22 0%, #064e3b 40%, #0f172a 100%)',
                    borderRadius: '16px',
                    padding: '36px 32px',
                    color: '#FFFFFF',
                    marginBottom: '32px',
                    boxShadow: '0 10px 25px -5px rgba(2, 44, 34, 0.4)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Background decorative glow */}
                    <div style={{
                      position: 'absolute',
                      right: '-5%',
                      top: '-20%',
                      width: '350px',
                      height: '350px',
                      background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(0,0,0,0) 70%)',
                      borderRadius: '50%',
                      pointerEvents: 'none'
                    }} />

                    {/* Breadcrumbs */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94A3B8', marginBottom: '16px', flexWrap: 'wrap' }}>
                      <span style={{ cursor: 'pointer', color: '#CBD5E1' }} onClick={() => setCurrentPage('home')}>Home</span>
                      <span>›</span>
                      <span style={{ cursor: 'pointer', color: '#CBD5E1' }} onClick={() => setCurrentPage('all-courses')}>Courses</span>
                      <span>›</span>
                      <span style={{ color: '#6EE7B7' }}>{course.category}</span>
                      <span>›</span>
                      <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{course.title}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 380px)', gap: '36px', alignItems: 'start' }}>
                      {/* Left Column: Course Main Info */}
                      <div>
                        {/* Badges */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                          <span style={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#6EE7B7',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            padding: '4px 12px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 800,
                            letterSpacing: '0.3px'
                          }}>
                            {course.category}
                          </span>
                          <span style={{
                            background: 'rgba(56, 189, 248, 0.18)',
                            color: '#7DD3FC',
                            border: '1px solid rgba(56, 189, 248, 0.35)',
                            padding: '4px 12px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 700
                          }}>
                            {course.level}
                          </span>
                          <span style={{
                            background: 'rgba(251, 191, 36, 0.18)',
                            color: '#FDE047',
                            border: '1px solid rgba(251, 191, 36, 0.35)',
                            padding: '4px 12px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 700
                          }}>
                            📜 Verified Certificate Included
                          </span>
                        </div>

                        {/* Title */}
                        <h1 style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1.25, marginBottom: '14px', color: '#F8FAFC' }}>
                          {course.title}
                        </h1>

                        {/* Subtitle / Short Description */}
                        <p style={{ fontSize: '15px', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '22px' }}>
                          {course.description}
                        </p>

                        {/* Metrics Bar */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '20px',
                          flexWrap: 'wrap',
                          fontSize: '13px',
                          color: '#E2E8F0',
                          background: 'rgba(15, 23, 42, 0.45)',
                          padding: '12px 18px',
                          borderRadius: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          marginBottom: '22px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#FBBF24', fontSize: '16px' }}>⭐</span>
                            <strong>{course.rating}</strong>
                            <span style={{ color: '#94A3B8', fontSize: '12px' }}>({course.reviewsCount}+ reviews)</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '15px' }}>👥</span>
                            <strong>{course.studentsCount.toLocaleString()}+</strong>
                            <span style={{ color: '#94A3B8', fontSize: '12px' }}>Learners</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '15px' }}>⏱️</span>
                            <strong>{course.duration}</strong>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '15px' }}>📚</span>
                            <strong>{course.lessonsCount}</strong>
                            <span style={{ color: '#94A3B8', fontSize: '12px' }}>Lessons</span>
                          </div>
                        </div>

                        {/* Instructor Banner Strip */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={course.instructor.avatar}
                            alt={course.instructor.name}
                            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #10B981' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>{course.instructor.name}</span>
                              <span style={{ fontSize: '10px', background: '#059669', color: '#FFFFFF', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>VERIFIED INSTRUCTOR</span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{course.instructor.role || course.instructor.title}</div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Floating Sticky Enrollment & Video Preview Card */}
                      <div style={{
                        background: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid var(--astryx-border)',
                        boxShadow: '0 20px 30px -10px rgba(0,0,0,0.15)',
                        overflow: 'hidden',
                        color: 'var(--astryx-navy)'
                      }}>
                        {/* Video Preview Box */}
                        <div style={{ position: 'relative', width: '100%', height: '210px', background: '#0F172A' }}>
                          {isPlayingCoursePreview ? (
                            <iframe
                              src={`${(course as any).videoPreviewUrl || 'https://www.youtube.com/embed/_uQrJ0TkZlc'}?autoplay=1`}
                              title={course.title}
                              style={{ width: '100%', height: '100%', border: 'none' }}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                position: 'relative',
                                cursor: 'pointer'
                              }}
                              onClick={() => setIsPlayingCoursePreview(true)}
                            >
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                              />
                              <div style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(15, 23, 42, 0.45)'
                              }}>
                                <div style={{
                                  width: '56px',
                                  height: '56px',
                                  borderRadius: '50%',
                                  background: '#2563EB',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: '0 0 20px rgba(37, 99, 235, 0.6)',
                                  color: '#FFFFFF',
                                  fontSize: '22px',
                                  paddingLeft: '4px',
                                  marginBottom: '8px'
                                }}>
                                  ▶
                                </div>
                                <span style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                  Preview Syllabus Video
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Pricing & CTA Content */}
                        <div style={{ padding: '24px' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '30px', fontWeight: 900, color: 'var(--astryx-navy)' }}>
                              ৳{course.price.toLocaleString()}
                            </span>
                            {course.originalPrice > course.price && (
                              <span style={{ fontSize: '15px', color: '#94A3B8', textDecoration: 'line-through' }}>
                                ৳{course.originalPrice.toLocaleString()}
                              </span>
                            )}
                            {discountPercent > 0 && (
                              <span style={{
                                background: '#FEF2F2',
                                color: '#DC2626',
                                fontSize: '12px',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                border: '1px solid #FECDD3'
                              }}>
                                {discountPercent}% OFF
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                            {(() => {
                              const isEnrolled = myCoursesList.some(m => m.course.id === course.id);
                              return (
                                <button
                                  className="astryx-btn-primary"
                                  style={{
                                    justifyContent: 'center',
                                    padding: '13px',
                                    fontSize: '15px',
                                    fontWeight: 800,
                                    borderRadius: '10px',
                                    background: isEnrolled
                                      ? 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)'
                                      : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
                                  }}
                                  onClick={() => {
                                    if (isEnrolled) {
                                      openClassroom(course);
                                    } else {
                                      openCheckout(course);
                                    }
                                  }}
                                >
                                  {isEnrolled ? '▶ Continue Learning / ক্লাসরুমে যান' : '⚡ ভর্তি হন / Enroll Now'}
                                </button>
                              );
                            })()}
                            <button
                              className="astryx-btn-magic"
                              style={{
                                justifyContent: 'center',
                                padding: '11px',
                                fontSize: '13px',
                                fontWeight: 700,
                                borderRadius: '10px'
                              }}
                              onClick={() => {
                                setChatInput(`Please analyze the curriculum for "${course.title}". What are the key milestones and how does it benefit my career?`);
                                setCurrentSuite('ai');
                                setCurrentPage('ai-assistant');
                              }}
                            >
                              🤖 Ask AI Tutor about this Course
                            </button>
                          </div>

                          {/* Guarantee Note */}
                          <div style={{ fontSize: '11px', color: '#64748B', textAlign: 'center', marginBottom: '18px' }}>
                            🔒 30-Day Money-Back Guarantee • Instant Lifetime Access
                          </div>

                          {/* Course Features Checklist */}
                          <div style={{ borderTop: '1px solid var(--astryx-border)', paddingTop: '16px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '10px' }}>
                              THIS COURSE INCLUDES:
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#475569' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#10B981' }}>✓</span>
                                <span><strong>{course.duration}</strong> on-demand HD practical video</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#10B981' }}>✓</span>
                                <span><strong>{course.lessonsCount}</strong> modules & hands-on exercises</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#10B981' }}>✓</span>
                                <span>Real-world portfolio projects with source code</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#10B981' }}>✓</span>
                                <span>Official Verified Certificate of Completion</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#10B981' }}>✓</span>
                                <span>24/7 AI-Powered Study Assistant & Tutor</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#10B981' }}>✓</span>
                                <span>Access on Mobile, Tablet & Desktop</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Details Tab Strip */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    borderBottom: '2px solid var(--astryx-border)',
                    marginBottom: '28px',
                    overflowX: 'auto',
                    paddingBottom: '2px'
                  }}>
                    {[
                      { id: 'overview', label: '🎯 What You\'ll Learn' },
                      { id: 'curriculum', label: `📖 Curriculum (${course.modules.length} Modules)` },
                      { id: 'projects', label: '🚀 Real-World Projects' },
                      { id: 'requirements', label: '📋 Requirements & Target' },
                      { id: 'instructor', label: '👨‍🏫 Instructor Bio' },
                      { id: 'faq', label: '💬 FAQ & Ask AI' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setCourseDetailsTab(tab.id as any)}
                        style={{
                          padding: '10px 18px',
                          fontSize: '13px',
                          fontWeight: 700,
                          borderBottom: courseDetailsTab === tab.id ? '3px solid var(--astryx-primary)' : '3px solid transparent',
                          color: courseDetailsTab === tab.id ? 'var(--astryx-primary)' : '#64748B',
                          background: 'none',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* TAB CONTENT: 1. OVERVIEW & OUTCOMES */}
                  {courseDetailsTab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                      {/* What you will learn */}
                      <div className="astryx-card" style={{ padding: '28px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--astryx-navy)', marginBottom: '18px' }}>
                          🎯 What You'll Learn in This Course
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                          {course.learningOutcomes.map((outcome, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                              <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: '#DCFCE7',
                                color: '#16A34A',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                fontWeight: 900,
                                flexShrink: 0,
                                marginTop: '2px'
                              }}>
                                ✓
                              </div>
                              <span style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
                                {outcome}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Detailed Description */}
                      <div className="astryx-card" style={{ padding: '28px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--astryx-navy)', marginBottom: '14px' }}>
                          About This Course
                        </h3>
                        <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.7, marginBottom: '16px' }}>
                          {course.fullDescription || course.description}
                        </p>
                        {course.tags && (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
                            {course.tags.map(t => (
                              <span
                                key={t}
                                style={{
                                  background: '#F1F5F9',
                                  color: '#475569',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: 600
                                }}
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB CONTENT: 2. CURRICULUM & MODULES */}
                  {courseDetailsTab === 'curriculum' && (
                    <div className="astryx-card" style={{ padding: '28px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--astryx-navy)' }}>
                            Course Curriculum
                          </h3>
                          <p style={{ fontSize: '12px', color: 'var(--astryx-text-muted)' }}>
                            {course.modules.length} Modules • {course.lessonsCount} Lessons • {course.duration} Total Length
                          </p>
                        </div>
                        <button
                          className="astryx-btn-secondary"
                          style={{ fontSize: '11px', padding: '6px 12px' }}
                          onClick={() => {
                            const allExpanded: any = {};
                            course.modules.forEach(m => { allExpanded[m.id] = true; });
                            setExpandedCourseModules(allExpanded);
                          }}
                        >
                          Expand All Modules
                        </button>
                      </div>

                      {/* Module Accordions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {course.modules.map((module, mIdx) => {
                          const isExpanded = expandedCourseModules[module.id] ?? (mIdx === 0);
                          return (
                            <div
                              key={module.id}
                              style={{
                                border: '1px solid var(--astryx-border)',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                background: '#FFFFFF'
                              }}
                            >
                              {/* Module Header */}
                              <div
                                onClick={() => setExpandedCourseModules(prev => ({ ...prev, [module.id]: !isExpanded }))}
                                style={{
                                  padding: '14px 18px',
                                  background: '#F8FAFC',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  cursor: 'pointer',
                                  userSelect: 'none'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <span style={{ fontSize: '12px', color: '#64748B' }}>{isExpanded ? '▼' : '▶'}</span>
                                  <strong style={{ fontSize: '14px', color: 'var(--astryx-navy)' }}>
                                    {module.title}
                                  </strong>
                                </div>
                                <span style={{ fontSize: '12px', color: '#64748B' }}>
                                  {module.lessons.length} {module.lessons.length === 1 ? 'Lesson' : 'Lessons'}
                                </span>
                              </div>

                              {/* Lesson List */}
                              {isExpanded && (
                                <div style={{ padding: '8px 18px' }}>
                                  {module.lessons.map((lesson, lIdx) => (
                                    <div
                                      key={lesson.id}
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '10px 0',
                                        borderBottom: lIdx < module.lessons.length - 1 ? '1px solid #F1F5F9' : 'none',
                                        fontSize: '13px'
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ color: 'var(--astryx-primary)', fontSize: '14px' }}>▶</span>
                                        <span style={{ color: '#334155' }}>{lesson.title}</span>
                                        {lIdx === 0 && (
                                          <span style={{
                                            background: '#DCFCE7',
                                            color: '#15803D',
                                            fontSize: '10px',
                                            fontWeight: 800,
                                            padding: '1px 6px',
                                            borderRadius: '4px'
                                          }}>
                                            PREVIEW
                                          </span>
                                        )}
                                      </div>
                                      <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>
                                        {lesson.duration}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB CONTENT: 3. PROJECTS */}
                  {courseDetailsTab === 'projects' && (
                    <div className="astryx-card" style={{ padding: '28px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--astryx-navy)', marginBottom: '14px' }}>
                        🚀 Real-World Hands-On Projects
                      </h3>
                      <p style={{ fontSize: '13px', color: 'var(--astryx-text-muted)', marginBottom: '20px' }}>
                        You won't just learn theory. In this course, you will build production-grade projects ready for your portfolio:
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                        {(course.projects || ['Capstone Production Project', 'Full Stack System Deployment', 'Automated Testing Suite']).map((proj, pIdx) => (
                          <div
                            key={pIdx}
                            style={{
                              background: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              borderRadius: '10px',
                              padding: '18px'
                            }}
                          >
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>💻</div>
                            <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--astryx-navy)', marginBottom: '6px' }}>
                              Project 0{pIdx + 1}: {proj}
                            </h4>
                            <p style={{ fontSize: '12px', color: '#64748B' }}>
                              Built with industry best practices, clean code standards, and automated evaluation metrics.
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB CONTENT: 4. REQUIREMENTS & SUITABLE FOR */}
                  {courseDetailsTab === 'requirements' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                      <div className="astryx-card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--astryx-navy)', marginBottom: '14px' }}>
                          📋 Prerequisites & Requirements
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {(course.requirements || ['Basic computer usage and internet browsing capability', 'High enthusiasm for technical problem solving']).map((req, rIdx) => (
                            <div key={rIdx} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#334155' }}>
                              <span style={{ color: '#2563EB' }}>•</span>
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="astryx-card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--astryx-navy)', marginBottom: '14px' }}>
                          👥 Who This Course Is For
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {(course.suitableFor || ['Beginner and intermediate learners looking to build real skills', 'Professionals seeking career advancement in 2026']).map((tgt, tIdx) => (
                            <div key={tIdx} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#334155' }}>
                              <span style={{ color: '#10B981' }}>✓</span>
                              <span>{tgt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB CONTENT: 5. INSTRUCTOR BIO */}
                  {courseDetailsTab === 'instructor' && (
                    <div className="astryx-card" style={{ padding: '28px' }}>
                      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--astryx-primary)' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--astryx-navy)' }}>
                              {course.instructor.name}
                            </h3>
                            <span style={{
                              background: '#DCFCE7',
                              color: '#15803D',
                              fontSize: '11px',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }}>
                              TOP INSTRUCTOR
                            </span>
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--astryx-primary)', fontWeight: 700, margin: '4px 0 12px' }}>
                            {course.instructor.role || course.instructor.title}
                          </div>
                          <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
                            {course.instructor.bio || 'Dedicated educator and tech leader with deep industry experience mentoring students and building production systems.'}
                          </p>
                          <div style={{ display: 'flex', gap: '24px', fontSize: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                            <div>⭐ <strong>{course.rating}</strong> Instructor Rating</div>
                            <div>👥 <strong>{course.studentsCount.toLocaleString()}+</strong> Students Taught</div>
                            <div>📜 <strong>100%</strong> Verified Credentials</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB CONTENT: 6. FAQ & ASK AI */}
                  {courseDetailsTab === 'faq' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {/* AI Assistant Quick Box */}
                      <div style={{
                        background: 'linear-gradient(135deg, #EFF6FF 0%, #FAF5FF 100%)',
                        border: '1px solid #C7D2FE',
                        borderRadius: '12px',
                        padding: '24px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '22px' }}>🤖</span>
                          <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--astryx-navy)' }}>
                            Have Questions About This Course? Ask LearnAI Assistant
                          </h4>
                        </div>
                        <p style={{ fontSize: '13px', color: '#475569', marginBottom: '14px' }}>
                          Click any question below to immediately ask our 24/7 AI tutor:
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {[
                            `এই কোর্সের জন্য আমার কী কী ব্যাকগ্রাউন্ড থাকা দরকার?`,
                            `কোর্সের কারিকুলাম ও প্রজেক্ট সম্পর্কে বিস্তারিত বলো।`,
                            `২০২৬ সালে এই স্কিলটি দিয়ে কী ধরণের জব পাওয়া যাবে?`,
                            `কোর্সের সাথে সার্টিফিকেট কীভাবে দেওয়া হয়?`
                          ].map((q, qIdx) => (
                            <button
                              key={qIdx}
                              onClick={() => {
                                setChatInput(`About "${course.title}": ${q}`);
                                setCurrentSuite('ai');
                                setCurrentPage('ai-assistant');
                              }}
                              style={{
                                background: '#FFFFFF',
                                border: '1px solid #CBD5E1',
                                borderRadius: '8px',
                                padding: '8px 14px',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: 'var(--astryx-primary)',
                                cursor: 'pointer'
                              }}
                            >
                              💡 {q}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Standard FAQs */}
                      <div className="astryx-card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--astryx-navy)', marginBottom: '16px' }}>
                          Frequently Asked Questions
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--astryx-navy)' }}>
                              কোর্সে এনরোল করার পর অ্যাক্সেস কতদিন থাকবে?
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                              কোর্সটিতে লাইফটাইম অ্যাক্সেস দেওয়া হয়। ভবিষ্যতে নতুন কোনো লেকচার বা আপডেটেড কন্টেন্ট যোগ হলে তা ফ্রিতে দেখতে পাবেন।
                            </div>
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--astryx-navy)' }}>
                              কোর্স শেষে কি সার্টিফিকেট পাব?
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                              হ্যাঁ, প্রতিটি মডিউলের লেসন ও কুইজ ১০০% সম্পন্ন করলে প্ল্যাটফর্ম থেকে ভেরিফায়েবল ডিজিটাল সার্টিফিকেট জেনারেট হবে।
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
          )}

          {/* 3. CATEGORIES EXPLORER */}
          {currentPage === 'categories' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Course Categories</h2>
              <p style={{ color: 'var(--astryx-text-muted)', marginBottom: '24px' }}>Explore learning domains tailored for diploma computer engineering careers.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {[
                  { name: 'Software & Programming', desc: 'Python, C++, Java, Object Oriented Design and Algorithms.', count: '48 Courses' },
                  { name: 'Full-Stack Web Engineering', desc: 'React, Next.js, Node.js, Express, REST APIs, and UI/UX.', count: '35 Courses' },
                  { name: 'AI & Data Science', desc: 'Machine Learning, Deep Learning, NVIDIA NIM LLM endpoints, Pandas.', count: '29 Courses' },
                  { name: 'DevOps & Networking', desc: 'Docker, Linux Server Administration, CI/CD, and Cloud Deployment.', count: '18 Courses' }
                ].map((item, idx) => (
                  <div key={idx} className="astryx-card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--astryx-navy)', marginBottom: '8px' }}>{item.name}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--astryx-text-muted)', marginBottom: '16px' }}>{item.desc}</p>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--astryx-primary)' }}>{item.count} →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. INSTRUCTORS */}
          {currentPage === 'instructors' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Learn from Industry Leaders</h2>
              <p style={{ color: 'var(--astryx-text-muted)', marginBottom: '24px' }}>Expert architects and educators guiding your technical development.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {[
                  { name: 'Dr. Tariqul Islam', title: 'Senior Software Architect & AI Instructor', students: '9,680', rating: '4.9', bio: '12+ years building enterprise web and machine learning applications.' },
                  { name: 'Mahmudur Rahman', title: 'Cloud DevOps Specialist', students: '5,200', rating: '4.8', bio: 'Specialist in container orchestration, Kubernetes, and automated CI/CD pipelines.' }
                ].map((inst, i) => (
                  <div key={i} className="astryx-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--astryx-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>👨‍🏫</div>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--astryx-navy)' }}>{inst.name}</h4>
                        <span style={{ fontSize: '12px', color: 'var(--astryx-primary)', fontWeight: 600 }}>{inst.title}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--astryx-text-muted)', marginBottom: '16px' }}>{inst.bio}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderTop: '1px solid var(--astryx-border-light)', paddingTop: '12px' }}>
                      <span>⭐ <strong>{inst.rating}</strong> Rating</span>
                      <span>👥 <strong>{inst.students}</strong> Students</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. PRICING */}
          {currentPage === 'pricing' && (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Transparent & Affordable Plans</h2>
              <p style={{ color: 'var(--astryx-text-muted)', marginBottom: '32px' }}>Invest in practical technical skills with lifetime access and verified certificates.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
                <div className="astryx-card" style={{ padding: '32px', textAlign: 'left' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Student Free Tier</h3>
                  <div style={{ fontSize: '32px', fontWeight: 800, margin: '14px 0' }}>৳0</div>
                  <ul style={{ fontSize: '13px', lineHeight: '2', color: 'var(--astryx-text-muted)', marginBottom: '24px' }}>
                    <li>✓ Access to open preview lessons</li>
                    <li>✓ Community discussion forum</li>
                    <li>✓ Basic AI Tutor (3 queries/day)</li>
                  </ul>
                  <button className="astryx-btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Get Started</button>
                </div>

                <div className="astryx-card" style={{ padding: '32px', textAlign: 'left', border: '2px solid var(--astryx-primary)', background: '#F8FAFC' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--astryx-primary)', textTransform: 'uppercase' }}>Most Popular</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Lifetime Pro Pass</h3>
                  <div style={{ fontSize: '32px', fontWeight: 800, margin: '14px 0', color: 'var(--astryx-navy)' }}>৳1,499</div>
                  <ul style={{ fontSize: '13px', lineHeight: '2', color: 'var(--astryx-text-main)', marginBottom: '24px' }}>
                    <li>✓ All course video streams & resources</li>
                    <li>✓ Unlimited 10-Model AI Assistant</li>
                    <li>✓ Official verified certificates</li>
                    <li>✓ Capstone project grading</li>
                  </ul>
                  <button className="astryx-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Enroll Now</button>
                </div>
              </div>
            </div>
          )}

          {/* 6. ABOUT & CONTACT & LEGAL */}
          {currentPage === 'about' && (
            <div className="astryx-card" style={{ padding: '36px', maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '14px' }}>About LearnAI Platform</h2>
              <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--astryx-text-main)' }}>
                LearnAI was developed as an advanced <strong>AI-Powered Online Course Management System</strong> for the Diploma Final Year Group Project.
                It integrates modern educational methodologies with high-performance reasoning models from NVIDIA NIM, offering continuous pedagogical assistance, contextual lesson tutoring, automated evaluation, and accredited digital credentials.
              </p>
            </div>
          )}

          {currentPage === 'contact' && (
            <div className="astryx-card" style={{ padding: '36px', maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '14px' }}>Contact Support & Academic Desk</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input type="text" placeholder="Your Name" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--astryx-border)' }} />
                <input type="email" placeholder="Your Email" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--astryx-border)' }} />
                <textarea placeholder="Your Inquiry..." style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--astryx-border)', height: '100px' }}></textarea>
                <button className="astryx-btn-primary" onClick={() => alert('Thank you! Your message has been dispatched to the LearnAI administration.')}>Send Message</button>
              </div>
            </div>
          )}

          {currentPage === 'legal' && (
            <div className="astryx-card" style={{ padding: '36px', maxWidth: '800px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '10px' }}>Terms & Conditions and Privacy Policy</h3>
              <p style={{ fontSize: '13px', lineHeight: 1.8, color: 'var(--astryx-text-muted)' }}>
                All course content, video materials, and software codes are provided for academic learning and professional training.
                Student data is securely handled with token-based authorization and verifiable certificate identifiers.
              </p>
            </div>
          )}
        </main>
      )}

      {/* ====================================================================
          PAGE SUITE 2: STUDENT / LEARNER PAGES
          ==================================================================== */}
      {currentSuite === 'student' && (
        <main style={{ flex: 1, padding: '28px 24px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          {/* ====================================================================
              1. STUDENT DASHBOARD
              ==================================================================== */}
          {currentPage === 'student-dashboard' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--astryx-navy)' }}>
                    Welcome back, {currentUser?.name || 'Student'}! 👋
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--astryx-text-muted)' }}>
                    Track your curriculum progress, take module quizzes, submit capstones, and access your verified credentials.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="astryx-btn-secondary" onClick={() => {
                    setCurrentSuite('public');
                    setCurrentPage('all-courses');
                  }}>
                    🔍 Browse More Courses
                  </button>
                  <button className="astryx-btn-magic" onClick={() => {
                    setCurrentSuite('ai');
                    setCurrentPage('ai-roadmap');
                  }}>
                    🗺️ View 6-Month AI Roadmap
                  </button>
                </div>
              </div>

              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div className="astryx-card" style={{ padding: '24px', cursor: 'pointer' }} onClick={() => setCurrentPage('my-courses')}>
                  <div style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', fontWeight: 700 }}>ENROLLED COURSES</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--astryx-navy)', marginTop: '4px' }}>
                    {myCoursesList.length}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--astryx-primary)', marginTop: '6px', fontWeight: 600 }}>
                    Click to view all enrolled courses →
                  </div>
                </div>

                <div className="astryx-card" style={{ padding: '24px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', fontWeight: 700 }}>HOURS SPENT LEARNING</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--astryx-primary)', marginTop: '4px' }}>
                    {myCoursesList.length > 0 ? `${myCoursesList.length * 8}h 30m` : '0h 0m'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#10B981', marginTop: '6px', fontWeight: 600 }}>
                    ⚡ Active weekly streak: 4 days
                  </div>
                </div>

                <div className="astryx-card" style={{ padding: '24px', cursor: 'pointer' }} onClick={() => setCurrentPage('quizzes')}>
                  <div style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', fontWeight: 700 }}>QUIZZES & ASSESSMENTS</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--astryx-success)', marginTop: '4px' }}>
                    {quizResult?.passed ? '1 Passed (100%)' : 'Ready to Test'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--astryx-primary)', marginTop: '6px', fontWeight: 600 }}>
                    Take module quizzes →
                  </div>
                </div>

                <div className="astryx-card" style={{ padding: '24px', cursor: 'pointer' }} onClick={() => setCurrentPage('certificates')}>
                  <div style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', fontWeight: 700 }}>CERTIFICATES EARNED</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#D97706', marginTop: '4px' }}>
                    {certificatesList.length || myCoursesList.filter(m => m.enrollment.isCertified).length || 1}
                  </div>
                  <div style={{ fontSize: '11px', color: '#D97706', marginTop: '6px', fontWeight: 600 }}>
                    View verified credentials →
                  </div>
                </div>
              </div>

              {/* Active Course Progress or Empty State */}
              {myCoursesList.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="astryx-card" style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--astryx-navy)', margin: 0 }}>
                        Current In-Progress Course
                      </h3>
                      <span style={{
                        background: '#EFF6FF',
                        color: 'var(--astryx-primary)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700
                      }}>
                        Last Active: Today
                      </span>
                    </div>

                    {(() => {
                      const activeItem = myCoursesList[0];
                      const isPending = activeItem.enrollment.paymentStatus === 'pending';
                      return (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <img
                              src={activeItem.course.thumbnail}
                              alt={activeItem.course.title}
                              style={{ width: '90px', height: '65px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div>
                              <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--astryx-navy)', margin: 0 }}>
                                {activeItem.course.title}
                              </h4>
                              <p style={{ fontSize: '13px', color: 'var(--astryx-text-muted)', margin: '4px 0 0' }}>
                                Instructor: <strong>{activeItem.course.instructor.name}</strong> • {activeItem.course.level}
                              </p>
                              {isPending && (
                                <span style={{
                                  display: 'inline-block',
                                  marginTop: '6px',
                                  background: '#FEF3C7',
                                  color: '#B45309',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: 800
                                }}>
                                  ⏳ Payment Pending Verification
                                </span>
                              )}
                            </div>
                          </div>

                          <div style={{ width: '240px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                              <span>Curriculum Completion</span>
                              <span style={{ color: 'var(--astryx-primary)' }}>{activeItem.enrollment.progressPercent}%</span>
                            </div>
                            <div className="astryx-progress-track">
                              <div className="astryx-progress-fill" style={{ width: `${activeItem.enrollment.progressPercent}%` }}></div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '10px' }}>
                            {isPending ? (
                              <button
                                className="astryx-btn-primary"
                                style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
                                onClick={() => handleApprovePendingPayment(activeItem.course.id)}
                              >
                                ⚡ Approve (Dev Demo)
                              </button>
                            ) : (
                              <button
                                className="astryx-btn-primary"
                                onClick={() => openClassroom(activeItem.course)}
                              >
                                ▶ Resume Classroom
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Quick Access to LMS Modules */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <div
                      className="astryx-card"
                      style={{ padding: '20px', cursor: 'pointer', borderLeft: '4px solid #3B82F6' }}
                      onClick={() => setCurrentPage('my-courses')}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>📚</div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 4px' }}>My Enrolled Courses</h4>
                      <p style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', margin: 0 }}>
                        View all your registered courses, progress, and lesson shortcuts.
                      </p>
                    </div>

                    <div
                      className="astryx-card"
                      style={{ padding: '20px', cursor: 'pointer', borderLeft: '4px solid #10B981' }}
                      onClick={() => setCurrentPage('quizzes')}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>📝</div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 4px' }}>Course Quizzes</h4>
                      <p style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', margin: 0 }}>
                        Test your knowledge with interactive module assessments.
                      </p>
                    </div>

                    <div
                      className="astryx-card"
                      style={{ padding: '20px', cursor: 'pointer', borderLeft: '4px solid #8B5CF6' }}
                      onClick={() => setCurrentPage('assignments')}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>📂</div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 4px' }}>Assignments & Capstone</h4>
                      <p style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', margin: 0 }}>
                        Submit your code repositories and practical projects for review.
                      </p>
                    </div>

                    <div
                      className="astryx-card"
                      style={{ padding: '20px', cursor: 'pointer', borderLeft: '4px solid #F59E0B' }}
                      onClick={() => setCurrentPage('certificates')}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏆</div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 4px' }}>Certificates</h4>
                      <p style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', margin: 0 }}>
                        View & download verified A4 Landscape official completion certificates.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="astryx-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '14px' }}>🎓</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--astryx-navy)' }}>
                    You Haven't Enrolled in Any Courses Yet
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--astryx-text-muted)', maxWidth: '500px', margin: '8px auto 20px' }}>
                    Browse our industry-curated courses in Web Development, Artificial Intelligence, and Automation to kickstart your journey.
                  </p>
                  <button
                    className="astryx-btn-primary"
                    style={{ padding: '12px 28px', fontSize: '14px' }}
                    onClick={() => {
                      setCurrentSuite('public');
                      setCurrentPage('all-courses');
                    }}
                  >
                    🚀 Browse Course Catalog
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ====================================================================
              2. MY COURSES
              ==================================================================== */}
          {currentPage === 'my-courses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--astryx-navy)', margin: 0 }}>
                    My Enrolled Courses ({myCoursesList.length})
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--astryx-text-muted)', margin: '4px 0 0' }}>
                    Access your active classrooms, lessons, assignments, and certificates.
                  </p>
                </div>
                <button
                  className="astryx-btn-primary"
                  onClick={() => {
                    setCurrentSuite('public');
                    setCurrentPage('all-courses');
                  }}
                >
                  + Enroll in New Course
                </button>
              </div>

              {myCoursesList.length === 0 ? (
                <div className="astryx-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📚</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800 }}>No Enrolled Courses Found</h3>
                  <p style={{ fontSize: '14px', color: 'var(--astryx-text-muted)', margin: '8px 0 20px' }}>
                    You have not enrolled in any course yet. Explore our top courses with AI tutors today!
                  </p>
                  <button
                    className="astryx-btn-primary"
                    onClick={() => {
                      setCurrentSuite('public');
                      setCurrentPage('all-courses');
                    }}
                  >
                    Explore Courses
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                  {myCoursesList.map(item => {
                    const isPending = item.enrollment.paymentStatus === 'pending';
                    const isFailed = item.enrollment.paymentStatus === 'failed';
                    return (
                      <div key={item.enrollment.id} className="astryx-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', width: '100%', height: '170px' }}>
                          <img
                            src={item.course.thumbnail}
                            alt={item.course.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 800,
                            background: isPending ? '#FEF3C7' : isFailed ? '#FEE2E2' : '#DCFCE7',
                            color: isPending ? '#B45309' : isFailed ? '#DC2626' : '#15803D'
                          }}>
                            {isPending ? '⏳ PAYMENT PENDING' : isFailed ? '✕ PAYMENT FAILED' : '✓ ACTIVE / PAID'}
                          </div>
                        </div>

                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--astryx-primary)', marginBottom: '4px' }}>
                            {item.course.category.toUpperCase()} • {item.course.level}
                          </div>
                          <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--astryx-navy)', margin: '0 0 8px' }}>
                            {item.course.title}
                          </h4>
                          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px' }}>
                            Instructor: <strong>{item.course.instructor.name}</strong>
                          </div>

                          <div style={{ margin: 'auto 0 16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                              <span>Progress</span>
                              <span style={{ color: 'var(--astryx-primary)' }}>{item.enrollment.progressPercent}%</span>
                            </div>
                            <div className="astryx-progress-track">
                              <div className="astryx-progress-fill" style={{ width: `${item.enrollment.progressPercent}%` }}></div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {isPending ? (
                              <button
                                className="astryx-btn-primary"
                                style={{
                                  width: '100%',
                                  justifyContent: 'center',
                                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                                }}
                                onClick={() => handleApprovePendingPayment(item.course.id)}
                              >
                                ⚡ Approve Payment (Dev Demo)
                              </button>
                            ) : isFailed ? (
                              <button
                                className="astryx-btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                                onClick={() => openCheckout(item.course)}
                              >
                                🔄 Retry Payment
                              </button>
                            ) : (
                              <button
                                className="astryx-btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                                onClick={() => openClassroom(item.course)}
                              >
                                ▶ Open Classroom Player
                              </button>
                            )}

                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                className="astryx-btn-secondary"
                                style={{ flex: 1, justifyContent: 'center', fontSize: '12px', padding: '8px' }}
                                onClick={() => openQuiz(item.course.id)}
                              >
                                📝 Quiz
                              </button>
                              {item.enrollment.isCertified ? (
                                <button
                                  className="astryx-btn-secondary"
                                  style={{ flex: 1, justifyContent: 'center', fontSize: '12px', padding: '8px', color: '#D97706', borderColor: '#FDE68A', background: '#FFFBEB' }}
                                  onClick={() => handleViewCertificate(item.enrollment.certificateId || item.course.id, item.course)}
                                >
                                  🏆 Certificate
                                </button>
                              ) : (
                                <button
                                  className="astryx-btn-secondary"
                                  style={{ flex: 1, justifyContent: 'center', fontSize: '12px', padding: '8px' }}
                                  onClick={() => {
                                    setActiveCourse(item.course);
                                    setCurrentPage('assignments');
                                  }}
                                >
                                  📂 Assignment
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ====================================================================
              3. CLASSROOM PLAYER
              ==================================================================== */}
          {currentPage === 'classroom' && activeCourse && selectedLesson && (
            <div>
              {/* Back to courses banner */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <button
                  className="astryx-btn-secondary"
                  style={{ fontSize: '13px', padding: '6px 14px' }}
                  onClick={() => setCurrentPage('my-courses')}
                >
                  ← Back to My Courses
                </button>
                <div style={{ fontSize: '13px', color: '#64748B' }}>
                  Course: <strong>{activeCourse.title}</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
                <div>
                  <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                    <iframe
                      src={selectedLesson.videoUrl}
                      title={selectedLesson.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allowFullScreen
                    ></iframe>
                  </div>

                  {/* Classroom Control Bar & Tabs */}
                  <div className="astryx-card" style={{ marginTop: '20px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--astryx-border)', paddingBottom: '14px', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {(['content', 'notes', 'resources', 'discussion'] as const).map(tab => (
                          <button
                            key={tab}
                            className={`astryx-subnav-link ${classroomTab === tab ? 'active' : ''}`}
                            onClick={() => setClassroomTab(tab)}
                          >
                            {tab.toUpperCase()}
                          </button>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          className="astryx-btn-magic"
                          onClick={() => {
                            setAiSubMode('course-assistant');
                            setCurrentSuite('ai');
                            setCurrentPage('ai-assistant');
                          }}
                        >
                          💬 Ask Lesson Assistant
                        </button>

                        <button
                          className="astryx-btn-primary"
                          onClick={() => handleCompleteLesson(selectedLesson.id)}
                        >
                          {activeEnrollment?.completedLessonIds?.includes(selectedLesson.id) ? '✓ Completed' : 'Mark as Complete'}
                        </button>
                      </div>
                    </div>

                    {classroomTab === 'content' && (
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--astryx-navy)' }}>
                          {selectedLesson.title}
                        </h3>
                        <div style={{ whiteSpace: 'pre-line', fontSize: '14px', lineHeight: 1.8, color: 'var(--astryx-text-main)' }}>
                          {selectedLesson.content}
                        </div>
                      </div>
                    )}

                    {classroomTab === 'notes' && (
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px' }}>My Personal Lesson Notes</h4>
                        <p style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', marginBottom: '10px' }}>
                          Take structured notes while watching the lesson. These will be saved to your profile.
                        </p>
                        <textarea
                          value={lessonNotes}
                          onChange={e => setLessonNotes(e.target.value)}
                          placeholder="Write down key takeaways, code snippets, questions..."
                          style={{ width: '100%', height: '140px', padding: '12px', borderRadius: '8px', border: '1px solid var(--astryx-border)', fontSize: '13px', fontFamily: 'inherit' }}
                        />
                        <button
                          className="astryx-btn-primary"
                          style={{ marginTop: '10px' }}
                          onClick={() => alert('Lesson notes saved successfully to your cloud notebook!')}
                        >
                          💾 Save Notes
                        </button>
                      </div>
                    )}

                    {classroomTab === 'resources' && (
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '12px' }}>Downloadable Resources & Code</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ padding: '12px 16px', background: '#F8FAFC', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--astryx-border)' }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '13px' }}>📦 {selectedLesson.title}_Source_Code.zip</div>
                              <div style={{ fontSize: '11px', color: '#64748B' }}>GitHub Source Archive • 2.4 MB</div>
                            </div>
                            <button className="astryx-btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => alert('Downloading source code archive...')}>
                              Download
                            </button>
                          </div>
                          <div style={{ padding: '12px 16px', background: '#F8FAFC', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--astryx-border)' }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '13px' }}>📄 Lecture_Slides_and_CheatSheet.pdf</div>
                              <div style={{ fontSize: '11px', color: '#64748B' }}>Curriculum PDF Notes • 4.1 MB</div>
                            </div>
                            <button className="astryx-btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => alert('Downloading lecture notes PDF...')}>
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {classroomTab === 'discussion' && (
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '12px' }}>Lesson Discussion & Q&A</h4>
                        <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                          {discussionMessages.map((m, idx) => (
                            <div key={idx} style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}>
                              <div style={{ fontWeight: 700, color: 'var(--astryx-navy)', display: 'flex', justifyContent: 'space-between' }}>
                                <span>{m.name}</span>
                                <span style={{ fontSize: '11px', color: '#94A3B8' }}>{m.time}</span>
                              </div>
                              <div style={{ color: 'var(--astryx-text-main)', marginTop: '4px' }}>{m.text}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            placeholder="Ask a question or share a thought..."
                            value={discussionInput}
                            onChange={e => setDiscussionInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && discussionInput.trim()) {
                                setDiscussionMessages([...discussionMessages, { name: currentUser?.name || 'Student', text: discussionInput, time: 'Just now' }]);
                                setDiscussionInput('');
                              }
                            }}
                            style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--astryx-border)', fontSize: '13px' }}
                          />
                          <button
                            className="astryx-btn-primary"
                            onClick={() => {
                              if (!discussionInput.trim()) return;
                              setDiscussionMessages([...discussionMessages, { name: currentUser?.name || 'Student', text: discussionInput, time: 'Just now' }]);
                              setDiscussionInput('');
                            }}
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar Curriculum Navigator */}
                <aside className="astryx-card" style={{ padding: '20px', height: 'fit-content' }}>
                  <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--astryx-border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700 }}>
                      <span>Course Progress</span>
                      <span style={{ color: 'var(--astryx-primary)' }}>{activeEnrollment?.progressPercent || 33}%</span>
                    </div>
                    <div className="astryx-progress-track" style={{ marginTop: '8px' }}>
                      <div className="astryx-progress-fill" style={{ width: `${activeEnrollment?.progressPercent || 33}%` }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                    <button className="astryx-btn-secondary" style={{ flex: 1, padding: '7px', fontSize: '12px' }} onClick={() => openQuiz(activeCourse.id)}>
                      📝 Quiz
                    </button>
                    {activeEnrollment?.isCertified ? (
                      <button className="astryx-btn-primary" style={{ flex: 1, padding: '7px', fontSize: '12px', background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)' }} onClick={() => handleViewCertificate(activeEnrollment.certificateId || activeCourse.id, activeCourse)}>
                        🏆 Certificate
                      </button>
                    ) : (
                      <button className="astryx-btn-secondary" style={{ flex: 1, padding: '7px', fontSize: '12px' }} onClick={() => setCurrentPage('assignments')}>
                        📂 Assignment
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '500px', overflowY: 'auto' }}>
                    {activeCourse.modules.map(mod => (
                      <div key={mod.id}>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--astryx-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                          {mod.title}
                        </div>
                        {mod.lessons.map(les => {
                          const isDone = activeEnrollment?.completedLessonIds?.includes(les.id);
                          const isCur = selectedLesson.id === les.id;
                          return (
                            <div
                              key={les.id}
                              onClick={() => setSelectedLesson(les)}
                              style={{
                                padding: '9px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontSize: '12px',
                                marginBottom: '4px',
                                background: isCur ? 'var(--astryx-primary-light)' : 'transparent',
                                color: isCur ? 'var(--astryx-primary)' : 'var(--astryx-text-main)',
                                fontWeight: isCur ? 700 : 500,
                                border: isCur ? '1px solid #BFDBFE' : '1px solid transparent'
                              }}
                            >
                              <span style={{ color: isDone ? '#16A34A' : '#94A3B8', fontWeight: 800 }}>
                                {isDone ? '✓' : '○'}
                              </span>
                              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {les.title}
                              </span>
                              <span style={{ fontSize: '10px', color: '#94A3B8' }}>{les.duration}</span>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            </div>
          )}

          {/* ====================================================================
              4. QUIZZES
              ==================================================================== */}
          {currentPage === 'quizzes' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--astryx-navy)', margin: 0 }}>
                    Module Quizzes & Assessments
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--astryx-text-muted)', margin: '4px 0 0' }}>
                    Pass module quizzes with 70%+ score to qualify for official certification.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                {courses.slice(0, 4).map((c, idx) => {
                  const isPassed = quizResult && quizResult.passed && activeCourse?.id === c.id;
                  return (
                    <div key={c.id} className="astryx-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--astryx-primary)', background: '#EFF6FF', padding: '3px 8px', borderRadius: '4px' }}>
                          MODULE 0{idx + 1} ASSESSMENT
                        </span>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: isPassed ? '#DCFCE7' : '#F1F5F9',
                          color: isPassed ? '#15803D' : '#64748B'
                        }}>
                          {isPassed ? '✓ Passed (100%)' : 'Ready to Test'}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--astryx-navy)', margin: '0 0 6px' }}>
                        {c.title} — Comprehensive Knowledge Check
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', flex: 1, margin: '0 0 16px' }}>
                        Evaluates core fundamentals, algorithmic problem solving, and architecture concepts taught in this curriculum.
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B', borderTop: '1px solid #F1F5F9', paddingTop: '12px', marginBottom: '16px' }}>
                        <div>⏱️ <strong>15 Mins</strong></div>
                        <div>❓ <strong>3 Questions</strong></div>
                        <div>🎯 <strong>70% to Pass</strong></div>
                      </div>

                      <button
                        className="astryx-btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => openQuiz(c.id)}
                      >
                        🚀 {isPassed ? 'Retake Quiz' : 'Start Interactive Quiz'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ====================================================================
              5. ASSIGNMENTS
              ==================================================================== */}
          {currentPage === 'assignments' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--astryx-navy)', margin: 0 }}>
                  Practical Assignments & Capstones {assignmentsList.length > 0 && `(${assignmentsList.length})`}
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--astryx-text-muted)', margin: '4px 0 0' }}>
                  Complete production-grade coding projects and submit your GitHub repositories for automated and peer review.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  {
                    id: 'assign-py-1',
                    courseId: 'course-python-101',
                    title: 'Assignment 01: Object Oriented Student Record Architecture',
                    course: 'Python Programming Masterclass',
                    description: 'Design and implement a complete Student Record System using Python OOP. Implement classes for Student, Course, and GradeBook with JSON persistence and automated GPA computation.',
                    deadline: 'Open Submission',
                    rubric: 'Clean code style (PEP 8), modular unit tests, docstrings, and robust exception handling.'
                  },
                  {
                    id: 'assign-web-1',
                    courseId: 'course-web-dev',
                    title: 'Assignment 02: Full-Stack React & Node API Integration',
                    course: 'Complete Web Development Bootcamp',
                    description: 'Build a production-ready dashboard consuming REST endpoints with JWT authorization, responsive layout, and optimistic UI state management.',
                    deadline: 'Open Submission',
                    rubric: 'Component modularity, TypeScript types, CSS responsiveness, and error boundary handling.'
                  }
                ].map(item => {
                  const submissionStatus = assignmentSubmissions[item.id];
                  const isFormOpen = activeAssignmentSubmitId === item.id;
                  return (
                    <div key={item.id} className="astryx-card" style={{ padding: '28px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--astryx-primary)', textTransform: 'uppercase' }}>
                            {item.course}
                          </span>
                          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--astryx-navy)', margin: '4px 0 8px' }}>
                            {item.title}
                          </h3>
                        </div>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 700,
                          background: submissionStatus ? '#DCFCE7' : '#FEF3C7',
                          color: submissionStatus ? '#15803D' : '#B45309'
                        }}>
                          {submissionStatus || '⏳ Pending Submission'}
                        </span>
                      </div>

                      <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: '8px 0 14px' }}>
                        {item.description}
                      </p>

                      <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', fontSize: '12px', color: '#64748B', marginBottom: '16px', border: '1px solid #E2E8F0' }}>
                        📌 <strong>Evaluation Criteria:</strong> {item.rubric}
                      </div>

                      {/* Submission Form */}
                      {isFormOpen ? (
                        <div style={{ background: '#F1F5F9', padding: '20px', borderRadius: '10px', marginTop: '14px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '12px' }}>Submit Your Project Code</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                              <label style={{ fontSize: '12px', fontWeight: 700 }}>GitHub Repository URL *</label>
                              <input
                                type="url"
                                placeholder="https://github.com/username/project-repo"
                                value={githubRepoUrl}
                                onChange={e => setGithubRepoUrl(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '12px', fontWeight: 700 }}>Notes / Architecture Highlights</label>
                              <textarea
                                placeholder="Briefly describe key challenges solved, setup instructions, or extra features..."
                                value={assignmentNotes}
                                onChange={e => setAssignmentNotes(e.target.value)}
                                style={{ width: '100%', height: '80px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
                              />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button
                                className="astryx-btn-primary"
                                onClick={() => handleSubmitAssignment(item.id, item.courseId)}
                              >
                                🚀 Confirm Submission
                              </button>
                              <button
                                className="astryx-btn-secondary"
                                onClick={() => setActiveAssignmentSubmitId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button
                            className="astryx-btn-primary"
                            style={{ fontSize: '13px', padding: '8px 18px' }}
                            onClick={() => {
                              setActiveAssignmentSubmitId(item.id);
                              setGithubRepoUrl('');
                            }}
                          >
                            {submissionStatus ? '🔄 Resubmit Solution' : '📤 Submit Solution (GitHub)'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ====================================================================
              6. CERTIFICATES
              ==================================================================== */}
          {currentPage === 'certificates' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--astryx-navy)', margin: 0 }}>
                    Verified Credentials & Certificates
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--astryx-text-muted)', margin: '4px 0 0' }}>
                    Authentic A4 Landscape certificates with cryptographic verification and security guilloche pattern.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
                {myCoursesList.length > 0 ? (
                  myCoursesList.map((item, idx) => {
                    const certId = item.enrollment.certificateId || item.course.id;
                    const certSerial = item.enrollment.certificateId && item.enrollment.certificateId.startsWith('NXA')
                      ? item.enrollment.certificateId
                      : `LMS-2026-${item.course.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase()}-984${idx + 1}`;

                    return (
                      <div key={item.course.id} className="astryx-card" style={{ padding: '28px', border: '2px solid #E2E8F0', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '32px' }}>🏆</div>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#D97706', background: '#FEF3C7', padding: '3px 8px', borderRadius: '4px' }}>
                          OFFICIAL ACCREDITATION
                        </span>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--astryx-navy)', margin: '10px 0 6px' }}>
                          {item.course.title}
                        </h3>
                        <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '6px' }}>
                          Awarded to: <strong style={{ color: 'var(--astryx-navy)' }}>{currentUser?.name || 'Rahim Ahmed'}</strong>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px' }}>
                          Instructor: <strong>{item.course.instructor.name}</strong> • Duration: <strong>{item.course.duration}</strong>
                        </div>

                        <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '20px' }}>
                          <div>Serial ID: <strong style={{ fontFamily: 'monospace', color: 'var(--astryx-primary)' }}>{certSerial}</strong></div>
                          <div>Grade: <strong style={{ color: '#16A34A' }}>Distinction (98%)</strong></div>
                          <div>Format: <strong style={{ color: '#1E40AF' }}>A4 Landscape (300 DPI Cryptographic)</strong></div>
                        </div>

                        <button
                          className="astryx-btn-primary"
                          style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)' }}
                          onClick={() => handleViewCertificate(certId, item.course)}
                        >
                          🏆 View Official Certificate
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="astryx-card" style={{ padding: '28px', border: '2px solid #E2E8F0', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '32px' }}>🏆</div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#D97706', background: '#FEF3C7', padding: '3px 8px', borderRadius: '4px' }}>
                      SAMPLE OFFICIAL ACCREDITATION
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--astryx-navy)', margin: '10px 0 6px' }}>
                      {courses[0]?.title || 'Python Programming Masterclass'}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '6px' }}>
                      Awarded to: <strong style={{ color: 'var(--astryx-navy)' }}>{currentUser?.name || 'Rahim Ahmed'}</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px' }}>
                      Instructor: <strong>{courses[0]?.instructor?.name || 'Dr. Tariqul Islam'}</strong>
                    </div>

                    <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '20px' }}>
                      <div>Serial ID: <strong style={{ fontFamily: 'monospace', color: 'var(--astryx-primary)' }}>LMS-2026-PY10-VERIFIED</strong></div>
                      <div>Grade: <strong style={{ color: '#16A34A' }}>Distinction (98%)</strong></div>
                      <div>Format: <strong style={{ color: '#1E40AF' }}>A4 Landscape (300 DPI Cryptographic)</strong></div>
                    </div>

                    <button
                      className="astryx-btn-primary"
                      style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)' }}
                      onClick={() => handleViewCertificate(courses[0]?.id || 'course-python-101', courses[0])}
                    >
                      🏆 View Official Certificate
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====================================================================
              7. CART & CHECKOUT
              ==================================================================== */}
          {currentPage === 'cart' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--astryx-navy)', margin: 0 }}>
                  Order Checkout & Payment
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--astryx-text-muted)', margin: '4px 0 0' }}>
                  Review order details, apply AI discount coupons, and complete enrollment.
                </p>
              </div>

              {(() => {
                const targetCourse = checkoutCourse || courses[0];
                if (!targetCourse) return <div>No course selected.</div>;
                const rawPrice = targetCourse.price;
                const discountAmt = appliedCoupon ? Math.round((rawPrice * appliedCoupon.discount) / 100) : 0;
                const payable = rawPrice - discountAmt;

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px' }}>
                    {/* Left Column: Details & Payment Methods */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="astryx-card" style={{ padding: '24px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '14px' }}>Item in Cart</h4>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <img
                            src={targetCourse.thumbnail}
                            alt={targetCourse.title}
                            style={{ width: '100px', height: '70px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                          <div>
                            <h4 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>{targetCourse.title}</h4>
                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                              Instructor: {targetCourse.instructor.name} • {targetCourse.level}
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--astryx-navy)', marginTop: '6px' }}>
                              ৳{targetCourse.price.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method Selector */}
                      <div className="astryx-card" style={{ padding: '24px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '14px' }}>Choose Payment Gateway</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                          {[
                            { id: 'bkash', icon: '📱', label: 'bKash Wallet' },
                            { id: 'card', icon: '💳', label: 'Debit / Card' },
                            { id: 'nagad', icon: '🚀', label: 'Nagad Wallet' }
                          ].map(pm => (
                            <button
                              key={pm.id}
                              onClick={() => setSelectedPaymentMethod(pm.id as any)}
                              style={{
                                padding: '14px 10px',
                                borderRadius: '10px',
                                border: selectedPaymentMethod === pm.id ? '2px solid var(--astryx-primary)' : '1px solid #E2E8F0',
                                background: selectedPaymentMethod === pm.id ? '#EFF6FF' : '#FFFFFF',
                                cursor: 'pointer',
                                textAlign: 'center'
                              }}
                            >
                              <div style={{ fontSize: '22px', marginBottom: '4px' }}>{pm.icon}</div>
                              <div style={{ fontSize: '12px', fontWeight: 700 }}>{pm.label}</div>
                            </button>
                          ))}
                        </div>

                        {/* DEVELOPMENT STAGE PAYMENT STATUS SELECTOR */}
                        <div style={{
                          background: '#F8FAFC',
                          border: '2px dashed #94A3B8',
                          borderRadius: '10px',
                          padding: '16px',
                          marginTop: '16px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '18px' }}>⚙️</span>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--astryx-navy)' }}>
                              Development Stage Payment Status Selector:
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 12px' }}>
                            Click to simulate the payment gateway response for testing:
                          </p>

                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {[
                              { id: 'completed', label: '✓ Completed / Paid (Instant Access)', bg: '#DCFCE7', color: '#15803D', border: '#86EFAC' },
                              { id: 'pending', label: '⏳ Pending Verification (Review Flow)', bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' },
                              { id: 'failed', label: '✕ Failed (Declined / Cancelled)', bg: '#FEE2E2', color: '#DC2626', border: '#FCA5A5' }
                            ].map(item => {
                              const isSelected = devPaymentStatus === item.id;
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => setDevPaymentStatus(item.id as any)}
                                  style={{
                                    padding: '8px 14px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    border: isSelected ? `2px solid ${item.color}` : `1px solid ${item.border}`,
                                    background: isSelected ? item.bg : '#FFFFFF',
                                    color: item.color,
                                    boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
                                  }}
                                >
                                  {item.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Order Summary & Coupon */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="astryx-card" style={{ padding: '24px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>AI Promo Voucher</h4>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                          <input
                            type="text"
                            placeholder="Enter coupon code..."
                            value={couponCodeInput}
                            onChange={e => setCouponCodeInput(e.target.value.toUpperCase())}
                            style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                          />
                          <button
                            className="astryx-btn-primary"
                            style={{ padding: '10px 16px', fontSize: '13px' }}
                            onClick={() => handleApplyCustomCoupon(couponCodeInput)}
                          >
                            Apply
                          </button>
                        </div>

                        {appliedCoupon && (
                          <div style={{ padding: '8px 12px', background: '#DCFCE7', borderRadius: '6px', color: '#15803D', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>
                            ✓ Code "{appliedCoupon.code}" applied! ({appliedCoupon.discount}% discount)
                          </div>
                        )}

                        <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '8px' }}>Quick AI Promo Codes:</div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                          {['AI-SUPER-20', 'STUDENT-PRO-15', 'FLASH-AI-10'].map(code => (
                            <button
                              key={code}
                              type="button"
                              onClick={() => {
                                setCouponCodeInput(code);
                                handleApplyCustomCoupon(code);
                              }}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                border: '1px solid #CBD5E1',
                                background: '#F8FAFC',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                color: 'var(--astryx-primary)'
                              }}
                            >
                              ⚡ {code}
                            </button>
                          ))}
                        </div>

                        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Tuition Fee:</span>
                            <strong>৳{rawPrice.toLocaleString()}</strong>
                          </div>
                          {appliedCoupon && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A' }}>
                              <span>AI Discount ({appliedCoupon.discount}%):</span>
                              <strong>-৳{discountAmt.toLocaleString()}</strong>
                            </div>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Platform & Gateway Fee:</span>
                            <strong style={{ color: '#16A34A' }}>FREE</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 900, borderTop: '2px solid #E2E8F0', paddingTop: '12px', color: 'var(--astryx-navy)' }}>
                            <span>Payable Total:</span>
                            <span style={{ color: 'var(--astryx-primary)' }}>৳{payable.toLocaleString()}</span>
                          </div>
                        </div>

                        <button
                          className="astryx-btn-primary"
                          style={{
                            width: '100%',
                            justifyContent: 'center',
                            marginTop: '20px',
                            padding: '14px',
                            fontSize: '15px',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
                          }}
                          onClick={handleConfirmCheckout}
                          disabled={isSubmittingCheckout}
                        >
                          {isSubmittingCheckout ? 'Processing...' : `Confirm Payment ৳${payable.toLocaleString()} & Enroll`}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ====================================================================
              8. PROFILE & SETTINGS
              ==================================================================== */}
          {currentPage === 'profile' && (
            <div className="astryx-card" style={{ padding: '36px', maxWidth: '720px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', borderBottom: '1px solid #E2E8F0', paddingBottom: '20px' }}>
                <div style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  color: '#FFFFFF'
                }}>
                  👨‍🎓
                </div>
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--astryx-navy)', margin: 0 }}>
                    {currentUser?.name || 'Student Profile'}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    Role: <strong style={{ color: 'var(--astryx-primary)' }}>{currentUser?.role.toUpperCase() || 'STUDENT'}</strong> • Status: <strong style={{ color: '#16A34A' }}>Verified Learner</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Full Legal Name</label>
                  <input
                    type="text"
                    value={editProfileName}
                    onChange={e => setEditProfileName(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '6px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Contact Phone Number</label>
                  <input
                    type="text"
                    placeholder="+880 1XXXXXXXXX"
                    value={editProfilePhone}
                    onChange={e => setEditProfilePhone(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '6px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Primary Learning Goal</label>
                  <input
                    type="text"
                    placeholder="e.g. Become an Industry-Ready Full Stack & AI Engineer"
                    value={editProfileGoal}
                    onChange={e => setEditProfileGoal(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '6px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Student Bio & Achievements</label>
                  <textarea
                    placeholder="e.g. Preparing for a full-time Full-Stack Engineer role and mastering Generative AI workflows."
                    value={editProfileBio}
                    onChange={e => setEditProfileBio(e.target.value)}
                    style={{ width: '100%', height: '90px', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '6px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Registered Email Address</label>
                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    readOnly
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: '6px', fontSize: '14px', background: '#F8FAFC', color: '#64748B' }}
                  />
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>Email address cannot be modified directly for security reasons.</span>
                </div>

                {profileSaveMsg && (
                  <div style={{ padding: '10px 14px', background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '8px', color: '#15803D', fontSize: '13px', fontWeight: 700 }}>
                    ✓ {profileSaveMsg}
                  </div>
                )}

                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px', marginTop: '10px' }}>
                  <button
                    className="astryx-btn-primary"
                    style={{ padding: '12px 28px', fontSize: '14px' }}
                    onClick={handleSaveProfile}
                  >
                    💾 Save Profile Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ====================================================================
          PAGE SUITE 3: AI PAGES (THE KILLER FEATURE)
          ==================================================================== */}
      {currentSuite === 'ai' && (
        <main
          style={{
            flex: 1,
            padding: currentPage === 'ai-assistant' ? '12px 20px' : '20px',
            height: currentPage === 'ai-assistant' ? 'calc(100vh - 120px)' : undefined,
            maxHeight: currentPage === 'ai-assistant' ? 'calc(100vh - 120px)' : undefined,
            overflow: currentPage === 'ai-assistant' ? 'hidden' : undefined,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {currentPage === 'ai-assistant' && (
            <div className="aui-chat-container">
              {/* =========================================================
                  ASSISTANT-UI SESSION & CHAT HISTORY SIDEBAR
                  ========================================================= */}
              <div className="aui-sidebar">
                <div className="aui-sidebar-header">
                  <button
                    className="aui-new-chat-btn"
                    onClick={handleCreateNewChat}
                    title="Start a new conversation (Alt+N)"
                  >
                    <span>✨</span>
                    <span>+ New Chat</span>
                  </button>

                  <div className="aui-search-box">
                    <span className="aui-search-icon">🔍</span>
                    <input
                      type="text"
                      className="aui-search-input"
                      placeholder="Search chat history..."
                      value={sessionSearchQuery}
                      onChange={e => setSessionSearchQuery(e.target.value)}
                    />
                    {sessionSearchQuery && (
                      <button
                        onClick={() => setSessionSearchQuery('')}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#94A3B8',
                          fontSize: '12px'
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Session Threads List */}
                <div className="aui-sessions-list">
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', padding: '6px 4px 2px', letterSpacing: '0.05em' }}>
                    Past Conversations ({sessions.length})
                  </div>

                  {sessions
                    .filter(s => {
                      if (!sessionSearchQuery.trim()) return true;
                      const q = sessionSearchQuery.toLowerCase();
                      return (
                        s.title.toLowerCase().includes(q) ||
                        s.messages.some(m => m.text.toLowerCase().includes(q))
                      );
                    })
                    .map(session => {
                      const isActive = session.id === currentSessionId;
                      const msgCount = session.messages.filter(m => m.sender === 'user').length;
                      const dateLabel = new Date(session.updatedAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric'
                      });

                      return (
                        <div
                          key={session.id}
                          className={`aui-session-item ${isActive ? 'active' : ''}`}
                          onClick={() => handleSelectSession(session.id)}
                        >
                          <div style={{ overflow: 'hidden', flex: 1 }}>
                            <div className="aui-session-title">
                              {session.title || 'New Conversation'}
                            </div>
                            <div className="aui-session-meta">
                              <span>📅 {dateLabel}</span>
                              <span>•</span>
                              <span>💬 {msgCount} prompt{msgCount === 1 ? '' : 's'}</span>
                            </div>
                          </div>

                          <button
                            className="aui-delete-session-btn"
                            title="Delete conversation"
                            onClick={(e) => handleDeleteSession(session.id, e)}
                          >
                            🗑️
                          </button>
                        </div>
                      );
                    })}

                  {sessions.filter(s => !sessionSearchQuery || s.title.toLowerCase().includes(sessionSearchQuery.toLowerCase())).length === 0 && (
                    <div style={{ padding: '24px 12px', textAlign: 'center', color: '#94A3B8', fontSize: '12px' }}>
                      No conversations found matching "{sessionSearchQuery}"
                    </div>
                  )}
                </div>

                {/* AI Sub-Mode Selector */}
                <div style={{ padding: '12px 16px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                    Assistant Specialist Mode
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    {[
                      { id: 'tutor', label: '🎓 General Tutor' },
                      { id: 'course-assistant', label: '📖 Lesson Grounded' },
                      { id: 'roadmap', label: '🗺️ 6-Mo Roadmap' },
                      { id: 'planner', label: '📅 Study Planner' }
                    ].map(m => (
                      <button
                        key={m.id}
                        className={`astryx-subnav-link ${aiSubMode === m.id ? 'active' : ''}`}
                        onClick={() => setAiSubMode(m.id as any)}
                        style={{ textAlign: 'center', padding: '6px 8px', fontSize: '11px', borderRadius: '6px', whiteSpace: 'nowrap' }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Engine Telemetry Card with 15s Speed Guard */}
                <div className="aui-sidebar-footer">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>DEFAULT PRIMARY</span>
                    <span style={{ fontSize: '10px', background: '#DCFCE7', color: '#16A34A', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      ⚡ 15s Guard
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: activeLiveModel !== primaryModel ? '#D97706' : '#1D4ED8', wordBreak: 'break-all' }}>
                    {activeLiveModel.split('/').pop()}
                  </div>
                  {activeLiveModel !== primaryModel && (
                    <div style={{ fontSize: '10px', color: '#B45309', fontWeight: 700, marginTop: '2px' }}>
                      🛡️ Failover Switched Engine
                    </div>
                  )}
                  <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px' }}>
                    10-Model NVIDIA NIM failover chain online
                  </div>
                </div>
              </div>

              {/* =========================================================
                  ASSISTANT-UI THREAD MAIN VIEW
                  ========================================================= */}
              <div className="aui-thread-main">
                {/* Assistant-UI Thread Header */}
                <div className="aui-thread-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '18px' }}>💬</div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                        {currentSession?.title || 'New Conversation'}
                      </h4>
                      <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>Mode: <strong>{aiSubMode}</strong></span>
                        <span>•</span>
                        <span>Model: <strong>{activeLiveModel.split('/').pop()}</strong></span>
                        {activeLiveModel !== primaryModel && (
                          <span style={{ color: '#D97706', fontWeight: 700 }}>[Failover Active]</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      className="aui-action-btn"
                      onClick={handleCreateNewChat}
                      title="Start fresh conversation"
                    >
                      ✨ New
                    </button>
                    <button
                      className="aui-action-btn"
                      onClick={handleClearCurrentThread}
                      title="Clear messages in this session"
                    >
                      🧹 Clear
                    </button>
                  </div>
                </div>

                {/* PUBLIC SALES VS PRIVATE STUDENT AI TOGGLE STRIP */}
                <div style={{
                  padding: '10px 16px',
                  background: 'linear-gradient(90deg, #F8FAFC 0%, #F1F5F9 100%)',
                  borderBottom: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {!currentUser ? (
                      <button
                        onClick={() => {
                          setAiAccessMode('public-sales');
                          setChatInput('');
                        }}
                        style={{
                          padding: '6px 14px',
                          fontSize: '12px',
                          fontWeight: 800,
                          borderRadius: '20px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          border: '2px solid #2563EB',
                          background: '#EFF6FF',
                          color: '#1D4ED8',
                          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>🌐 Public AI: Course Sales & Advisor</span>
                        <span style={{ fontSize: '10px', background: '#10B981', color: '#FFFFFF', padding: '1px 6px', borderRadius: '10px', fontWeight: 800 }}>
                          FREE / NO LOGIN
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setAiAccessMode('private-student');
                          setChatInput('');
                        }}
                        style={{
                          padding: '6px 14px',
                          fontSize: '12px',
                          fontWeight: 800,
                          borderRadius: '20px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          border: '2px solid #7C3AED',
                          background: '#FAF5FF',
                          color: '#6D28D9',
                          boxShadow: '0 2px 8px rgba(124, 58, 237, 0.2)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>🎓 Private AI: Enrolled Student Mentor</span>
                        <span style={{ fontSize: '10px', background: '#7C3AED', color: '#FFFFFF', padding: '1px 6px', borderRadius: '10px', fontWeight: 800 }}>
                          CONNECTED
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Right: Active Mode Pill */}
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                    {!currentUser ? (
                      <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>🛡️</span> Guardrail: <strong>LearnAI Courses Only</strong> • 5-20% Coupon Engine Active
                      </span>
                    ) : (
                      <span style={{ color: '#7C3AED', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>👨‍🎓</span> Mode: <strong>1-on-1 Academic Coach & Progress Guide</strong>
                      </span>
                    )}
                    {!currentUser && claimedCoupons.length > 0 && (
                      <span style={{ fontSize: '10px', background: '#059669', color: '#FFFFFF', padding: '2px 8px', borderRadius: '12px', fontWeight: 700, marginLeft: '8px' }}>
                        🎟️ {claimedCoupons.length} Active Coupon(s)
                      </span>
                    )}
                  </div>
                </div>

                {/* MODE CONTEXT BANNER */}
                {!currentUser ? (
                  <div style={{
                    padding: '10px 18px',
                    background: 'linear-gradient(90deg, #F0FDF4 0%, #ECFDF5 50%, #F0F9FF 100%)',
                    borderBottom: '1px solid #A7F3D0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px',
                    fontSize: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>🎯</span>
                      <span style={{ color: '#065F46' }}>
                        <strong>Public Course Sales AI:</strong> আমাদের ১৫টি কোর্সের তথ্য, সেরা ক্যারিয়ার রিকমেন্ডেশন ও ৫%-২০% প্যাশন কুপন পেতে যেকোনো প্রশ্ন করুন!
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {[
                        'আমি ওয়েব ডেভেলপমেন্ট শিখতে চাই, কোন কোর্সটি নেব?',
                        'আমি খুব আগ্রহী, আমাকে একটি ডিসকাউন্ট কুপন দিন!',
                        'SQA Automation Testing কোর্সের বিস্তারিত বলো'
                      ].map((promptText, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => setChatInput(promptText)}
                          style={{
                            fontSize: '11px',
                            background: '#FFFFFF',
                            border: '1px solid #6EE7B7',
                            color: '#047857',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                        >
                          💡 {promptText.slice(0, 24)}...
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{
                      padding: '12px 18px',
                      background: 'linear-gradient(90deg, #FAF5FF 0%, #F3E8FF 100%)',
                      borderBottom: '1px solid #DDD6FE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                      fontSize: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #7C3AED' }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, color: '#5B21B6', fontSize: '13px' }}>
                            👨‍🎓 Student: {currentUser.name} ({currentUser.email})
                          </div>
                          <div style={{ color: '#6D28D9', fontSize: '11px' }}>
                            Enrolled in <strong>{myCoursesList.length}</strong> Course(s) • Focus: <strong>{activeCourse?.title || 'General Curriculum'}</strong> ({activeEnrollment?.progressPercent || 0}% Progress)
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {[
                          'আমার বর্তমান কোর্সের প্রগ্রেস দেখে পড়ার রুটিন দাও',
                          'পরবর্তী লেসনে যাওয়ার আগে কী প্র্যাকটিস করব?',
                          'এই কোর্স শেষে পরবর্তীতে কোন কোর্সটি নেওয়া উচিত?'
                        ].map((promptText, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => setChatInput(promptText)}
                            style={{
                              fontSize: '11px',
                              background: '#FFFFFF',
                              border: '1px solid #C4B5FD',
                              color: '#6D28D9',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                          >
                            📖 {promptText.slice(0, 24)}...
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* INTERACTIVE AI PASSION COUPON CARD (5% - 20%) */}
                {latestCouponOffer && (
                  <div style={{
                    margin: '10px 16px',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: latestCouponOffer.locked
                      ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
                      : 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)',
                    border: latestCouponOffer.locked
                      ? '2px dashed #F59E0B'
                      : '2px solid #10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '28px' }}>
                        {latestCouponOffer.locked ? '🔒' : '🎟️'}
                      </span>
                      <div>
                        <div style={{
                          fontWeight: 900,
                          fontSize: '14px',
                          color: latestCouponOffer.locked ? '#92400E' : '#065F46'
                        }}>
                          {latestCouponOffer.locked
                            ? `🎉 SPECIAL ${latestCouponOffer.discount}% AI PASSION DISCOUNT RESERVED FOR YOU!`
                            : `✅ ${latestCouponOffer.discount}% AI PASSION COUPON ACTIVATED ON YOUR ACCOUNT!`}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: latestCouponOffer.locked ? '#B45309' : '#047857',
                          marginTop: '2px'
                        }}>
                          {latestCouponOffer.locked ? (
                            <span>
                              কুপন কোড: <strong style={{ fontFamily: 'monospace', background: 'rgba(255,255,255,0.7)', padding: '1px 6px', borderRadius: '4px' }}>{latestCouponOffer.code}</strong> • এই টোকেনটি আনলক করতে এবং কোর্সে ১৫% ছাড়ে ভর্তি হতে <strong>Sign In বা Register</strong> করুন।
                            </span>
                          ) : (
                            <span>
                              কুপন কোড: <strong style={{ fontFamily: 'monospace', background: '#FFFFFF', padding: '1px 6px', borderRadius: '4px' }}>{latestCouponOffer.code}</strong> • আপনার অ্যাকাউন্টে সেভ করা হয়েছে। এখনই যেকোনো কোর্সে ভর্তি হওয়ার সময় ব্যবহার করুন!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {latestCouponOffer.locked ? (
                        <button
                          className="astryx-btn-primary"
                          style={{ fontSize: '12px', padding: '7px 14px', fontWeight: 800 }}
                          onClick={() => {
                            setAuthMode('login');
                            setShowAuthModal(true);
                          }}
                        >
                          🔑 Sign In to Claim {latestCouponOffer.discount}% Coupon
                        </button>
                      ) : (
                        <button
                          className="astryx-btn-magic"
                          style={{ fontSize: '12px', padding: '7px 14px', fontWeight: 800 }}
                          onClick={() => {
                            setCurrentSuite('public');
                            setCurrentPage('all-courses');
                          }}
                        >
                          ⚡ Browse Courses & Enroll
                        </button>
                      )}
                      <button
                        onClick={() => setLatestCouponOffer(null)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: '14px', padding: '4px' }}
                        title="Dismiss"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {/* Assistant-UI Thread Messages List */}
                <div className="aui-thread-messages">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`aui-message-wrapper ${msg.sender}`}>
                      <div className={`aui-avatar ${msg.sender}`}>
                        {msg.sender === 'user' ? '👤' : '🤖'}
                      </div>

                      {msg.sender === 'user' ? (
                        <div className="aui-bubble-user">
                          <div>{msg.text}</div>
                          {msg.timestamp && (
                            <div style={{ fontSize: '10px', color: '#94A3B8', textAlign: 'right', marginTop: '4px' }}>
                              {msg.timestamp}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="aui-bubble-ai">
                          <AIResponseFormatter
                            content={msg.text}
                            modelUsed={msg.modelUsed}
                            failoverOccurred={msg.failoverOccurred}
                            isStreaming={msg.isStreaming}
                            onQuickReply={(replyText) => {
                              setChatInput(replyText);
                            }}
                          />

                          {/* AI Recommended Course Cards */}
                          {(() => {
                            const recs = (msg.recommendedCourses && msg.recommendedCourses.length > 0)
                              ? msg.recommendedCourses
                              : (!msg.isStreaming ? detectRecommendedCourses(msg.text, courses) : []);
                            if (!recs || recs.length === 0) return null;

                            return (
                              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800, color: '#2563EB' }}>
                                  <span>⚡ AI RECOMMENDED COURSE</span>
                                  <span style={{ fontSize: '10px', background: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                                    Official Curriculum
                                  </span>
                                </div>

                                {recs.map(course => {
                                  // Calculate passion coupon discount if active
                                  const hasCoupon = latestCouponOffer && latestCouponOffer.discount > 0;
                                  const discountPercent = hasCoupon ? latestCouponOffer.discount : 0;
                                  const discountedPrice = hasCoupon
                                    ? Math.round(course.price * (1 - discountPercent / 100))
                                    : course.price;

                                  return (
                                    <div
                                      key={course.id}
                                      style={{
                                        background: '#FFFFFF',
                                        border: '2px solid #3B82F6',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        boxShadow: '0 8px 24px -4px rgba(59, 130, 246, 0.15)',
                                        display: 'flex',
                                        flexDirection: 'column'
                                      }}
                                    >
                                      {/* Card Thumbnail & Overlay Badges */}
                                      <div style={{ position: 'relative', height: '140px', width: '100%', overflow: 'hidden', backgroundColor: '#0F172A' }}>
                                        <img
                                          src={course.thumbnail}
                                          alt={course.title}
                                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div style={{
                                          position: 'absolute',
                                          top: '10px',
                                          left: '10px',
                                          display: 'flex',
                                          gap: '6px'
                                        }}>
                                          <span style={{
                                            background: 'rgba(15, 23, 42, 0.85)',
                                            color: '#FFFFFF',
                                            padding: '3px 8px',
                                            borderRadius: '6px',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            backdropFilter: 'blur(4px)'
                                          }}>
                                            {course.category}
                                          </span>
                                          <span style={{
                                            background: 'rgba(37, 99, 235, 0.9)',
                                            color: '#FFFFFF',
                                            padding: '3px 8px',
                                            borderRadius: '6px',
                                            fontSize: '11px',
                                            fontWeight: 700
                                          }}>
                                            {course.level}
                                          </span>
                                        </div>

                                        {hasCoupon && (
                                          <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                            color: '#FFFFFF',
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                            fontSize: '11px',
                                            fontWeight: 800,
                                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                                          }}>
                                            🔥 {discountPercent}% OFF WITH PASSION COUPON
                                          </div>
                                        )}
                                      </div>

                                      {/* Card Body */}
                                      <div style={{ padding: '16px' }}>
                                        <h4 style={{
                                          fontSize: '16px',
                                          fontWeight: 800,
                                          color: '#0F172A',
                                          margin: '0 0 8px',
                                          lineHeight: 1.35
                                        }}>
                                          {course.title}
                                        </h4>

                                        {/* Instructor & Rating Row */}
                                        <div style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          fontSize: '12px',
                                          marginBottom: '10px'
                                        }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <img
                                              src={course.instructor.avatar}
                                              alt={course.instructor.name}
                                              style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                            <span style={{ fontWeight: 700, color: '#334155' }}>{course.instructor.name}</span>
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D97706', fontWeight: 700 }}>
                                            ⭐ {course.rating} <span style={{ color: '#94A3B8', fontWeight: 500 }}>({course.studentsCount?.toLocaleString() || '1,000'}+ learners)</span>
                                          </div>
                                        </div>

                                        {/* Meta Row (Duration & Lessons) */}
                                        <div style={{
                                          display: 'flex',
                                          gap: '12px',
                                          fontSize: '12px',
                                          color: '#475569',
                                          padding: '8px 12px',
                                          background: '#F8FAFC',
                                          borderRadius: '8px',
                                          border: '1px solid #E2E8F0',
                                          marginBottom: '12px'
                                        }}>
                                          <span>⏱️ <strong>{course.duration}</strong></span>
                                          <span>📚 <strong>{course.lessonsCount} Lessons</strong></span>
                                          <span>📜 <strong>Certificate Included</strong></span>
                                        </div>

                                        {/* Pricing Section */}
                                        <div style={{
                                          display: 'flex',
                                          alignItems: 'baseline',
                                          gap: '8px',
                                          marginBottom: '12px'
                                        }}>
                                          {hasCoupon ? (
                                            <>
                                              <span style={{ fontSize: '20px', fontWeight: 900, color: '#059669' }}>
                                                ৳{discountedPrice.toLocaleString()}
                                              </span>
                                              <span style={{ fontSize: '13px', textDecoration: 'line-through', color: '#94A3B8' }}>
                                                ৳{course.price.toLocaleString()}
                                              </span>
                                              <span style={{
                                                fontSize: '11px',
                                                fontWeight: 800,
                                                background: '#ECFDF5',
                                                color: '#059669',
                                                padding: '2px 6px',
                                                borderRadius: '4px'
                                              }}>
                                                Save ৳{(course.price - discountedPrice).toLocaleString()}
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <span style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A' }}>
                                                ৳{course.price.toLocaleString()}
                                              </span>
                                              {course.originalPrice > course.price && (
                                                <span style={{ fontSize: '13px', textDecoration: 'line-through', color: '#94A3B8' }}>
                                                  ৳{course.originalPrice.toLocaleString()}
                                                </span>
                                              )}
                                            </>
                                          )}
                                        </div>

                                        {/* Locked Coupon Alert if guest */}
                                        {latestCouponOffer && latestCouponOffer.locked && (
                                          <div style={{
                                            background: '#FEF3C7',
                                            border: '1px dashed #F59E0B',
                                            borderRadius: '8px',
                                            padding: '8px 12px',
                                            fontSize: '11px',
                                            color: '#92400E',
                                            marginBottom: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                          }}>
                                            <span>🔒 Sign in to unlock {latestCouponOffer.discount}% OFF code <strong>{latestCouponOffer.code}</strong></span>
                                            <button
                                              onClick={() => {
                                                setAuthMode('login');
                                                setAuthStep('form');
                                                setShowAuthModal(true);
                                              }}
                                              style={{
                                                background: '#F59E0B',
                                                color: '#FFFFFF',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '3px 8px',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                cursor: 'pointer'
                                              }}
                                            >
                                              Sign In
                                            </button>
                                          </div>
                                        )}

                                        {/* Action Buttons: View Details & Enroll Now */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '8px' }}>
                                          <button
                                            onClick={() => {
                                              setActiveCourse(course);
                                              setCurrentSuite('public');
                                              setCurrentPage('course-details');
                                            }}
                                            className="astryx-btn-secondary"
                                            style={{
                                              padding: '8px 12px',
                                              fontSize: '12px',
                                              justifyContent: 'center',
                                              fontWeight: 700
                                            }}
                                          >
                                            📖 View Details
                                          </button>
                                          {(() => {
                                            const isEnrolled = myCoursesList.some(m => m.course.id === course.id);
                                            return (
                                              <button
                                                onClick={() => {
                                                  if (isEnrolled) {
                                                    openClassroom(course);
                                                  } else if (!currentUser) {
                                                    setAuthMode('login');
                                                    setAuthStep('form');
                                                    setShowAuthModal(true);
                                                  } else {
                                                    openCheckout(course);
                                                  }
                                                }}
                                                className="astryx-btn-primary"
                                                style={{
                                                  padding: '8px 12px',
                                                  fontSize: '12px',
                                                  justifyContent: 'center',
                                                  fontWeight: 800,
                                                  background: isEnrolled
                                                    ? 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)'
                                                    : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
                                                }}
                                              >
                                                {isEnrolled ? '▶ Continue' : '🚀 Enroll Now'}
                                              </button>
                                            );
                                          })()}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}

                          {/* Assistant-UI Action Bar */}
                          <div className="aui-action-bar">
                            <button
                              className="aui-action-btn"
                              onClick={() => handleCopyMessage(msg.text, i)}
                              title="Copy response to clipboard"
                            >
                              {copiedMsgIdx === i ? '✓ Copied!' : '📋 Copy'}
                            </button>

                            <button
                              className="aui-action-btn"
                              onClick={() => handleRegenerate()}
                              disabled={isAiLoading}
                              title="Regenerate response"
                            >
                              🔄 Retry
                            </button>

                            <button
                              className={`aui-action-btn ${feedbackState[`${currentSessionId}_${i}`] === 'like' ? 'active' : ''}`}
                              onClick={() => handleToggleFeedback(i, 'like')}
                              title="Helpful"
                            >
                              👍
                            </button>

                            <button
                              className={`aui-action-btn ${feedbackState[`${currentSessionId}_${i}`] === 'dislike' ? 'active' : ''}`}
                              onClick={() => handleToggleFeedback(i, 'dislike')}
                              title="Not helpful"
                            >
                              👎
                            </button>

                            {msg.responseTimeSec !== undefined && (
                              <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                                ⚡ {msg.responseTimeSec}s {msg.responseTimeSec < 15 ? '(<15s)' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {isAiLoading && (
                    <div style={{ alignSelf: 'flex-start', width: '100%', maxWidth: '560px' }}>
                      <AIThinkingProgress modelName={activeLiveModel} />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Assistant-UI Composer Bar */}
                <div className="aui-composer-bar">
                  {/* Prompt Suggestions Chips */}
                  <div className="aui-prompt-chips">
                    {[
                      { icon: '📅', text: 'Create a weekly study planner for me' },
                      { icon: '🐍', text: 'Explain Python functions & closures with examples' },
                      { icon: '🗺️', text: 'Generate a 6-month career roadmap for web development' },
                      { icon: '🧠', text: 'Give me 5 practice interview questions on React' }
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        className="aui-chip-btn"
                        onClick={() => {
                          setChatInput(chip.text);
                        }}
                      >
                        {chip.icon} {chip.text}
                      </button>
                    ))}
                  </div>

                  {/* Multi-line Composer Box */}
                  <div className="aui-composer-box">
                    <textarea
                      className="aui-composer-textarea"
                      placeholder="Ask any programming, concept, or curriculum query... (Enter to send, Shift+Enter for new line)"
                      value={chatInput}
                      rows={1}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendChatMessage();
                        }
                      }}
                    />
                    <button
                      id="aui-send-button"
                      className="aui-send-btn"
                      onClick={handleSendChatMessage}
                      disabled={isAiLoading || !chatInput.trim()}
                    >
                      {isAiLoading ? (
                        <span>Thinking...</span>
                      ) : (
                        <>
                          <span>Send</span>
                          <span>↵</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. 6-MONTH ROADMAP */}
          {currentPage === 'ai-roadmap' && (
            <div className="astryx-card" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>🗺️ 6-Month Junior Full-Stack Developer Roadmap</h3>
              <p style={{ color: 'var(--astryx-text-muted)', fontSize: '13px', marginBottom: '24px' }}>AI-generated milestone curriculum tailored for academic diploma students.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { month: 'Month 01', title: 'HTML5, CSS3 & Responsive UI Design', hours: '10 hrs/wk', desc: 'Master layout semantics, flexbox, CSS grid, and modern web styling.' },
                  { month: 'Month 02', title: 'Modern JavaScript (ES6+) & DOM Manipulation', hours: '12 hrs/wk', desc: 'Async/await, Promises, closures, array methods, and API integration.' },
                  { month: 'Month 03', title: 'React & Meta Astryx Component Architecture', hours: '14 hrs/wk', desc: 'Component lifecycle, state management, hooks, and clean SaaS dashboards.' },
                  { month: 'Month 04', title: 'Backend APIs with Node.js & Next.js App Router', hours: '12 hrs/wk', desc: 'REST architecture, middleware, JWT authentication, and secure routes.' },
                  { month: 'Month 05', title: 'Database Design & NVIDIA NIM AI Integration', hours: '12 hrs/wk', desc: 'PostgreSQL/SQLite schemas, prompt engineering, and LLM endpoint orchestration.' },
                  { month: 'Month 06', title: 'Capstone Diploma Project & Production CI/CD', hours: '15 hrs/wk', desc: 'Full-stack deployment, automated test suites, presentation preparation.' }
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--astryx-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, color: 'var(--astryx-primary)', fontSize: '12px' }}>{item.month}</span>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>{item.hours}</span>
                    </div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--astryx-navy)' }}>{item.title}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', marginTop: '4px' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. 10-MODEL TELEMETRY VIEW */}
          {currentPage === 'ai-models-view' && (
            <div className="astryx-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>🤖 10 Verified NVIDIA NIM AI Models Catalog</h3>
              <p style={{ fontSize: '13px', color: 'var(--astryx-text-muted)', marginBottom: '20px' }}>
                Primary Model: <strong>{primaryModel}</strong> • Rate limit monitor active (40 RPM limit) with automatic 30s cooldown failover.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {availableModels.map((m, idx) => (
                  <div key={m.id} style={{ padding: '16px', background: m.id === primaryModel ? 'var(--astryx-primary-light)' : '#F8FAFC', borderRadius: '10px', border: m.id === primaryModel ? '2px solid var(--astryx-primary)' : '1px solid var(--astryx-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '13px' }}>#{idx + 1} {m.name}</span>
                      {m.id === primaryModel && <span style={{ fontSize: '10px', background: 'var(--astryx-primary)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>PRIMARY</span>}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--astryx-primary)', margin: '4px 0' }}>{m.category} {m.supportsThinking ? '• 🧠 Thinking' : ''}</div>
                    <div style={{ fontSize: '12px', color: 'var(--astryx-text-muted)' }}>{m.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      )}

      {/* ====================================================================
          PAGE SUITE 4: INSTRUCTOR PAGES
          ==================================================================== */}
      {currentSuite === 'instructor' && (
        <main style={{ flex: 1, padding: '28px 24px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--astryx-navy)' }}>Instructor Studio: Dr. Tariqul Islam</h2>
              <p style={{ fontSize: '13px', color: 'var(--astryx-text-muted)' }}>Manage your courses, curriculum video assets, and student evaluations.</p>
            </div>
            <button className="astryx-btn-primary" onClick={() => setShowNewCourseModal(true)}>
              + Create New Course
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
            <div className="astryx-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', fontWeight: 700 }}>TOTAL STUDENTS</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--astryx-navy)', marginTop: '4px' }}>9,680</div>
            </div>
            <div className="astryx-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', fontWeight: 700 }}>COURSE RATING</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>⭐ 4.9 / 5.0</div>
            </div>
            <div className="astryx-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', fontWeight: 700 }}>MONTHLY EARNINGS</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--astryx-success)', marginTop: '4px' }}>৳425,000</div>
            </div>
          </div>

          <div className="astryx-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px' }}>My Active Curriculum Courses</h3>
            <table className="astryx-table">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Category</th>
                  <th>Students</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700 }}>{c.title}</td>
                    <td>{c.category}</td>
                    <td>{c.studentsCount.toLocaleString()}</td>
                    <td>৳{c.price}</td>
                    <td><span style={{ background: '#DCFCE7', color: '#16A34A', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>Published</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      )}

      {/* ====================================================================
          PAGE SUITE 5: ADMIN PAGES
          ==================================================================== */}
      {currentSuite === 'admin' && (
        <main style={{ flex: 1, padding: '28px 24px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--astryx-navy)' }}>LearnAI Platform Administration</h2>
            <p style={{ fontSize: '13px', color: 'var(--astryx-text-muted)' }}>Global system operations, 10-model AI controller, and user management.</p>
          </div>

          {/* Admin KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
            <div className="astryx-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', fontWeight: 700 }}>TOTAL PLATFORM REVENUE</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--astryx-navy)', marginTop: '4px' }}>{adminStats?.totalRevenue || '৳11,796,320'}</div>
            </div>
            <div className="astryx-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', fontWeight: 700 }}>ACTIVE LEARNERS</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--astryx-navy)', marginTop: '4px' }}>{adminStats?.totalStudents || '9,680'}</div>
            </div>
            <div className="astryx-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', fontWeight: 700 }}>AI TOTAL CALLS</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--astryx-primary)', marginTop: '4px' }}>{adminStats?.aiStats?.totalCalls || 18}</div>
            </div>
            <div className="astryx-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', fontWeight: 700 }}>NVIDIA RPM QUOTA</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: currentRpm > 30 ? '#EF4444' : 'var(--astryx-success)', marginTop: '4px' }}>
                {currentRpm} / 40 RPM
              </div>
            </div>
          </div>

          {/* 10-Model AI Controller Card */}
          <div className="astryx-card" style={{ padding: '28px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--astryx-navy)' }}>10-Model AI Engine Controller</h3>
                <p style={{ fontSize: '12px', color: 'var(--astryx-text-muted)' }}>
                  Active Primary: <strong>{primaryModel}</strong> • Automated failover to secondary models upon rate limits or latency.
                </p>
              </div>

              <select
                value={primaryModel}
                onChange={e => handleSetPrimaryModel(e.target.value)}
                style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--astryx-border)', fontSize: '13px', minWidth: '320px' }}
              >
                {availableModels.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.supportsThinking ? '🧠 ' : ''}{m.name} [{m.category}]
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              {availableModels.map((m, idx) => {
                const isActive = m.id === primaryModel;
                return (
                  <div
                    key={m.id}
                    onClick={() => handleSetPrimaryModel(m.id)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: isActive ? '2px solid var(--astryx-primary)' : '1px solid var(--astryx-border-light)',
                      background: isActive ? 'var(--astryx-primary-light)' : '#F8FAFC',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>#{idx + 1} {m.name}</span>
                      {isActive && <span style={{ fontSize: '9px', background: 'var(--astryx-primary)', color: 'white', padding: '1px 5px', borderRadius: '3px' }}>PRIMARY</span>}
                    </div>
                    <div style={{ color: 'var(--astryx-text-muted)', fontSize: '11px', marginTop: '3px' }}>{m.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {/* ====================================================================
          MODAL 1: COURSE DETAILS & ENROLLMENT
          ==================================================================== */}
      {showCourseDetailModal && activeCourse && (
        <div className="astryx-modal-overlay" onClick={() => setShowCourseDetailModal(false)}>
          <div className="astryx-modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--astryx-primary)', textTransform: 'uppercase' }}>
                  {activeCourse.category} • {activeCourse.level}
                </span>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--astryx-navy)', marginTop: '4px' }}>{activeCourse.title}</h2>
              </div>
              <button onClick={() => setShowCourseDetailModal(false)} style={{ fontSize: '20px' }}>✕</button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--astryx-text-muted)', marginBottom: '16px', lineHeight: 1.7 }}>
              {activeCourse.description}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Learning Outcomes:</h4>
              <ul style={{ fontSize: '13px', paddingLeft: '18px', lineHeight: 1.8 }}>
                {activeCourse.learningOutcomes.map((item, idx) => (
                  <li key={idx}>✓ {item}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--astryx-border)', paddingTop: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Total Tuition:</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--astryx-navy)' }}>৳{activeCourse.price}</div>
              </div>
              {(() => {
                const isEnrolled = myCoursesList.some(m => m.course.id === activeCourse.id);
                return (
                  <button
                    className="astryx-btn-primary"
                    style={{
                      padding: '12px 28px',
                      fontSize: '14px',
                      background: isEnrolled ? 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)' : undefined
                    }}
                    onClick={() => {
                      setShowCourseDetailModal(false);
                      if (isEnrolled) {
                        openClassroom(activeCourse);
                      } else {
                        openCheckout(activeCourse);
                      }
                    }}
                  >
                    {isEnrolled ? '▶ Continue Learning' : '🚀 Enroll in Course'}
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: INTERACTIVE QUIZ
          ==================================================================== */}
      {showQuizModal && quizData && (
        <div className="astryx-modal-overlay" onClick={() => setShowQuizModal(false)}>
          <div className="astryx-modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{quizData.title}</h3>
              <button onClick={() => setShowQuizModal(false)}>✕</button>
            </div>

            {!quizResult ? (
              <div>
                <p style={{ fontSize: '13px', color: 'var(--astryx-text-muted)', marginBottom: '16px' }}>
                  Passing Score: <strong>{quizData.passingScore}%</strong>
                </p>
                {quizData.questions.map((q, idx) => (
                  <div key={q.id} style={{ marginBottom: '16px', padding: '12px', background: '#F8FAFC', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '8px' }}>{idx + 1}. {q.question}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {q.options.map((opt, optIdx) => (
                        <label key={optIdx} style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name={`quiz_${q.id}`}
                            checked={quizAnswers[q.id] === optIdx}
                            onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="astryx-btn-primary" style={{ width: '100%' }} onClick={handleSubmitQuiz}>
                  Submit Answers
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: '40px' }}>{quizResult.passed ? '🎉' : '📚'}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{quizResult.passed ? 'Passed with Distinction!' : 'Keep Learning'}</h3>
                <div style={{ fontSize: '18px', fontWeight: 800, color: quizResult.passed ? 'var(--astryx-success)' : 'var(--astryx-danger)', margin: '8px 0' }}>
                  Score: {quizResult.scorePercent}%
                </div>
                <button className="astryx-btn-primary" style={{ marginTop: '14px' }} onClick={() => setShowQuizModal(false)}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2.5: COURSE CHECKOUT & ENROLLMENT MODAL
          ==================================================================== */}
      {showCheckoutModal && checkoutCourse && (
        <div className="astryx-modal-overlay" onClick={() => setShowCheckoutModal(false)}>
          <div
            className="astryx-modal-box"
            style={{ maxWidth: '640px', width: '95%', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: '#FFFFFF'
                }}>
                  🛒
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--astryx-navy)', margin: 0 }}>
                    Course Checkout & Enrollment
                  </h3>
                  <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700 }}>
                    🔒 SSL 256-bit Encrypted Checkout • Instant Access
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                style={{ fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            {/* Course Summary Pill */}
            <div style={{
              display: 'flex',
              gap: '14px',
              alignItems: 'center',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '20px'
            }}>
              <img
                src={checkoutCourse.thumbnail}
                alt={checkoutCourse.title}
                style={{ width: '80px', height: '56px', borderRadius: '6px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--astryx-navy)', margin: 0 }}>
                  {checkoutCourse.title}
                </h4>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                  Instructor: <strong>{checkoutCourse.instructor.name}</strong> • {checkoutCourse.level}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '17px', fontWeight: 900, color: 'var(--astryx-navy)' }}>
                  ৳{checkoutCourse.price.toLocaleString()}
                </div>
                {checkoutCourse.originalPrice > checkoutCourse.price && (
                  <div style={{ fontSize: '11px', color: '#94A3B8', textDecoration: 'line-through' }}>
                    ৳{checkoutCourse.originalPrice.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* AI Smart Voucher Coupon */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                AI Promo Coupon / Voucher:
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter promo coupon code..."
                  value={couponCodeInput}
                  onChange={e => setCouponCodeInput(e.target.value.toUpperCase())}
                  style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                />
                <button
                  type="button"
                  className="astryx-btn-primary"
                  style={{ padding: '9px 16px', fontSize: '12px' }}
                  onClick={() => handleApplyCustomCoupon(couponCodeInput)}
                >
                  Apply Code
                </button>
              </div>

              {appliedCoupon && (
                <div style={{ padding: '6px 10px', background: '#DCFCE7', borderRadius: '6px', color: '#15803D', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
                  ✓ Voucher "{appliedCoupon.code}" applied! {appliedCoupon.discount}% discount granted.
                </div>
              )}

              {couponError && (
                <div style={{ padding: '6px 10px', background: '#FEE2E2', borderRadius: '6px', color: '#DC2626', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
                  ✕ {couponError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Quick AI Promo Codes:</span>
                {['AI-SUPER-20', 'STUDENT-PRO-15', 'FLASH-AI-10'].map(code => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setCouponCodeInput(code);
                      handleApplyCustomCoupon(code);
                    }}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '5px',
                      border: '1px solid #CBD5E1',
                      background: '#F1F5F9',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: 'var(--astryx-primary)'
                    }}
                  >
                    ⚡ {code}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Gateway Options */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                Select Payment Method:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {[
                  { id: 'bkash', icon: '📱', label: 'bKash Wallet' },
                  { id: 'card', icon: '💳', label: 'Debit / Card' },
                  { id: 'nagad', icon: '🚀', label: 'Nagad Wallet' }
                ].map(pm => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setSelectedPaymentMethod(pm.id as any)}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '8px',
                      border: selectedPaymentMethod === pm.id ? '2px solid var(--astryx-primary)' : '1px solid #E2E8F0',
                      background: selectedPaymentMethod === pm.id ? '#EFF6FF' : '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '2px' }}>{pm.icon}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700 }}>{pm.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* CRITICAL: DEVELOPMENT STAGE PAYMENT STATUS SELECTOR */}
            <div style={{
              background: '#F8FAFC',
              border: '2px dashed #94A3B8',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '16px' }}>⚙️</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--astryx-navy)' }}>
                  Development Stage Payment Status Selector:
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#64748B', margin: '0 0 10px' }}>
                Select the simulated response of payment gateway for testing:
              </p>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'completed', label: '✓ Completed / Paid (Instant Enrollment)', bg: '#DCFCE7', color: '#15803D', border: '#86EFAC' },
                  { id: 'pending', label: '⏳ Pending Verification (Simulate Manual Review)', bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' },
                  { id: 'failed', label: '✕ Failed (Simulate Card Decline)', bg: '#FEE2E2', color: '#DC2626', border: '#FCA5A5' }
                ].map(item => {
                  const isSelected = devPaymentStatus === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDevPaymentStatus(item.id as any)}
                      style={{
                        flex: 1,
                        padding: '7px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: isSelected ? `2px solid ${item.color}` : `1px solid ${item.border}`,
                        background: isSelected ? item.bg : '#FFFFFF',
                        color: item.color,
                        textAlign: 'center',
                        boxShadow: isSelected ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Breakdown */}
            {(() => {
              const rawPrice = checkoutCourse.price;
              const discountAmt = appliedCoupon ? Math.round((rawPrice * appliedCoupon.discount) / 100) : 0;
              const payable = rawPrice - discountAmt;
              return (
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Tuition Fee:</span>
                    <strong>৳{rawPrice.toLocaleString()}</strong>
                  </div>
                  {appliedCoupon && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A' }}>
                      <span>AI Voucher ({appliedCoupon.discount}%):</span>
                      <strong>-৳{discountAmt.toLocaleString()}</strong>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 900, borderTop: '2px solid #E2E8F0', paddingTop: '10px', color: 'var(--astryx-navy)' }}>
                    <span>Total Amount:</span>
                    <span style={{ color: 'var(--astryx-primary)' }}>৳{payable.toLocaleString()}</span>
                  </div>
                </div>
              );
            })()}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="astryx-btn-secondary"
                style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
                onClick={() => setShowCheckoutModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="astryx-btn-primary"
                style={{
                  flex: 2,
                  justifyContent: 'center',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
                }}
                onClick={handleConfirmCheckout}
                disabled={isSubmittingCheckout}
              >
                {isSubmittingCheckout ? 'Processing...' : 'Confirm & Enroll Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 3: CERTIFICATE VIEW (ENTERPRISE A4 LANDSCAPE TEMPLATE)
          ==================================================================== */}
      {showCertModal && activeCert && (
        <CertificateModal
          certificate={activeCert}
          onClose={() => setShowCertModal(false)}
          platformName="LEARNAI ACADEMY"
        />
      )}

      {/* ====================================================================
          MODAL 4: AI COURSE FINDER (AI STUDIO EXPERIENCE)
          ==================================================================== */}
      {showAiFinderModal && (
        <div className="astryx-modal-overlay" onClick={() => setShowAiFinderModal(false)}>
          <div
            className="astryx-modal-box"
            style={{ maxWidth: '640px', width: '95%', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: '#FFFFFF'
                }}>
                  🎯
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--astryx-navy)', margin: 0 }}>
                    AI Course Finder Studio
                  </h3>
                  <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>
                    ⚡ Powered by Public AI Sales Engine • Free Access
                  </div>
                </div>
              </div>
              <button onClick={() => setShowAiFinderModal(false)} style={{ fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '12px',
              color: '#1E40AF',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <span>
                💡 আপনার ব্যাকগ্রাউন্ড বা ক্যারিয়ার গোল বলুন। AI তাৎক্ষণিক আমাদের ১৫টি প্রিমিয়াম কোর্সের ভেতর সেরা কোর্স এবং ৫%–২০% স্পেশাল ডিসকাউন্ট কুপন দেবে!
              </span>
              <button
                className="astryx-btn-magic"
                style={{ fontSize: '11px', padding: '6px 12px', whiteSpace: 'nowrap' }}
                onClick={() => {
                  setShowAiFinderModal(false);
                  setAiAccessMode(currentUser ? 'private-student' : 'public-sales');
                  setAiSubMode('recommendation');
                  handleNavigateSuite('ai', 'ai-assistant');
                }}
              >
                🚀 Open Full Studio
              </button>
            </div>

            {/* Quick Goals Chips */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '8px' }}>
                পপুলার ক্যারিয়ার লক্ষ্যসমূহ (১-ক্লিকে সিলেক্ট করুন):
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  { label: '🧪 SQA Automation Testing', q: 'আমি Software Quality Assurance এবং Automation Testing শিখতে চাই।' },
                  { label: '💻 MERN Ecommerce Dev', q: 'আমি React এবং Node.js দিয়ে Full Stack Ecommerce প্রজেক্ট শিখতে চাই।' },
                  { label: '🤖 AI Agent & Python', q: 'আমি Python দিয়ে autonomous AI Agent তৈরি শিখতে চাই।' },
                  { label: '☁️ Docker & DevOps', q: 'আমি Docker ও Kubernetes দিয়ে DevOps শিখতে আগ্রহী।' },
                  { label: '🎨 UI/UX Figma Design', q: 'আমি Professional UI/UX Product Design শিখতে চাই।' }
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    style={{
                      background: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1E293B',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => {
                      setShowAiFinderModal(false);
                      setAiAccessMode(currentUser ? 'private-student' : 'public-sales');
                      setAiSubMode('recommendation');
                      setChatInput(chip.q);
                      handleNavigateSuite('ai', 'ai-assistant');
                      setTimeout(() => {
                        handleSendChatMessage();
                      }, 400);
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Query Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                অথবা আপনার নিজস্ব প্রশ্ন বা লক্ষ্য লিখুন:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="যেমন: আমি একদম নতুন, কোন কোর্স দিয়ে কোডিং শুরু করব?"
                  id="customAiFinderInput"
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px'
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value;
                      if (val.trim()) {
                        setShowAiFinderModal(false);
                        setAiAccessMode(currentUser ? 'private-student' : 'public-sales');
                        setAiSubMode('recommendation');
                        setChatInput(val.trim());
                        handleNavigateSuite('ai', 'ai-assistant');
                        setTimeout(() => {
                          handleSendChatMessage();
                        }, 400);
                      }
                    }
                  }}
                />
                <button
                  className="astryx-btn-primary"
                  style={{ padding: '10px 18px', fontWeight: 700, fontSize: '13px' }}
                  onClick={() => {
                    const el = document.getElementById('customAiFinderInput') as HTMLInputElement;
                    const val = el?.value || '';
                    if (val.trim()) {
                      setShowAiFinderModal(false);
                      setAiAccessMode(currentUser ? 'private-student' : 'public-sales');
                      setAiSubMode('recommendation');
                      setChatInput(val.trim());
                      handleNavigateSuite('ai', 'ai-assistant');
                      setTimeout(() => {
                        handleSendChatMessage();
                      }, 400);
                    }
                  }}
                >
                  খুঁজুন 🚀
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 5: AUTH MODAL (LOGIN, STUDENT & TUTOR REGISTRATION, OTP & 2FA)
          ==================================================================== */}
      {showAuthModal && (
        <div className="astryx-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div
            className="astryx-modal-box"
            style={{ maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--astryx-navy)' }}>
                  {authStep === 'form'
                    ? authMode === 'login'
                      ? '🔐 Sign In to LearnAI'
                      : authMode === 'register-student'
                      ? '🎓 Student Registration'
                      : '👨‍🏫 Tutor / Instructor Registration'
                    : authStep === 'otp'
                    ? '📱 Step 1/2: Verification Code (OTP)'
                    : authStep === '2fa'
                    ? '🛡️ Step 2/2: Two-Factor Authentication (2FA)'
                    : '🎉 Authentication Successful'}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--astryx-text-muted)', marginTop: '2px' }}>
                  {authStep === 'form'
                    ? 'Secure multi-role access with Email/SMS OTP & 2FA protection'
                    : authStep === 'otp'
                    ? `Enter the code sent to your ${otpDeliveryMethod.toUpperCase()}`
                    : authStep === '2fa'
                    ? 'Enter the 6-digit token from your authenticator application'
                    : 'You are being redirected to your role-authorized workspace'}
                </p>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                style={{ fontSize: '18px', color: '#64748B', padding: '4px 8px', borderRadius: '6px' }}
              >
                ✕
              </button>
            </div>

            {/* Step Progress Indicators */}
            {authStep !== 'success' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <div style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  background: authStep === 'form' ? 'var(--astryx-primary)' : 'var(--astryx-success)'
                }} />
                <div style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  background: authStep === 'otp' ? 'var(--astryx-primary)' : (authStep === '2fa' ? 'var(--astryx-success)' : '#E2E8F0')
                }} />
                <div style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  background: authStep === '2fa' ? 'var(--astryx-primary)' : '#E2E8F0'
                }} />
              </div>
            )}

            {/* Error Notification Alert */}
            {authError && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>⚠️</span>
                <span>{authError}</span>
              </div>
            )}

            {/* Success Notification Alert */}
            {authSuccessMsg && (
              <div style={{
                background: '#F0FDF4',
                border: '1px solid #86EFAC',
                color: '#166534',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>✅</span>
                <span>{authSuccessMsg}</span>
              </div>
            )}

            {/* ==============================================================
                STEP 1: CREDENTIALS FORM OR 1-CLICK DEMO USERS
                ============================================================== */}
            {authStep === 'form' && (
              <div>
                {/* 3 DEMO ACCOUNTS QUICK-LOGIN SECTION */}
                <div style={{
                  background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
                  border: '1px solid #DBEAFE',
                  borderRadius: '12px',
                  padding: '14px',
                  marginBottom: '18px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--astryx-primary)', letterSpacing: '0.5px' }}>
                      ⚡ 3 DEMO ACCOUNTS (1-CLICK & 2FA DEMO)
                    </span>
                    <span style={{ fontSize: '10px', color: '#64748B' }}>Instant Role Testing</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                    {/* Demo 1: Student Rahim */}
                    <div style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#1E293B' }}>🎓 Student</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Rahim Ahmed</div>
                        <div style={{ fontSize: '10px', color: '#94A3B8' }}>student@learnai.com</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                        <button
                          disabled={isAuthLoading}
                          onClick={() => handleDemoQuickLogin('student', false)}
                          style={{
                            background: '#2563EB',
                            color: '#FFFFFF',
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '5px 8px',
                            borderRadius: '4px',
                            width: '100%'
                          }}
                        >
                          ⚡ 1-Click Login
                        </button>
                        <button
                          disabled={isAuthLoading}
                          onClick={() => handleDemoQuickLogin('student', true)}
                          style={{
                            background: '#EFF6FF',
                            color: '#2563EB',
                            border: '1px solid #BFDBFE',
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '4px 8px',
                            borderRadius: '4px',
                            width: '100%'
                          }}
                        >
                          🛡️ Test OTP & 2FA
                        </button>
                      </div>
                    </div>

                    {/* Demo 2: Instructor Dr. Tariqul */}
                    <div style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#1E293B' }}>👨‍🏫 Instructor / Tutor</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Dr. Tariqul Islam</div>
                        <div style={{ fontSize: '10px', color: '#94A3B8' }}>instructor@learnai.com</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                        <button
                          disabled={isAuthLoading}
                          onClick={() => handleDemoQuickLogin('instructor', false)}
                          style={{
                            background: '#0D9488',
                            color: '#FFFFFF',
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '5px 8px',
                            borderRadius: '4px',
                            width: '100%'
                          }}
                        >
                          ⚡ 1-Click Login
                        </button>
                        <button
                          disabled={isAuthLoading}
                          onClick={() => handleDemoQuickLogin('instructor', true)}
                          style={{
                            background: '#F0FDFA',
                            color: '#0D9488',
                            border: '1px solid #99F6E4',
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '4px 8px',
                            borderRadius: '4px',
                            width: '100%'
                          }}
                        >
                          🛡️ Test OTP & 2FA
                        </button>
                      </div>
                    </div>

                    {/* Demo 3: Admin */}
                    <div style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#1E293B' }}>⚙️ Admin</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>System Admin</div>
                        <div style={{ fontSize: '10px', color: '#94A3B8' }}>admin@learnai.com</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                        <button
                          disabled={isAuthLoading}
                          onClick={() => handleDemoQuickLogin('admin', false)}
                          style={{
                            background: '#7C3AED',
                            color: '#FFFFFF',
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '5px 8px',
                            borderRadius: '4px',
                            width: '100%'
                          }}
                        >
                          ⚡ 1-Click Login
                        </button>
                        <button
                          disabled={isAuthLoading}
                          onClick={() => handleDemoQuickLogin('admin', true)}
                          style={{
                            background: '#FAF5FF',
                            color: '#7C3AED',
                            border: '1px solid #E9D5FF',
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '4px 8px',
                            borderRadius: '4px',
                            width: '100%'
                          }}
                        >
                          🛡️ Test OTP & 2FA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DIVIDER */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                    Or Sign In / Register Below
                  </span>
                  <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                </div>

                {/* AUTH MODE SELECTOR TABS */}
                <div style={{ display: 'flex', gap: '6px', background: '#F1F5F9', padding: '4px', borderRadius: '8px', marginBottom: '14px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setAuthEmail('student@learnai.com');
                    }}
                    style={{
                      flex: 1,
                      padding: '7px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: authMode === 'login' ? '#FFFFFF' : 'transparent',
                      color: authMode === 'login' ? 'var(--astryx-primary)' : '#64748B',
                      boxShadow: authMode === 'login' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    🔐 Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register-student');
                      setAuthEmail('');
                    }}
                    style={{
                      flex: 1,
                      padding: '7px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: authMode === 'register-student' ? '#FFFFFF' : 'transparent',
                      color: authMode === 'register-student' ? 'var(--astryx-primary)' : '#64748B',
                      boxShadow: authMode === 'register-student' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    🎓 Student Register
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register-tutor');
                      setAuthEmail('');
                    }}
                    style={{
                      flex: 1,
                      padding: '7px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: authMode === 'register-tutor' ? '#FFFFFF' : 'transparent',
                      color: authMode === 'register-tutor' ? 'var(--astryx-primary)' : '#64748B',
                      boxShadow: authMode === 'register-tutor' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    👨‍🏫 Tutor Register
                  </button>
                </div>

                {/* FORM INPUTS */}
                <form onSubmit={handleSubmitAuthForm} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Name field (for registration) */}
                  {(authMode === 'register-student' || authMode === 'register-tutor') && (
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        {authMode === 'register-tutor' ? 'Instructor / Tutor Full Name' : 'Student Full Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={authMode === 'register-tutor' ? 'e.g. Dr. Sabrina Akhter' : 'e.g. Tanvir Hasan'}
                        value={authName}
                        onChange={e => setAuthName(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
                      />
                    </div>
                  )}

                  {/* Phone field (for SMS OTP support) */}
                  {(authMode === 'register-student' || authMode === 'register-tutor') && (
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Mobile Phone (for SMS OTP) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+880 1711-223344"
                        value={authPhone}
                        onChange={e => setAuthPhone(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
                      />
                    </div>
                  )}

                  {/* Tutor specific fields */}
                  {authMode === 'register-tutor' && (
                    <>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                          Domain Expertise / Subject Area *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Machine Learning, Python, Full-Stack MERN"
                          value={authExpertise}
                          onChange={e => setAuthExpertise(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                          Teaching Bio / Experience *
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Tell students about your academic background and teaching style..."
                          value={authBio}
                          onChange={e => setAuthBio(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '12px' }}
                        />
                      </div>
                    </>
                  )}

                  {/* Email field */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={authEmail}
                      onChange={e => setAuthEmail(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
                    />
                  </div>

                  {/* Password field */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={e => setAuthPassword(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
                    />
                  </div>

                  {/* OTP DELIVERY CHANNEL SELECTION (Email or SMS) */}
                  <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>
                      SECURITY VERIFICATION CHANNEL FOR OTP:
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600, color: '#1E293B' }}>
                        <input
                          type="radio"
                          name="otpChannel"
                          checked={otpDeliveryMethod === 'email'}
                          onChange={() => setOtpDeliveryMethod('email')}
                        />
                        📧 Email OTP
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600, color: '#1E293B' }}>
                        <input
                          type="radio"
                          name="otpChannel"
                          checked={otpDeliveryMethod === 'sms'}
                          onChange={() => setOtpDeliveryMethod('sms')}
                        />
                        📱 SMS OTP
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isAuthLoading}
                    className="astryx-btn-primary"
                    style={{
                      justifyContent: 'center',
                      padding: '11px',
                      fontSize: '13px',
                      fontWeight: 700,
                      marginTop: '6px'
                    }}
                  >
                    {isAuthLoading ? 'Processing Request...' : authMode === 'login' ? 'Sign In & Request OTP →' : 'Register & Verify Security Code →'}
                  </button>
                </form>
              </div>
            )}

            {/* ==============================================================
                STEP 2: OTP VERIFICATION (WITH DEV SIMULATOR ALERT)
                ============================================================== */}
            {authStep === 'otp' && (
              <div>
                {/* PROMINENT VISUAL ALERT FOR DEVELOPMENT ENVIRONMENT (Requested by user) */}
                <div style={{
                  background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                  border: '2px dashed #22C55E',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '18px',
                  boxShadow: '0 4px 10px rgba(34, 197, 94, 0.12)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803D', fontWeight: 800, fontSize: '12px' }}>
                      <span>🔔</span>
                      <span>[DEV SIMULATOR] ONE-TIME PASSWORD DISPATCHED</span>
                    </div>
                    <span style={{
                      background: '#15803D',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}>
                      {otpDeliveryMethod.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#166534', marginTop: '6px' }}>
                    Code dispatched to <strong>{targetContactMasked || authEmail}</strong>:
                  </div>

                  {/* High-visibility code display */}
                  <div style={{
                    fontSize: '28px',
                    fontWeight: 900,
                    letterSpacing: '8px',
                    color: '#15803D',
                    textAlign: 'center',
                    background: '#FFFFFF',
                    border: '1px solid #86EFAC',
                    borderRadius: '8px',
                    padding: '8px',
                    margin: '10px 0 6px',
                    fontFamily: 'monospace'
                  }}>
                    {simulatedDevOtp || '123456'}
                  </div>

                  <div style={{ fontSize: '11px', color: '#15803D', textAlign: 'center' }}>
                    💡 <em>In development mode, the OTP is shown above. Master bypass code: <code>123456</code>.</em>
                  </div>
                </div>

                {/* OTP Delivery switch / resend buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '11px' }}>
                  <span style={{ color: '#64748B' }}>Didn't receive code?</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      disabled={isAuthLoading}
                      onClick={() => handleResendOtp('email')}
                      style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'underline' }}
                    >
                      Resend to Email
                    </button>
                    <span style={{ color: '#CBD5E1' }}>•</span>
                    <button
                      type="button"
                      disabled={isAuthLoading}
                      onClick={() => handleResendOtp('sms')}
                      style={{ color: '#0D9488', fontWeight: 700, textDecoration: 'underline' }}
                    >
                      Resend via SMS
                    </button>
                  </div>
                </div>

                {/* 6-Digit OTP Input */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    placeholder="• • • • • •"
                    value={otpInput}
                    onChange={e => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleVerifyOtp();
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid var(--astryx-primary)',
                      textAlign: 'center',
                      fontSize: '24px',
                      letterSpacing: '8px',
                      fontFamily: 'monospace',
                      marginTop: '6px',
                      background: '#F8FAFC'
                    }}
                  />
                </div>

                {/* OTP Action buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setAuthStep('form')}
                    className="astryx-btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '12px' }}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    disabled={isAuthLoading || otpInput.length < 6}
                    onClick={handleVerifyOtp}
                    className="astryx-btn-primary"
                    style={{ flex: 2, justifyContent: 'center', padding: '10px', fontSize: '13px', fontWeight: 700 }}
                  >
                    {isAuthLoading ? 'Verifying...' : 'Verify OTP & Continue to 2FA →'}
                  </button>
                </div>
              </div>
            )}

            {/* ==============================================================
                STEP 3: TWO-FACTOR AUTHENTICATION (2FA)
                ============================================================== */}
            {authStep === '2fa' && (
              <div>
                {/* SAMPLE 2FA BOX (Requested by user) */}
                <div style={{
                  background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
                  border: '2px dashed #A855F7',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '18px',
                  boxShadow: '0 4px 10px rgba(168, 85, 247, 0.12)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7E22CE', fontWeight: 800, fontSize: '12px' }}>
                    <span>🛡️</span>
                    <span>TWO-FACTOR AUTHENTICATION (2FA) CHALLENGE</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6B21A8', marginTop: '6px' }}>
                    Open your Authenticator app (Google Authenticator, Microsoft Authenticator, or Duo) and enter your 6-digit security token.
                  </p>
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #D8B4FE',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    marginTop: '8px',
                    fontSize: '11px',
                    color: '#7E22CE'
                  }}>
                    💡 <strong>Development Sample Hint:</strong> Enter <code>123456</code> or any 6 digits to verify.
                  </div>
                </div>

                {/* 2FA Input */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    Enter 6-Digit Authenticator Token
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    placeholder="123456"
                    value={twoFactorInput}
                    onChange={e => setTwoFactorInput(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleVerify2fa();
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #9333EA',
                      textAlign: 'center',
                      fontSize: '24px',
                      letterSpacing: '8px',
                      fontFamily: 'monospace',
                      marginTop: '6px',
                      background: '#FAF5FF'
                    }}
                  />
                </div>

                {/* 2FA Action buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setAuthStep('otp')}
                    className="astryx-btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '12px' }}
                  >
                    ← Back to OTP
                  </button>
                  <button
                    type="button"
                    disabled={isAuthLoading || twoFactorInput.length < 6}
                    onClick={handleVerify2fa}
                    className="astryx-btn-primary"
                    style={{
                      flex: 2,
                      justifyContent: 'center',
                      padding: '10px',
                      fontSize: '13px',
                      fontWeight: 700,
                      background: '#7C3AED',
                      borderColor: '#7C3AED'
                    }}
                  >
                    {isAuthLoading ? 'Authenticating...' : 'Verify 2FA & Access Dashboard 🚀'}
                  </button>
                </div>
              </div>
            )}

            {/* ==============================================================
                STEP 4: AUTHENTICATION SUCCESS
                ============================================================== */}
            {authStep === 'success' && (
              <div style={{ textAlign: 'center', padding: '24px 10px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: '#DCFCE7',
                  color: '#16A34A',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  margin: '0 auto 16px'
                }}>
                  ✓
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--astryx-navy)' }}>
                  Authentication Verified!
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--astryx-text-muted)', marginTop: '4px' }}>
                  Welcome back, <strong>{currentUser?.name}</strong>! Your <strong>{currentUser?.role?.toUpperCase()}</strong> role permissions are activated.
                </p>
                <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--astryx-primary)', fontWeight: 600 }}>
                  Loading your dashboard...
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 6: CREATE COURSE (INSTRUCTOR/ADMIN)
          ==================================================================== */}
      {showNewCourseModal && (
        <div className="astryx-modal-overlay" onClick={() => setShowNewCourseModal(false)}>
          <div className="astryx-modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Create New Course</h3>
              <button onClick={() => setShowNewCourseModal(false)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="Course Title"
                value={newCourseTitle}
                onChange={e => setNewCourseTitle(e.target.value)}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--astryx-border)' }}
              />
              <textarea
                placeholder="Course Description"
                value={newCourseDesc}
                onChange={e => setNewCourseDesc(e.target.value)}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--astryx-border)', height: '80px' }}
              />
              <input
                type="number"
                placeholder="Tuition Price (৳)"
                value={newCoursePrice}
                onChange={e => setNewCoursePrice(e.target.value)}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--astryx-border)' }}
              />
              <button
                className="astryx-btn-primary"
                onClick={async () => {
                  if (!newCourseTitle) return;
                  await fetch(`${API_BASE}/courses`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: newCourseTitle, description: newCourseDesc, price: newCoursePrice })
                  });
                  setShowNewCourseModal(false);
                  fetchInitialData();
                }}
              >
                Publish Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Model Change / Failover Alert Toast */}
      {modelChangeNotification && (
        <ModelChangeAlert
          modelName={modelChangeNotification.model}
          isFailover={modelChangeNotification.isFailover}
          isAutoPromoted={modelChangeNotification.isAutoPromoted}
          durationSeconds={modelChangeNotification.durationSeconds}
          onClose={() => setModelChangeNotification(null)}
        />
      )}
    </div>
  );
}
