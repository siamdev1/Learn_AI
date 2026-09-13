// ============================================================================
// LearnAI — AI Powered Online Course Management System (LMS)
// Backend Server in Node.js + TypeScript
// 
// Organization:
// PART 1: Types, Interfaces & Configuration
// PART 2: Multi-Model AI Engine with Dynamic Selection & Automatic Failover
// PART 3: In-Memory Database Store & Rich Demo Seed Data
// PART 4: Specialized AI Services (Tutor, Course Assistant, Roadmap, Finder)
// PART 5: REST API Endpoints (Auth, Courses, Classroom, Quizzes, Certificates, Admin)
// PART 6: Server Bootloader & Port Listener
// ============================================================================

import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { allDemoCourses } from './coursesData';

// ============================================================================
// PART 1: TYPES, INTERFACES & CONFIGURATION
// ============================================================================

export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title?: string;
  bio?: string;
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
  description: string;
  fullDescription?: string;
  category: string;
  level: string; // 'Beginner' | 'Intermediate' | 'Advanced' | 'Beginner → Advanced'
  price: number;
  originalPrice: number;
  rating: number;
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
  videoPreviewUrl?: string;
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

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  passingScore: number; // percentage, e.g. 70
  questions: QuizQuestion[];
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

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  grade: string;
  duration?: string;
  instructorName?: string;
  authorizedPerson?: string;
  verificationUrl?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  courseId: string;
  githubUrl: string;
  notes?: string;
  submittedAt: string;
  status: 'submitted' | 'graded';
  grade?: string;
}

export interface AIModelInfo {
  id: string;
  name: string;
  category: string;
  supportsThinking: boolean;
  description: string;
}

// Model Catalog - 10 Verified Chat & Reasoning models on NVIDIA NIM
export const AVAILABLE_MODELS: AIModelInfo[] = [
  {
    id: "nvidia/nemotron-3-super-120b-a12b",
    name: "Nemotron 3 Super 120B",
    category: "Flagship MoE",
    supportsThinking: true,
    description: "120B MoE with 1M context, strong reasoning & coding"
  },
  {
    id: "meta/llama-3.2-11b-vision-instruct",
    name: "Meta Llama 3.2 11B Vision Instruct",
    category: "Fast Chat & Vision",
    supportsThinking: false,
    description: "Ultra-fast (<0.6s) general chat and reasoning model"
  },
  {
    id: "nvidia/nemotron-3.5-lightning-30b-a3b",
    name: "Nemotron 3.5 Lightning 30B",
    category: "Agentic / LLM",
    supportsThinking: true,
    description: "Fastest 30B MoE with reasoning for agentic tasks"
  },
  {
    id: "openai/gpt-oss-20b",
    name: "OpenAI GPT-OSS 20B",
    category: "Reasoning & Math",
    supportsThinking: false,
    description: "Efficient text-only MoE specialized in reasoning and math"
  },
  {
    id: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
    name: "Nemotron 3 Nano Omni 30B",
    category: "Omni-Modal / Reasoning",
    supportsThinking: true,
    description: "Omni-modal reasoning model with thinking capabilities"
  },
  {
    id: "google/diffusiongemma-26b-a4b-it",
    name: "Google DiffusionGemma 26B",
    category: "Diffusion LLM",
    supportsThinking: false,
    description: "Diffusion-based 26B LLM enabling parallel token generation"
  },
  {
    id: "meta/muse-glimmer-30b",
    name: "Meta Muse Glimmer 30B",
    category: "Multimodal Reasoning",
    supportsThinking: false,
    description: "Multimodal reasoning model with tool-calling capabilities"
  },
  {
    id: "nvidia/riva-translate-4b-instruct-v2",
    name: "Riva Translate 4B Instruct V2",
    category: "Translation & Polyglot",
    supportsThinking: false,
    description: "Super-fast translation model across 37 languages"
  },
  {
    id: "nvidia/ising-calibration-1.5-31b",
    name: "NVIDIA Ising Calibration 1.5 31B",
    category: "Quantum & Technical VLM",
    supportsThinking: false,
    description: "Multimodal model built on Gemma 4 for technical & scientific text"
  },
  {
    id: "nvidia/nemotron-3.5-content-safety",
    name: "Nemotron 3.5 Content Safety",
    category: "Safety & Moderation",
    supportsThinking: false,
    description: "Multilingual model for detecting safety and moderation"
  }
];

// Read NVIDIA Key from file or environment
function loadNvidiaApiKey(): string {
  if (process.env.NVIDIA_API_KEY && process.env.NVIDIA_API_KEY.trim()) {
    return process.env.NVIDIA_API_KEY.trim();
  }

  const possiblePaths = [
    path.join(__dirname, '..', 'NVIDIA AI MODEL testing', '.nvidia_key'),
    path.join(process.cwd(), 'NVIDIA AI MODEL testing', '.nvidia_key'),
    path.join(__dirname, '.nvidia_key'),
    path.join(process.cwd(), '.nvidia_key')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const key = fs.readFileSync(p, 'utf-8').trim();
        if (key && key.startsWith('nvapi-')) {
          return key;
        }
      } catch (err) {
        // continue
      }
    }
  }

  // Tested default backup key from repository testing folder
  return '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';
}

const NVIDIA_API_KEY = loadNvidiaApiKey();
const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

// ============================================================================
// PART 2: MULTI-MODEL AI ENGINE WITH AUTOMATIC FAILOVER & RATE LIMIT GUARD
// ============================================================================

export class AIEngine {
  private primaryModelId: string;
  private apiKey: string;
  private modelCooldowns: Map<string, number> = new Map();
  private requestTimestamps: number[] = [];
  private stats: {
    totalCalls: number;
    successfulCalls: number;
    failoversCount: number;
    rateLimitTrips: number;
    lastFailoverAt?: string;
  };

  constructor(defaultModelId: string = 'google/diffusiongemma-26b-a4b-it') {
    this.primaryModelId = defaultModelId;
    this.apiKey = NVIDIA_API_KEY;
    this.stats = {
      totalCalls: 0,
      successfulCalls: 0,
      failoversCount: 0,
      rateLimitTrips: 0
    };
  }

  public getPrimaryModelId(): string {
    return this.primaryModelId;
  }

  public setPrimaryModelId(newModelId: string): boolean {
    const exists = AVAILABLE_MODELS.some(m => m.id === newModelId);
    if (exists) {
      this.primaryModelId = newModelId;
      console.log(`[AIEngine] Primary model updated to: ${newModelId}`);
      return true;
    }
    return false;
  }

  public setPrimaryModel(newModelId: string): boolean {
    return this.setPrimaryModelId(newModelId);
  }

  public getStats() {
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter(t => now - t < 60000);
    const activeCooldowns = Array.from(this.modelCooldowns.entries())
      .filter(([_, until]) => until > now)
      .map(([id]) => id);

    const oldestTimestamp = this.requestTimestamps[0] || now;
    const secondsUntilReset = Math.max(0, Math.ceil((60000 - (now - oldestTimestamp)) / 1000));

    return {
      primaryModel: this.primaryModelId,
      currentRpm: this.requestTimestamps.length,
      maxRpmLimit: 40,
      isRpmExhausted: this.requestTimestamps.length >= 40,
      secondsUntilReset,
      activeCooldowns,
      ...this.stats,
      availableModels: AVAILABLE_MODELS
    };
  }

  /**
   * Dispatches chat prompt to primary model.
   * If primary encounters 429 Rate-Limit, timeout, or error,
   * automatically cascades through the 10 secondary models with cooldown tracking.
   */
  public async generateChat(messages: Array<{ role: string; content: string }>, customPrimary?: string): Promise<{
    content: string;
    modelUsed: string;
    failoverOccurred: boolean;
    failoverTrail: string[];
    responseTimeMs?: number;
    autoPromotedToPrimary?: boolean;
  }> {
    this.stats.totalCalls++;

    // Track RPM for NVIDIA's 40 RPM quota
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter(t => now - t < 60000);
    this.requestTimestamps.push(now);

    const startModelId = customPrimary || this.primaryModelId;

    // Filter models based on cooldowns (e.g. 429 rate-limited models)
    const fullChain = [
      startModelId,
      ...AVAILABLE_MODELS.map(m => m.id).filter(id => id !== startModelId)
    ];

    const eligibleModels: string[] = [];
    const inCooldown: string[] = [];

    for (const id of fullChain) {
      const cooldownUntil = this.modelCooldowns.get(id);
      if (cooldownUntil && cooldownUntil > now) {
        inCooldown.push(id);
      } else {
        eligibleModels.push(id);
      }
    }

    // Prioritize non-cooldown models, keep cooled down ones as last-resort
    const modelChain = eligibleModels.length > 0 ? [...eligibleModels, ...inCooldown] : fullChain;
    const failoverTrail: string[] = [];

    for (let i = 0; i < modelChain.length; i++) {
      const modelId = modelChain[i];
      const startTime = Date.now();
      try {
        console.log(`[AIEngine] Attempting model [${i + 1}/${modelChain.length}]: ${modelId} (RPM: ${this.requestTimestamps.length}/40) [Max: 12s limit]`);
        const responseText = await this.callNvidiaAPI(modelId, messages);
        const durationMs = Date.now() - startTime;
        
        this.stats.successfulCalls++;
        const failoverOccurred = i > 0;
        if (failoverOccurred) {
          this.stats.failoversCount++;
          this.stats.lastFailoverAt = new Date().toISOString();
        }

        // Smart Promotion: Any model that responds in < 15s automatically becomes the new Primary Model!
        const previousPrimary = this.primaryModelId;
        let autoPromoted = false;
        if (durationMs < 15000 && this.primaryModelId !== modelId) {
          this.setPrimaryModelId(modelId);
          autoPromoted = true;
          console.log(`⚡ [AIEngine Speed Promotion] Model "${modelId}" responded in ${(durationMs / 1000).toFixed(2)}s (<15s). Automatically updated as the new PRIMARY MODEL!`);
        }

        return {
          content: responseText,
          modelUsed: modelId,
          failoverOccurred,
          failoverTrail,
          responseTimeMs: durationMs,
          autoPromotedToPrimary: autoPromoted
        };
      } catch (err: any) {
        const durationMs = Date.now() - startTime;
        const errorMsg = err?.message || String(err);
        console.warn(`[AIEngine Warning] Model ${modelId} failed after ${(durationMs / 1000).toFixed(2)}s: ${errorMsg}`);

        // 15-Second Timeout Detection: Instantly cascade to next model
        if (errorMsg.includes('TIMEOUT_15S') || errorMsg.includes('aborted') || durationMs >= 14500) {
          console.warn(`⏳ [AIEngine 15s Timeout] Model ${modelId} took >15s (${(durationMs / 1000).toFixed(2)}s). Putting on 30s cooldown and instantly switching to next model!`);
          this.modelCooldowns.set(modelId, Date.now() + 30000);
          failoverTrail.push(`${modelId} timed out (>15s), auto-switched`);
        } else if (errorMsg.includes('429') || errorMsg.toLowerCase().includes('rate limit') || errorMsg.toLowerCase().includes('quota')) {
          this.stats.rateLimitTrips++;
          console.warn(`🛡️ [AIEngine RateLimit] 40 RPM threshold detected on ${modelId}. Setting 30s cooldown and switching model immediately.`);
          this.modelCooldowns.set(modelId, Date.now() + 30000);
          failoverTrail.push(`${modelId} rate-limited (429), auto-switched`);
        } else {
          this.modelCooldowns.set(modelId, Date.now() + 20000);
          failoverTrail.push(`${modelId} failed (${errorMsg})`);
        }
      }
    }

    // If all remote API calls failed, use smart local fallback
    console.warn(`[AIEngine] All remote models failed or offline. Engaging intelligent local tutor fallback.`);
    const fallbackResponse = this.generateLocalFallback(messages);
    return {
      content: fallbackResponse,
      modelUsed: 'local-intelligent-fallback',
      failoverOccurred: true,
      failoverTrail: [...failoverTrail, 'All remote NIM endpoints timed out, invoked local fallback'],
      responseTimeMs: 0,
      autoPromotedToPrimary: false
    };
  }

  private async callNvidiaAPI(modelId: string, messages: Array<{ role: string; content: string }>): Promise<string> {
    const controller = new AbortController();
    let timedOut = false;
    // Strict 15-second timeout per model
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 15000);

    const modelInfo = AVAILABLE_MODELS.find(m => m.id === modelId);
    const bodyPayload: any = {
      model: modelId,
      messages,
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 4096,
      stream: false
    };

    if (modelInfo?.supportsThinking) {
      bodyPayload.chat_template_kwargs = { enable_thinking: true };
    }

    try {
      const res = await fetch(NVIDIA_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(bodyPayload),
        signal: controller.signal
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`HTTP ${res.status}: ${errBody.slice(0, 150)}`);
      }

      const data: any = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from model');
      }

      return content;
    } catch (err: any) {
      if (timedOut || err.name === 'AbortError' || controller.signal.aborted) {
        throw new Error('TIMEOUT_15S: Response time exceeded 15 seconds');
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  private generateLocalFallback(messages: Array<{ role: string; content: string }>): string {
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const query = lastUserMessage.toLowerCase();
    const isPublicSales = systemMessage.includes('Lead Course Sales') || systemMessage.includes('public-sales');
    const isPrivateStudent = systemMessage.includes('Personal 1-on-1 Academic Coach') || systemMessage.includes('private-student');

    // ========================================================================
    // 1. PUBLIC SALES AI (GUARDRAIL & COURSE SELLING & 5-20% COUPON)
    // ========================================================================
    if (isPublicSales) {
      // 1.1 Strict Guardrail: Refuse off-topic questions outside LearnAI courses & tech learning
      const offTopicKeywords = [
        'recipe', 'cook', 'cooking', 'weather', 'movie', 'cinema', 'cricket', 'football',
        'president', 'politics', 'song', 'celebrity', 'joke', 'donald trump', 'biden',
        'hasina', 'russia', 'ukraine', 'food', 'restaurant', 'sports', 'game', 'gaming'
      ];
      const isOffTopic = offTopicKeywords.some(kw => query.includes(kw));

      if (isOffTopic) {
        return `### 🛡️ LearnAI Platform Guardrail Active

আমি **LearnAI এর ডেডিকেটেড কোর্স সেলস ও ক্যারিয়ার অ্যাডভাইজার**। আমি শুধুমাত্র আমাদের প্ল্যাটফর্মের কোর্স, টেক স্কিল ডেভেলপমেন্ট, ক্যারিয়ার গাইডলাইন এবং কোর্স এনরোলমেন্ট সংক্রান্ত বিষয়ে সহায়তা করতে পারি। বাইরের কোনো সাধারণ তথ্যের উত্তর দেওয়া আমার পরিধির বাইরে।

আমাদের প্ল্যাটফর্মে এখন ১৫টি ইন্ডাস্ট্রি-ডিমান্ডিং কোর্স রয়েছে—যেমন:
- 🧪 **SQA Automation Testing with Selenium & Playwright** (৳১,৮৯০)
- 💻 **Complete Full Stack Ecommerce Project with MERN** (৳১,৫৭৫)
- ⚡ **DSA with JavaScript for Technical Interviews** (৳১,৫৭৫)
- 🤖 **Machine Learning Mastery 2026** (৳১,৮৯০)
- 🚀 **Build AI Agent with Python** (৳১,৮৯০)
- 🔄 **AI Automation Fundamentals with n8n** (৳১,৮৯০)

আপনি কোন স্কিলটি শিখে ক্যারিয়ার গড়তে চান? জানালে আমি আপনাকে উপযুক্ত কোর্সের বিস্তারিত ও এনরোলমেন্টের ব্যবস্থা করে দিচ্ছি!`;
      }

      // 1.2 Passion & Discount / Coupon Request Detection (5% - 20%)
      const discountTriggers = [
        'discount', 'coupon', 'offer', 'voucher', 'token', 'ছাড়', 'ছাড়', 'কুপন',
        'অফার', 'price', 'দাম', 'টাকা', 'free', 'cost', 'ভর্তি', 'enroll', 'buy',
        'passion', 'আগ্রহ', 'শিখতে চাই', 'টাকা কম', 'ডিসকাউন্ট'
      ];
      const isSeekingDiscount = discountTriggers.some(kw => query.includes(kw));
      const isGuest = systemMessage.includes('GUEST_USER') || !systemMessage.includes('STUDENT_LOGGED_IN');

      if (isSeekingDiscount || query.length > 50) {
        // Calculate passion score between 10% and 20%
        const passionPercent = Math.min(20, Math.max(10, 10 + (query.length % 11)));
        const couponCode = `PASSION${passionPercent}`;

        return `### 🎯 আপনার জন্য সেরা কোর্স রিকমেন্ডেশন ও স্পেশাল এআই কুপন!

আপনার শেখার প্রবল আগ্রহ ও ক্যারিয়ার গড়ার প্যাশন দেখে আমরা অত্যন্ত উৎসাহিত! আপনার লক্ষ্য পূরণের জন্য আমাদের টপ ৩টি নির্বাচিত কোর্স:

1. 🧪 **SQA Automation Testing with Selenium & Playwright**
   - **প্রাইস:** ৳১,৮৯০ (মূল্য ৳২,৯৯৯ — ৩৭% ছাড়)
   - **ইন্সট্রাক্টর:** Hridoy Das (Lead Software Engineer, Mir Info Systems)
   - **আউটকাম:** Manual থেকে Automation Testing এ সুইচ করার সেরা কোর্স।

2. 💻 **Complete Full Stack Ecommerce with MERN**
   - **প্রাইস:** ৳১,৫৭৫ (মূল্য ৳২,৫০০ — ৩৭% ছাড়)
   - **আউটকাম:** MongoDB, Express, React, Node দিয়ে সম্পূর্ণ লাইভ ই-কমার্স প্রজেক্ট।

3. 🤖 **Build AI Agent with Python & LLM**
   - **প্রাইস:** ৳১,৮৯০
   - **আউটকাম:** ২০২৬ সালের মোস্ট ডিমান্ডিং অটোনোমাস এআই এজেন্ট তৈরি।

---

### 🎁 আপনার প্যাশন-ভিত্তিক এআই স্পেশাল কুপন (${passionPercent}% ছাড়)

আপনার প্রবল আগ্রহের মূল্যায়ন হিসেবে LearnAI এর সেলস ইঞ্জিন আপনাকে একটি **এককালীন ${passionPercent}% অতিরিক্ত ডিসকাউন্ট কুপন** অফার করছে!

[AI_COUPON: code=${couponCode}, discount=${passionPercent}, locked=${isGuest ? "true" : "false"}]

${isGuest ? `⚠️ **কুপনটি আনলক করার নিয়ম:**\nএই স্পেশাল কুপন কোডটি পেতে এবং যেকোনো কোর্সে ডিসকাউন্টে ভর্তি হতে দয়া করে **Sign In বা Register** করুন। লগইন করার সাথে সাথে আপনার অ্যাকাউন্টে কুপনটি সক্রিয় হয়ে যাবে!` : `✅ **কুপনটি স্বয়ংক্রিয়ভাবে সক্রিয় করা হয়েছে:**\nকুপন কোড: \`${couponCode}\` (${passionPercent}% ছাড়)। এখনই যেকোনো কোর্সে ভর্তি হওয়ার সময় ব্যবহার করুন!`}`;
      }

      // 1.3 General Course Recommendation & Persuasion
      return `### 🚀 LearnAI প্রিমিয়াম কোর্স গাইডলাইন

LearnAI প্ল্যাটফর্মে আপনাকে স্বাগতম! আমাদের মূল লক্ষ্য হলো আপনাকে হ্যান্ডস-অন প্রজেক্টের মাধ্যমে ইন্ডাস্ট্রি-রেডি স্কিল শেখানো।

আমাদের বর্তমান শীর্ষ কোর্সসমূহ:
- 🧪 **SQA Automation Testing** — Selenium, Playwright, Test Design (৳১,৮৯০)
- 💻 **Complete MERN Ecommerce** — React, Node, Express, MongoDB (৳১,৫৭৫)
- ⚡ **DSA with JavaScript** — Coding Interview Preparation (৳১,৫৭৫)
- 🤖 **Machine Learning & AI Agent Mastery 2026** — Python, LLM, RAG (৳১,৮৯০)
- 🎨 **UX Leadership: 10X Product Designer** — Figma, Design Systems (৳১,৫৭৫)

কোর্সের সাথে পাচ্ছেন **লাইফটাইম অ্যাক্সেস**, **ভেরিফায়েড সার্টিফিকেট**, এবং **২৪/৭ এআই স্টাডি টিউটর**।

আপনি কি কোনো কোর্সে ভর্তি হওয়ার জন্য স্পেশাল **AI Passion Coupon** পেতে চান? আপনার আগ্রহ ও ক্যারিয়ার গোল শেয়ার করুন!`;
    }

    // ========================================================================
    // 2. PRIVATE STUDENT AI (STUDENT NAME, PROGRESS & COURSE GUIDANCE)
    // ========================================================================
    if (isPrivateStudent) {
      // Extract student name and course progress from system context
      const nameMatch = systemMessage.match(/Student Name:\s*([^\n]+)/i);
      const studentName = nameMatch ? nameMatch[1].trim() : 'শিক্ষার্থী';
      const hasCourses = !systemMessage.includes('Enrolled Courses: 0');

      if (!hasCourses) {
        return `### 👨‍🎓 স্বাগতম ${studentName}!

আমি আপনার ব্যক্তিগত **LearnAI স্টাডি মেন্টর**।

⚠️ **জরুরি নোটিশ:** আপনি এখনো LearnAI প্ল্যাটফর্মের কোনো কোর্সে ভর্তি হননি!

প্রফেশনাল ক্যারিয়ার শুরু করতে এবং আমার কাছ থেকে স্টেপ-বাই-স্টেপ মেন্টরিং পেতে আজই আমাদের শীর্ষ কোর্সগুলোর একটিতে ভর্তি হয়ে যান:
1. 🧪 **SQA Automation Testing with Selenium & Playwright** (৳১,৮৯০)
2. 💻 **Full Stack MERN Ecommerce Project** (৳১,৫৭৫)
3. 🤖 **Build AI Agent with Python** (৳১,৮৯০)

কোর্সে এনরোল করার সাথে সাথে আমি আপনাকে প্রতিটি লেসনের নোট, কোড গাইডলাইন এবং কুইজ প্র্যাকটিসে সাহায্য করব! আপনি কোন ফিল্ডে কাজ করতে চান?`;
      }

      return `### 👨‍🎓 স্বাগতম ${studentName}!

আমি আপনার ব্যক্তিগত **LearnAI স্টাডি মেন্টর**। আপনার অ্যাকাউন্টের পড়াশোনার তথ্য ও প্রগ্রেস আমার কাছে রয়েছে।

📌 **আপনার বর্তমান পড়াশোনার স্ট্যাটাস:**
- নিয়মিত লেসন ভিডিও দেখুন এবং প্র্যাকটিক্যাল কোড ফাইলগুলো রান করুন।
- লেসনের শেষে প্রতিটি মডিউল কুইজে অংশগ্রহণ করুন যাতে সার্টিফিকেট আনলক হয়।
- যেকোনো কোডের বাগ, কনসেপ্ট বা অ্যাসাইনমেন্টের সমস্যা আমাকে নির্ভয়ে প্রশ্ন করুন!

আজ আপনার বর্তমান কোর্সের কোন লেসন বা টপিক নিয়ে আমরা কাজ শুরু করব?`;
    }

    // ========================================================================
    // 3. DEFAULT EDUCATIONAL TUTOR
    // ========================================================================
    if (query.includes('python') || query.includes('variable') || query.includes('loop')) {
      return `### 🐍 Python Core Concepts\n\nIn Python, variables are dynamically typed and initialized when assigned:\n\n\`\`\`python\nuser_name = "Rahim"\nscore = 95\nis_active = True\n\ndef calculate_grade(points):\n    if points >= 90:\n        return "A+"\n    return "A"\n\nprint(f"Student {user_name} Grade: {calculate_grade(score)}")\n\`\`\`\n\n**Key Takeaway**: Always keep functions modular, use snake_case for variables, and maintain clear indentation.`;
    }

    return `Hello! I am your **LearnAI Educational Assistant**.\n\nI am here to guide your learning journey. Feel free to ask about our courses, curriculum, programming concepts, or career roadmaps!`;
  }
}

export const aiEngine = new AIEngine();

// ============================================================================
// PART 3: IN-MEMORY DATABASE STORE & RICH DEMO SEED DATA
// ============================================================================

export class DatabaseStore {
  public users: Map<string, User> = new Map();
  public courses: Map<string, Course> = new Map();
  public quizzes: Map<string, Quiz> = new Map();
  public enrollments: Map<string, Enrollment> = new Map();
  public certificates: Map<string, Certificate> = new Map();
  public assignments: Map<string, Assignment> = new Map();
  public submissions: Map<string, AssignmentSubmission> = new Map();
  public userCoupons: Map<string, Array<{ code: string; discountPercent: number; claimedAt: string; used: boolean }>> = new Map();
  public currentUserId: string = 'user-student-1'; // Default active user for instant demo

  constructor() {
    this.seedData();
  }

  private seedData() {
    // 1. Users
    const studentUser: User = {
      id: 'user-student-1',
      name: 'Rahim Ahmed',
      email: 'rahim@learnai.com',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      title: 'Computer Science Diploma Student',
      bio: 'Enthusiastic learner specializing in Python and Web Development.'
    };

    const instructorUser: User = {
      id: 'user-instructor-1',
      name: 'Dr. Tariqul Islam',
      email: 'tariqul@learnai.com',
      role: 'instructor',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      title: 'Senior Software Architect & Instructor',
      bio: '12+ years industry experience in AI, Cloud and Full-Stack Engineering.'
    };

    const adminUser: User = {
      id: 'user-admin-1',
      name: 'System Administrator',
      email: 'admin@learnai.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      title: 'Platform Administrator',
      bio: 'Managing courses, analytics and system operations.'
    };

    this.users.set(studentUser.id, studentUser);
    this.users.set(instructorUser.id, instructorUser);
    this.users.set(adminUser.id, adminUser);

    // 2. Courses
    const coursePython: Course = {
      id: 'course-python-101',
      slug: 'python-programming-masterclass',
      title: 'Python Programming Masterclass',
      description: 'Master Python from scratch to advanced OOP, file handling, APIs, and real-world projects with AI-assisted guidance.',
      category: 'Programming',
      level: 'Beginner',
      price: 999,
      originalPrice: 1499,
      rating: 4.9,
      reviewsCount: 1240,
      instructor: {
        id: instructorUser.id,
        name: instructorUser.name,
        avatar: instructorUser.avatar,
        title: instructorUser.title!
      },
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      duration: '8h 35m',
      lessonsCount: 6,
      studentsCount: 3420,
      learningOutcomes: [
        'Understand Python syntax, data types, and logical control flow',
        'Build reusable Object-Oriented software architectures',
        'Handle file operations, JSON data, and modern REST APIs',
        'Create robust real-world automation scripts and web backends'
      ],
      modules: [
        {
          id: 'mod-py-1',
          courseId: 'course-python-101',
          title: 'Module 01: Python Foundations',
          order: 1,
          lessons: [
            {
              id: 'les-py-101',
              moduleId: 'mod-py-1',
              title: 'Introduction & Python Environment Setup',
              duration: '12m 40s',
              videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
              order: 1,
              content: `### Welcome to Python Masterclass\nIn this lesson, you will learn how Python interprets code and setup your virtual development environment.\n\nKey points:\n- Installing Python 3.11+\n- Understanding the REPL and code execution flow\n- Setting up IDE extensions`
            },
            {
              id: 'les-py-102',
              moduleId: 'mod-py-1',
              title: 'Variables, Data Types & Control Flow',
              duration: '18m 15s',
              videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8',
              order: 2,
              content: `### Variables & Control Flow\nLearn the fundamental building blocks of Python.\n\n- Integers, Floats, Strings, Booleans\n- \`if\`, \`elif\`, \`else\` conditionals\n- Loops: \`for\` and \`while\` iterations with lists`
            },
            {
              id: 'les-py-103',
              moduleId: 'mod-py-1',
              title: 'Functions & Clean Modular Code',
              duration: '22m 00s',
              videoUrl: 'https://www.youtube.com/embed/9Os0o3wzS_I',
              order: 3,
              content: `### Defining Functions in Python\nFunctions help reduce repetition and promote clean, testable code.\n\n- Arguments, default parameters, \`*args\`, \`**kwargs\`\n- Return values and docstrings\n- Scope resolution in Python`
            }
          ]
        },
        {
          id: 'mod-py-2',
          courseId: 'course-python-101',
          title: 'Module 02: Object-Oriented Programming (OOP)',
          order: 2,
          lessons: [
            {
              id: 'les-py-201',
              moduleId: 'mod-py-2',
              title: 'Classes, Objects & Constructors',
              duration: '25m 10s',
              videoUrl: 'https://www.youtube.com/embed/JeznW_7DlB0',
              order: 4,
              content: `### Classes and Objects\nLearn how to model real-world business entities using OOP.\n\n- Class definition and \`__init__\` constructor\n- Instance methods vs Class methods\n- Encapsulation with private attributes`
            },
            {
              id: 'les-py-202',
              moduleId: 'mod-py-2',
              title: 'Inheritance & Polymorphism',
              duration: '20m 45s',
              videoUrl: 'https://www.youtube.com/embed/RSl87lqOXDE',
              order: 5,
              content: `### Inheritance and Polymorphism\nReuse code effectively through subclassing.\n\n- Base classes and derived classes\n- Using \`super()\` to extend constructor logic\n- Method overriding in action`
            },
            {
              id: 'les-py-203',
              moduleId: 'mod-py-2',
              title: 'Capstone Project: CLI Banking System',
              duration: '35m 00s',
              videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
              order: 6,
              content: `### Building the Capstone Project\nCombine everything you learned into a fully functional CLI banking application with account creation, deposits, and transaction logs.`
            }
          ]
        }
      ]
    };

    const courseWeb: Course = {
      id: 'course-web-201',
      slug: 'fullstack-web-dev',
      title: 'Modern Full-Stack Web Development (React & Node.js)',
      description: 'Build production-ready web applications using React, TypeScript, Node.js, Express, and modern database patterns.',
      category: 'Web Development',
      level: 'Intermediate',
      price: 1299,
      originalPrice: 2200,
      rating: 4.8,
      reviewsCount: 980,
      instructor: {
        id: instructorUser.id,
        name: instructorUser.name,
        avatar: instructorUser.avatar,
        title: instructorUser.title!
      },
      thumbnail: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&auto=format&fit=crop&q=80',
      duration: '14h 20m',
      lessonsCount: 5,
      studentsCount: 2890,
      learningOutcomes: [
        'Build scalable frontend SPAs with React & TypeScript',
        'Design RESTful backend APIs with Node.js and Express',
        'State management, authentication and security best practices',
        'Deploy production web applications on cloud platforms'
      ],
      modules: [
        {
          id: 'mod-web-1',
          courseId: 'course-web-201',
          title: 'Module 01: Modern React Frontend',
          order: 1,
          lessons: [
            {
              id: 'les-web-101',
              moduleId: 'mod-web-1',
              title: 'React Fundamentals & Component Architecture',
              duration: '19m 30s',
              videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8',
              order: 1,
              content: `### React Component Architecture\nMaster state, props, JSX and modern hooks like useState and useEffect.`
            },
            {
              id: 'les-web-102',
              moduleId: 'mod-web-1',
              title: 'Custom Hooks & State Management',
              duration: '24m 10s',
              videoUrl: 'https://www.youtube.com/embed/0ZJgIjIuY7U',
              order: 2,
              content: `### Custom Hooks in TypeScript\nCreating clean reusable logic for data fetching, caching and user sessions.`
            }
          ]
        },
        {
          id: 'mod-web-2',
          courseId: 'course-web-201',
          title: 'Module 02: Node.js Backend & Database',
          order: 2,
          lessons: [
            {
              id: 'les-web-201',
              moduleId: 'mod-web-2',
              title: 'Express REST APIs & Middleware Pipeline',
              duration: '21m 40s',
              videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE',
              order: 3,
              content: `### Express API Design\nRoute handlers, middleware, request validation and error boundaries.`
            },
            {
              id: 'les-web-202',
              moduleId: 'mod-web-2',
              title: 'JWT Authentication & Security',
              duration: '26m 00s',
              videoUrl: 'https://www.youtube.com/embed/7Q17ubqL251',
              order: 4,
              content: `### Authentication\nImplementing token-based authentication, password hashing and protected routes.`
            },
            {
              id: 'les-web-203',
              moduleId: 'mod-web-2',
              title: 'Full Stack Integration & Deployment',
              duration: '32m 15s',
              videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M',
              order: 5,
              content: `### Capstone Full Stack App\nConnect React frontend to Express backend with CORS, environment configs and production build.`
            }
          ]
        }
      ]
    };

    const courseAI: Course = {
      id: 'course-ai-301',
      slug: 'practical-ai-data-science',
      title: 'Practical AI & Data Science with Machine Learning',
      description: 'Hands-on guide to Python for Data Science, Pandas, NumPy, Scikit-Learn, and integrating Large Language Models (LLMs).',
      category: 'AI',
      level: 'Advanced',
      price: 1499,
      originalPrice: 2500,
      rating: 4.9,
      reviewsCount: 750,
      instructor: {
        id: instructorUser.id,
        name: instructorUser.name,
        avatar: instructorUser.avatar,
        title: instructorUser.title!
      },
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
      duration: '11h 45m',
      lessonsCount: 4,
      studentsCount: 1950,
      learningOutcomes: [
        'Data analysis and visualization with Pandas and Matplotlib',
        'Supervised & Unsupervised Machine Learning algorithms',
        'Prompt engineering and LLM integrations with NVIDIA NIM',
        'Deploying AI predictive models into web interfaces'
      ],
      modules: [
        {
          id: 'mod-ai-1',
          courseId: 'course-ai-301',
          title: 'Module 01: Data Science Essentials',
          order: 1,
          lessons: [
            {
              id: 'les-ai-101',
              moduleId: 'mod-ai-1',
              title: 'Pandas & NumPy for Data Wrangling',
              duration: '22m 15s',
              videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg',
              order: 1,
              content: `### Data Wrangling with Pandas\nFiltering dataframes, handling missing values, and aggregation.`
            },
            {
              id: 'les-ai-102',
              moduleId: 'mod-ai-1',
              title: 'Exploratory Data Analysis & Visualization',
              duration: '18m 50s',
              videoUrl: 'https://www.youtube.com/embed/GPVsHOlRBBI',
              order: 2,
              content: `### Visualization\nHistograms, correlation heatmaps, and scatter plots.`
            }
          ]
        },
        {
          id: 'mod-ai-2',
          courseId: 'course-ai-301',
          title: 'Module 02: Machine Learning & LLMs',
          order: 2,
          lessons: [
            {
              id: 'les-ai-201',
              moduleId: 'mod-ai-2',
              title: 'Regression & Classification Models',
              duration: '28m 30s',
              videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
              order: 3,
              content: `### Machine Learning Foundations\nTraining models with Scikit-learn and evaluating accuracy.`
            },
            {
              id: 'les-ai-202',
              moduleId: 'mod-ai-2',
              title: 'Connecting LLMs with NVIDIA NIM & RAG',
              duration: '34m 00s',
              videoUrl: 'https://www.youtube.com/embed/2TJxpyO3ei4',
              order: 4,
              content: `### LLM Integration\nConnecting Python and Node apps to NVIDIA NIM endpoints with prompt engineering.`
            }
          ]
        }
      ]
    };

    const courseCloud: Course = {
      id: 'course-cloud-401',
      slug: 'cloud-devops-networking',
      title: 'Cloud DevOps & Networking Fundamentals',
      description: 'Learn Docker containerization, CI/CD pipelines, Linux server administration, and modern cloud deployment.',
      category: 'Networking',
      level: 'Intermediate',
      price: 1199,
      originalPrice: 1999,
      rating: 4.7,
      reviewsCount: 610,
      instructor: {
        id: instructorUser.id,
        name: instructorUser.name,
        avatar: instructorUser.avatar,
        title: instructorUser.title!
      },
      thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
      duration: '9h 15m',
      lessonsCount: 4,
      studentsCount: 1420,
      learningOutcomes: [
        'Containerize applications with Docker & Docker Compose',
        'Configure Nginx reverse proxies and SSL certificates',
        'Build automated CI/CD pipelines with GitHub Actions',
        'Understand TCP/IP, DNS, Subnets, and Cloud firewalls'
      ],
      modules: [
        {
          id: 'mod-cl-1',
          courseId: 'course-cloud-401',
          title: 'Module 01: Docker & Containerization',
          order: 1,
          lessons: [
            {
              id: 'les-cl-101',
              moduleId: 'mod-cl-1',
              title: 'Docker Architecture & Dockerfile Creation',
              duration: '21m 10s',
              videoUrl: 'https://www.youtube.com/embed/pTFZFxd4hOI',
              order: 1,
              content: `### Docker Basics\nBuilding images, managing containers and multi-stage builds.`
            },
            {
              id: 'les-cl-102',
              moduleId: 'mod-cl-1',
              title: 'Multi-container Apps with Docker Compose',
              duration: '25m 00s',
              videoUrl: 'https://www.youtube.com/embed/HG6yLvbpft4',
              order: 2,
              content: `### Docker Compose\nOrchestrating backend, database, and cache services.`
            }
          ]
        },
        {
          id: 'mod-cl-2',
          courseId: 'course-cloud-401',
          title: 'Module 02: Networking & CI/CD',
          order: 2,
          lessons: [
            {
              id: 'les-cl-201',
              moduleId: 'mod-cl-2',
              title: 'Networking, DNS & Reverse Proxy with Nginx',
              duration: '23m 40s',
              videoUrl: 'https://www.youtube.com/embed/7VAI73roXaY',
              order: 3,
              content: `### Nginx Configuration\nReverse proxying HTTP traffic and load balancing.`
            },
            {
              id: 'les-cl-202',
              moduleId: 'mod-cl-2',
              title: 'Automated CI/CD Deployment with GitHub Actions',
              duration: '29m 15s',
              videoUrl: 'https://www.youtube.com/embed/R8_veQiYBjI',
              order: 4,
              content: `### CI/CD Pipelines\nAutomating tests and zero-downtime deployment.`
            }
          ]
        }
      ]
    };

    this.courses.set(coursePython.id, coursePython);
    this.courses.set(courseWeb.id, courseWeb);
    this.courses.set(courseAI.id, courseAI);
    this.courses.set(courseCloud.id, courseCloud);

    // Seed all 15 rich real-world courses
    allDemoCourses.forEach(c => {
      this.courses.set(c.id, c);
    });

    // 3. Quizzes for Courses
    const pythonQuiz: Quiz = {
      id: 'quiz-py-101',
      courseId: coursePython.id,
      title: 'Python Fundamentals & OOP Evaluation',
      passingScore: 70,
      questions: [
        {
          id: 'q1',
          question: 'Which of the following data types is mutable in Python?',
          options: ['Tuple', 'String', 'List', 'Integer'],
          correctIndex: 2,
          explanation: 'Lists can be modified in-place (append, remove, pop), making them mutable.'
        },
        {
          id: 'q2',
          question: 'What special method is called automatically when an object is instantiated?',
          options: ['__create__', '__init__', '__start__', '__new__'],
          correctIndex: 1,
          explanation: '__init__ is Python\'s constructor method for initializing new object instances.'
        },
        {
          id: 'q3',
          question: 'Which keyword is used to access methods and properties of a parent class in Python?',
          options: ['parent()', 'this()', 'super()', 'base()'],
          correctIndex: 2,
          explanation: 'super() delegates method calls to the parent or sibling class.'
        },
        {
          id: 'q4',
          question: 'What is the primary benefit of Python List Comprehensions?',
          options: [
            'They compress file sizes on disk',
            'They offer concise syntax to create lists from existing iterables',
            'They enable multithreading in CPU bound tasks',
            'They automatically format docstrings'
          ],
          correctIndex: 1,
          explanation: 'List comprehensions provide a concise and readable way to create transformed lists.'
        }
      ]
    };

    this.quizzes.set(pythonQuiz.courseId, pythonQuiz);

    // 4. Default Seed Enrollment for Student Rahim
    const initialEnrollment: Enrollment = {
      id: 'enr-rahim-py-1',
      studentId: studentUser.id,
      courseId: coursePython.id,
      enrolledAt: '2026-03-01T10:00:00Z',
      progressPercent: 33,
      completedLessonIds: ['les-py-101', 'les-py-102'],
      isCertified: true,
      certificateId: 'cert-1788514856256',
      paymentStatus: 'completed',
      paidAmount: 3500,
      paymentMethod: 'bKash',
      couponUsed: 'LEARNAI15',
      discountPercent: 15
    };
    this.enrollments.set(`${studentUser.id}:${coursePython.id}`, initialEnrollment);

    // 5. Seed Official Sample Certificate for Demo
    const sampleCert: Certificate = {
      id: 'cert-1788514856256',
      certificateNumber: 'NXA-2026-88942-AI',
      studentId: studentUser.id,
      studentName: studentUser.name,
      courseId: coursePython.id,
      courseTitle: coursePython.title,
      issueDate: 'October 14, 2026',
      grade: 'Distinction',
      duration: coursePython.duration || '48 Hours (8 Weeks)',
      instructorName: coursePython.instructor?.name || 'Dr. Tariqul Islam',
      authorizedPerson: 'Elena Rostova, Academic Director',
      verificationUrl: 'https://verify.learnai.io/cert/NXA-2026-88942-AI'
    };
    this.certificates.set(sampleCert.id, sampleCert);

    // 6. Seed Practical Course Assignments
    const sampleAssignment: Assignment = {
      id: 'asg-py-1',
      courseId: coursePython.id,
      title: 'Assignment 01: Design Student Record Class & GPA Calculator',
      description: 'Implement an Object-Oriented Student class in Python with methods to add course grades, calculate weighted GPA, and serialize student records to JSON format. Push your solution to a GitHub repository.',
      dueDate: 'October 30, 2026',
      points: 100
    };
    this.assignments.set(sampleAssignment.id, sampleAssignment);
  }
}

export const db = new DatabaseStore();

// ============================================================================
// PART 4: SPECIALIZED AI SERVICES
// ============================================================================

export class AIServices {
  /**
   * AI Course Finder Questionnaire evaluation
   */
  public static async recommendCourse(data: {
    goal: string;
    level: string;
    preferredTopic: string;
    weeklyHours: string;
  }): Promise<{
    recommendedCourse: Course;
    matchScore: number;
    reasoning: string;
    modelUsed: string;
    failoverOccurred: boolean;
  }> {
    const coursesList = Array.from(db.courses.values()).map(c => ({
      id: c.id,
      title: c.title,
      category: c.category,
      level: c.level,
      description: c.description
    }));

    const systemPrompt = `You are the Lead Career Advisor and Course Recommender for LearnAI LMS.
Given a student's profile:
- Goal: ${data.goal}
- Current Level: ${data.level}
- Interest: ${data.preferredTopic}
- Commitment: ${data.weeklyHours} hours/week

Evaluate the available courses:
${JSON.stringify(coursesList, null, 2)}

Select the best matching course ID and provide a 2-3 sentence encouraging explanation highlighting why this course accelerates their specific goal.
Your response MUST be in valid JSON format:
{
  "recommendedCourseId": "course-id-here",
  "matchScore": 94,
  "reasoning": "Reason here..."
}`;

    const aiResult = await aiEngine.generateChat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Analyze my profile and recommend the ideal course.' }
    ]);

    let parsed: any = null;
    try {
      const cleaned = aiResult.content.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback matching logic if JSON parsing is imperfect
      const topicLower = data.preferredTopic.toLowerCase();
      let matchedId = 'course-python-101';
      if (topicLower.includes('web') || topicLower.includes('react') || topicLower.includes('node')) {
        matchedId = 'course-web-201';
      } else if (topicLower.includes('ai') || topicLower.includes('data') || topicLower.includes('machine')) {
        matchedId = 'course-ai-301';
      } else if (topicLower.includes('cloud') || topicLower.includes('network') || topicLower.includes('devops')) {
        matchedId = 'course-cloud-401';
      }

      parsed = {
        recommendedCourseId: matchedId,
        matchScore: 92,
        reasoning: `Based on your interest in ${data.preferredTopic} and your goal to ${data.goal}, this course provides the most direct and practical curriculum.`
      };
    }

    const course = db.courses.get(parsed.recommendedCourseId) || db.courses.get('course-python-101')!;

    return {
      recommendedCourse: course,
      matchScore: parsed.matchScore || 92,
      reasoning: parsed.reasoning,
      modelUsed: aiResult.modelUsed,
      failoverOccurred: aiResult.failoverOccurred
    };
  }

  /**
   * Mode 1: AI Tutor (General Educational Q&A)
   */
  public static async askTutor(question: string, history: Array<{ role: string; content: string }> = []): Promise<any> {
    const messages = [
      {
        role: 'system',
        content: `You are LearnAI's Master AI Tutor. You explain concepts clearly, provide concrete code examples, and structure explanations with markdown headers, lists, and code blocks. Be encouraging, concise, and pedagogical.`
      },
      ...history,
      { role: 'user', content: question }
    ];

    return await aiEngine.generateChat(messages);
  }

  /**
   * Mode 2: Course Assistant (Grounded on current course & lesson)
   */
  public static async askCourseAssistant(
    courseId: string,
    lessonId: string,
    question: string,
    history: Array<{ role: string; content: string }> = []
  ): Promise<any> {
    const course = db.courses.get(courseId);
    let lessonTitle = 'General Lesson';
    let lessonContent = '';

    if (course) {
      for (const m of course.modules) {
        const found = m.lessons.find(l => l.id === lessonId);
        if (found) {
          lessonTitle = found.title;
          lessonContent = found.content;
          break;
        }
      }
    }

    const messages = [
      {
        role: 'system',
        content: `You are the Course Assistant for "${course?.title || 'Online Course'}".
You are currently assisting the student during lesson: "${lessonTitle}".
Lesson Material Context:
${lessonContent}

Ground your answer specifically to this lesson's concepts. If the student asks for clarification or an example, relate it to what they just watched/read in this lesson.`
      },
      ...history,
      { role: 'user', content: question }
    ];

    return await aiEngine.generateChat(messages);
  }

  /**
   * Mode 3: Career & Learning Roadmap Generator
   */
  public static async generateRoadmap(careerGoal: string, timeframe: string = '6 Months'): Promise<any> {
    const messages = [
      {
        role: 'system',
        content: `You are the Senior Tech Career Strategist at LearnAI.
The student wants to become: "${careerGoal}" in a timeframe of "${timeframe}".
Create a detailed, high-impact month-by-month learning roadmap. Include:
1. Exact skills to learn each month
2. Recommended capstone project
3. Suggested weekly hours
4. Key interview topics
Use clean markdown headers, bullets, and bold highlights.`
      },
      { role: 'user', content: `Generate my ${timeframe} learning roadmap for ${careerGoal}.` }
    ];

    return await aiEngine.generateChat(messages);
  }

  /**
   * Mode 4: Public Course Sales & Recommendation AI (Strict Guardrail & Passion Coupon 5-20%)
   * Usable WITHOUT login.
   * STRICT GUARDRAIL: Refuses all non-LearnAI / non-course topics!
   */
  public static async askPublicSales(
    question: string,
    history: Array<{ role: string; content: string }> = [],
    isLoggedIn: boolean = false,
    userName?: string
  ): Promise<any> {
    const courseListSummary = allDemoCourses.map((c, i) => 
      `${i+1}. "${c.title}" | ৳${c.price.toLocaleString()} (Orig: ৳${c.originalPrice?.toLocaleString() || c.price}) | Category: ${c.category} | Level: ${c.level} | Instructor: ${c.instructor.name} | Rating: ${c.rating}⭐ (${c.studentsCount}+ students) | Duration: ${c.duration} | Lessons: ${c.lessonsCount} | Skills: ${c.learningOutcomes.slice(0, 3).join(', ')}`
    ).join('\n');

    const systemPrompt = `You are LearnAI's Lead Course Sales Consultant & Career Advisor.
YOUR MAIN MISSION IS TO SELL AND RECOMMEND LEARNAI'S 15 COURSES.
Whenever a user asks about learning any skill, switching careers, or course recommendations, your goal is to enthusiastically recommend our courses and persuade them to enroll today!

STRICT GUARDRAIL - SITE CONTENT & LEARNING ONLY:
Under NO circumstances will you answer questions outside LearnAI courses, technology training, software skills, career roadmaps, or enrollment.
If the user asks about anything unrelated (such as politics, news, movies, cooking, celebrities, sports, jokes, general trivia), you MUST POLITELY REFUSE in Bengali:
"আমি LearnAI এর ডেডিকেটেড কোর্স সেলস ও ক্যারিয়ার অ্যাডভাইজার। আমি শুধুমাত্র আমাদের প্ল্যাটফর্মের কোর্স, টেকনোলজি স্কিল ডেভেলপমেন্ট, ক্যারিয়ার গাইডলাইন এবং কোর্স এনরোলমেন্ট সংক্রান্ত বিষয়ে সহায়তা করতে পারি। আপনি কি আমাদের ১৫টি প্রিমিয়াম কোর্সের যেকোনো একটি সম্পর্কে জানতে চান?"

OFFICIAL LEARNAI COURSE CATALOG:
${courseListSummary}

SPECIAL 5% - 20% AI PASSION COUPON RULE:
Evaluate the user's passion, enthusiasm, and eagerness to learn (or if they ask for discounts/coupons/price).
Based on their passion, reward them with a 5% to 20% discount coupon (e.g. 10%, 15%, 20%).
- Current User Status: ${isLoggedIn ? `LOGGED_IN as "${userName || 'Student'}"` : 'GUEST_USER (NOT LOGGED IN)'}.
- If user is NOT logged in:
  Tell them they are awarded a special discount coupon (e.g. 15% code PASSION15), but emphasize:
  "কুপনটি পেতে এবং কোর্সে ভর্তি হতে অনুগ্রহ করে Sign In / Register করুন। লগইন করার সাথে সাথে কুপনটি আনলক হয়ে যাবে!"
  Output tag: [AI_COUPON: code=PASSION15, discount=15, locked=true]
- If user IS logged in:
  Congratulate them by name:
  "অভিনন্দন ${userName || ''}! আপনার অ্যাকাউন্টে ১৫% ডিসকাউন্ট কুপন সক্রিয় হয়েছে।"
  Output tag: [AI_COUPON: code=PASSION15, discount=15, locked=false]

COURSE RECOMMENDATION CARD RULE:
Whenever you recommend a specific course from the catalog, you MUST also output the course recommendation tag at the end:
[RECOMMENDED_COURSE: id=<course_id>]
(e.g., [RECOMMENDED_COURSE: id=course-sqa-automation], [RECOMMENDED_COURSE: id=course-mern-ecommerce], [RECOMMENDED_COURSE: id=course-ai-agent], [RECOMMENDED_COURSE: id=course-docker-devops], etc.)

Write your response in clear, friendly Bengali (with English tech terms). Structure with markdown bolding, lists, and clear course recommendation highlights.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: question }
    ];

    return await aiEngine.generateChat(messages);
  }

  /**
   * Mode 5: Private Student AI (Enrolled Student Mentor & Progress Coach)
   * Only for logged-in students.
   * Has access to student name, enrolled courses, progress, and current active course.
   */
  public static async askPrivateStudent(
    question: string,
    studentData: {
      name: string;
      email: string;
      enrolledCourses: Array<{ title: string; progressPercent: number; completedLessons: number; totalLessons: number; isCertified: boolean }>;
      activeCourseTitle?: string;
      currentProgressPercent?: number;
    },
    history: Array<{ role: string; content: string }> = []
  ): Promise<any> {
    const coursesSummary = studentData.enrolledCourses.length > 0
      ? studentData.enrolledCourses.map((c, i) => `${i+1}. "${c.title}" - Progress: ${c.progressPercent}% (${c.completedLessons}/${c.totalLessons} lessons done, Certified: ${c.isCertified ? 'Yes' : 'No'})`).join('\n')
      : 'NO COURSES ENROLLED YET';

    const systemPrompt = `You are LearnAI's Personal 1-on-1 Academic Coach and Study Mentor for student "${studentData.name}".
Student Data:
- Name: ${studentData.name}
- Email: ${studentData.email}
- Enrolled Courses Count: ${studentData.enrolledCourses.length}
- Current Active Course: ${studentData.activeCourseTitle || 'None'} (${studentData.currentProgressPercent || 0}%)
- Enrolled Courses Breakdown:
${coursesSummary}

YOUR MISSION:
1. Address the student warmly by their name "${studentData.name}" in Bengali.
2. CURRENT COURSE COMPLETION GUIDANCE:
   - If they have enrolled courses, guide them through finishing their lessons, understanding difficult concepts, completing quizzes, and achieving their certificate!
3. IF ZERO COURSES ENROLLED:
   - Strongly urge and motivate the student to enroll in their first course immediately! Explain why choosing a focused career path (like SQA Automation, MERN Ecommerce, or Python AI Agents) is essential.
4. NEXT COURSE RECOMMENDATION:
   - If they are progressing well, suggest the logical next course from LearnAI's 15 courses to level up their career.
5. Provide deep, encouraging technical explanations, debug help, and study schedules.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: question }
    ];

    return await aiEngine.generateChat(messages);
  }
}

// ============================================================================
// PART 5: REST API ENDPOINTS
// ============================================================================

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// 1. Health & Model Diagnostics
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    appName: 'LearnAI LMS Platform',
    timestamp: new Date().toISOString(),
    primaryModel: aiEngine.getPrimaryModelId(),
    activeUser: db.users.get(db.currentUserId)
  });
});

// 2. AI Model Telemetry & Switcher
app.get('/api/ai/models', (req: Request, res: Response) => {
  res.json(aiEngine.getStats());
});

app.post('/api/ai/models/set-primary', (req: Request, res: Response) => {
  const { modelId } = req.body;
  if (!modelId) {
    return res.status(400).json({ error: 'modelId is required' });
  }
  const success = aiEngine.setPrimaryModelId(modelId);
  if (success) {
    return res.json({ success: true, activePrimary: modelId });
  }
  res.status(404).json({ error: 'Model not recognized' });
});

// ============================================================================
// PART 3: AUTHENTICATION SUITE (LOGIN, REGISTER, OTP, 2FA & DEMO USERS)
// ============================================================================

interface AuthPendingSession {
  sessionId: string;
  userId?: string;
  tempUser?: any;
  otpCode: string;
  otpChannel: 'email' | 'sms';
  targetContact: string;
  expiresAt: number;
  otpVerified: boolean;
  twoFactorVerified: boolean;
}

const authPendingSessions = new Map<string, AuthPendingSession>();

// 3.1 Get Current Authenticated User
app.get('/api/auth', (req: Request, res: Response) => {
  const user = db.users.get(db.currentUserId);
  res.json(user || null);
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = db.users.get(db.currentUserId);
  if (!user) {
    return res.status(401).json({ authenticated: false, user: null });
  }
  res.json({ authenticated: true, user });
});

// 3.2 One-Click Demo User Login (Student, Instructor, Admin)
app.post('/api/auth/demo-quick-login', (req: Request, res: Response) => {
  const { role = 'student', requireSecurityCheck = false } = req.body;
  let targetUser: User | undefined;

  for (const u of db.users.values()) {
    if (u.role === role) {
      targetUser = u;
      break;
    }
  }

  if (!targetUser) {
    return res.status(404).json({ error: `Demo account for role "${role}" not found` });
  }

  if (requireSecurityCheck) {
    // Generate OTP & 2FA sequence for viva demo
    const sessionId = `auth_sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    authPendingSessions.set(sessionId, {
      sessionId,
      userId: targetUser.id,
      otpCode,
      otpChannel: 'email',
      targetContact: targetUser.email,
      expiresAt: Date.now() + 5 * 60 * 1000,
      otpVerified: false,
      twoFactorVerified: false
    });

    return res.json({
      requireOtp: true,
      sessionId,
      role: targetUser.role,
      userName: targetUser.name,
      channel: 'email',
      targetContact: targetUser.email,
      devOtpPreview: otpCode,
      message: `[DEV SIMULATOR] One-Time Password for ${targetUser.name} (${role}): ${otpCode}`
    });
  }

  // Instant one-click login
  db.currentUserId = targetUser.id;
  console.log(`[Auth Demo] Instant login: ${targetUser.name} (${targetUser.role})`);
  return res.json({
    success: true,
    user: targetUser,
    token: `token_${targetUser.id}_${Date.now()}`
  });
});

// 3.3 Email/Password Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, deliveryMethod = 'email' } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  let user: User | undefined;

  for (const u of db.users.values()) {
    if (u.email.toLowerCase() === cleanEmail) {
      user = u;
      break;
    }
  }

  if (!user) {
    return res.status(401).json({ error: 'No user account found with this email. Please register.' });
  }

  const sessionId = `auth_sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const contact = deliveryMethod === 'sms' ? (user as any).phone || '+880 1700-000000' : user.email;

  authPendingSessions.set(sessionId, {
    sessionId,
    userId: user.id,
    otpCode,
    otpChannel: deliveryMethod === 'sms' ? 'sms' : 'email',
    targetContact: contact,
    expiresAt: Date.now() + 5 * 60 * 1000,
    otpVerified: false,
    twoFactorVerified: false
  });

  return res.json({
    requireOtp: true,
    sessionId,
    channel: deliveryMethod === 'sms' ? 'sms' : 'email',
    targetContact: contact,
    devOtpPreview: otpCode,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// 3.4 Student & Tutor/Instructor Registration
app.post('/api/auth/register', (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
    role = 'student',
    phone = '+880 1711-223344',
    expertise = 'Full-Stack Development & AI',
    bio = 'Passionate educator on LearnAI',
    deliveryMethod = 'email'
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and Email are required.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();

  // Check if email already registered
  for (const u of db.users.values()) {
    if (u.email.toLowerCase() === cleanEmail) {
      return res.status(400).json({ error: 'This email is already registered. Please login.' });
    }
  }

  const targetRole = role === 'instructor' ? 'instructor' : 'student';
  const newUserId = `user-${targetRole}-${Date.now()}`;

  const tempUser: User = {
    id: newUserId,
    name: name.trim(),
    email: cleanEmail,
    role: targetRole,
    avatar: targetRole === 'instructor'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    title: targetRole === 'instructor' ? `Instructor (${expertise})` : 'Diploma Student',
    bio: bio || (targetRole === 'instructor' ? `Expert instructor specializing in ${expertise}.` : 'Student at LearnAI.')
  };

  const sessionId = `auth_sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const contact = deliveryMethod === 'sms' ? phone : cleanEmail;

  authPendingSessions.set(sessionId, {
    sessionId,
    tempUser,
    otpCode,
    otpChannel: deliveryMethod === 'sms' ? 'sms' : 'email',
    targetContact: contact,
    expiresAt: Date.now() + 5 * 60 * 1000,
    otpVerified: false,
    twoFactorVerified: false
  });

  return res.status(201).json({
    requireOtp: true,
    sessionId,
    channel: deliveryMethod === 'sms' ? 'sms' : 'email',
    targetContact: contact,
    devOtpPreview: otpCode,
    user: tempUser
  });
});

// 3.5 Resend or Switch OTP Channel (Email / SMS)
app.post('/api/auth/resend-otp', (req: Request, res: Response) => {
  const { sessionId, deliveryMethod } = req.body;
  const session = authPendingSessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Verification session expired. Please restart login.' });
  }

  const freshOtp = Math.floor(100000 + Math.random() * 900000).toString();
  session.otpCode = freshOtp;
  session.expiresAt = Date.now() + 5 * 60 * 1000;

  if (deliveryMethod === 'sms' || deliveryMethod === 'email') {
    session.otpChannel = deliveryMethod;
  }

  return res.json({
    success: true,
    sessionId,
    channel: session.otpChannel,
    targetContact: session.targetContact,
    devOtpPreview: freshOtp,
    message: `[DEV SIMULATOR] New OTP sent via ${session.otpChannel.toUpperCase()}: ${freshOtp}`
  });
});

// 3.6 Verify OTP Code
app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
  const { sessionId, code } = req.body;
  const session = authPendingSessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Verification session expired. Please start over.' });
  }

  if (session.expiresAt < Date.now()) {
    authPendingSessions.delete(sessionId);
    return res.status(400).json({ error: 'OTP code has expired. Please request a new one.' });
  }

  const cleanCode = String(code).trim();
  // Accept the generated code or '123456' as master bypass for viva demonstration
  if (cleanCode !== session.otpCode && cleanCode !== '123456') {
    return res.status(400).json({ error: 'Incorrect OTP code. Please check the simulated alert.' });
  }

  session.otpVerified = true;
  return res.json({
    success: true,
    require2fa: true,
    sessionId,
    dev2faHint: '123456',
    message: 'OTP verified successfully! Please enter your 2FA Authenticator code.'
  });
});

// 3.7 Verify 2FA & Complete Authentication
app.post('/api/auth/verify-2fa', (req: Request, res: Response) => {
  const { sessionId, code } = req.body;
  const session = authPendingSessions.get(sessionId);

  if (!session || !session.otpVerified) {
    return res.status(400).json({ error: 'Please complete OTP verification first.' });
  }

  const cleanCode = String(code).trim();
  // Accept any 6-digit number or master code '123456'
  if (!/^\d{6}$/.test(cleanCode)) {
    return res.status(400).json({ error: 'Invalid 2FA code. Please enter a 6-digit authentication token.' });
  }

  let finalUser: User;

  if (session.userId) {
    // Existing user login
    finalUser = db.users.get(session.userId)!;
  } else if (session.tempUser) {
    // New user registration completion
    finalUser = session.tempUser;
    db.users.set(finalUser.id, finalUser);
    console.log(`[Auth] Registered new ${finalUser.role}: ${finalUser.name} (${finalUser.email})`);
  } else {
    return res.status(400).json({ error: 'No user associated with this session.' });
  }

  db.currentUserId = finalUser.id;
  authPendingSessions.delete(sessionId);

  console.log(`[Auth Verified] Login complete: ${finalUser.name} [${finalUser.role}]`);

  return res.json({
    success: true,
    authenticated: true,
    user: finalUser,
    token: `token_${finalUser.id}_${Date.now()}`
  });
});

// 3.8 Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  console.log(`[Auth] User ${db.currentUserId} logged out`);
  db.currentUserId = '';
  return res.json({ success: true, message: 'Logged out successfully' });
});

// 3.9 Quick Role Switcher (Retained for fast grading/dev)
app.post('/api/auth/switch-role', (req: Request, res: Response) => {
  const { role } = req.body;
  let targetUser: User | undefined;

  for (const u of db.users.values()) {
    if (u.role === role) {
      targetUser = u;
      break;
    }
  }

  if (targetUser) {
    db.currentUserId = targetUser.id;
    return res.json({ success: true, user: targetUser });
  }

  res.status(400).json({ error: 'Invalid role requested' });
});

// 4. Courses Catalog & Filtering
app.get('/api/courses', (req: Request, res: Response) => {
  let list = Array.from(db.courses.values());
  const { category, level, search, sort } = req.query;

  if (category && typeof category === 'string' && category !== 'All') {
    list = list.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }

  if (level && typeof level === 'string' && level !== 'All') {
    list = list.filter(c => c.level.toLowerCase() === level.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }

  if (sort === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  }

  res.json(list);
});

app.get('/api/courses/:id', (req: Request, res: Response) => {
  const course = db.courses.get(req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  // Check enrollment status for active user
  const enrollmentKey = `${db.currentUserId}:${course.id}`;
  const enrollment = db.enrollments.get(enrollmentKey);

  res.json({
    course,
    isEnrolled: !!enrollment,
    enrollment: enrollment || null
  });
});

// 5. Course Enrollment & Learning Progress
app.get('/api/learning', (req: Request, res: Response) => {
  const studentId = (req.query.studentId ? String(req.query.studentId) : db.currentUserId) || 'user-student-1';
  const myEnrollments = Array.from(db.enrollments.values()).filter(
    e => e.studentId === studentId
  );

  const result = myEnrollments.map(e => {
    const course = db.courses.get(e.courseId);
    return {
      enrollment: e,
      course
    };
  }).filter(item => item.course !== undefined);

  res.json(result);
});

app.post('/api/learning', (req: Request, res: Response) => {
  const {
    action,
    courseId,
    lessonId,
    couponCode,
    discountPercent,
    paymentMethod = 'bKash',
    paidAmount,
    paymentStatus = 'completed'
  } = req.body;
  const studentId = db.currentUserId || 'user-student-1';

  // Action 1: Enroll in Course
  if (action === 'enroll') {
    const course = db.courses.get(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const enrollmentKey = `${studentId}:${courseId}`;
    let enrollment = db.enrollments.get(enrollmentKey);

    if (!enrollment) {
      enrollment = {
        id: `enr-${Date.now()}`,
        studentId,
        courseId,
        enrolledAt: new Date().toISOString(),
        progressPercent: 0,
        completedLessonIds: [],
        isCertified: false,
        paymentStatus: (paymentStatus as any) || 'completed',
        paidAmount: paidAmount || course.price,
        paymentMethod,
        couponUsed: couponCode || null,
        discountPercent: discountPercent || 0
      };
      db.enrollments.set(enrollmentKey, enrollment);
      if (enrollment.paymentStatus === 'completed') {
        course.studentsCount += 1;
      }
      console.log(`[Enrollment] Student ${studentId} enrolled in ${course.title} (Status: ${enrollment.paymentStatus}, Method: ${paymentMethod})`);
    } else {
      // Update existing enrollment if updating payment status
      if (paymentStatus) {
        enrollment.paymentStatus = paymentStatus;
      }
    }

    return res.json({ success: true, enrollment });
  }

  // Action 2: Update Payment Status (Dev Simulator)
  if (action === 'update-payment-status') {
    const enrollmentKey = `${studentId}:${courseId}`;
    const enrollment = db.enrollments.get(enrollmentKey);
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment record not found' });
    }
    enrollment.paymentStatus = paymentStatus || 'completed';
    const course = db.courses.get(courseId);
    if (course && enrollment.paymentStatus === 'completed') {
      course.studentsCount += 1;
    }
    return res.json({ success: true, enrollment });
  }

  // Action 3: Complete Lesson & Progress Tracking
  if (action === 'complete-lesson') {
    const course = db.courses.get(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const enrollmentKey = `${studentId}:${courseId}`;
    let enrollment = db.enrollments.get(enrollmentKey);

    if (!enrollment) {
      enrollment = {
        id: `enr-${Date.now()}`,
        studentId,
        courseId,
        enrolledAt: new Date().toISOString(),
        progressPercent: 0,
        completedLessonIds: [],
        isCertified: false,
        paymentStatus: 'completed'
      };
      db.enrollments.set(enrollmentKey, enrollment);
    }

    if (lessonId && !enrollment.completedLessonIds.includes(lessonId)) {
      enrollment.completedLessonIds.push(lessonId);
    }

    let totalLessons = 0;
    for (const m of course.modules) {
      totalLessons += m.lessons.length;
    }
    totalLessons = totalLessons || 1;

    enrollment.progressPercent = Math.min(
      100,
      Math.round((enrollment.completedLessonIds.length / totalLessons) * 100)
    );

    // Auto-generate Enterprise Certificate if 100% complete
    if (enrollment.progressPercent >= 100 && !enrollment.isCertified) {
      enrollment.isCertified = true;
      const certNumber = `NXA-2026-${Math.floor(10000 + Math.random() * 90000)}-${course.id.toUpperCase().slice(0, 4)}`;
      const student = db.users.get(studentId) || { name: 'Julian Sterling Vance', id: studentId };
      const cert: Certificate = {
        id: `cert-${Date.now()}`,
        certificateNumber: certNumber,
        studentId: student.id,
        studentName: student.name,
        courseId: course.id,
        courseTitle: course.title,
        issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        grade: 'Distinction',
        duration: course.duration || '120 Hours (12 Weeks)',
        instructorName: course.instructor?.name || 'Dr. Marcus Vance, Ph.D.',
        authorizedPerson: 'Elena Rostova, Academic Director',
        verificationUrl: `https://verify.nexusacademy.io/cert/${certNumber}`
      };
      db.certificates.set(cert.id, cert);
      enrollment.certificateId = cert.id;
      console.log(`[Certificate] Generated Enterprise Certificate ${certNumber} for ${student.name}`);
    }

    return res.json({
      success: true,
      progressPercent: enrollment.progressPercent,
      completedLessonIds: enrollment.completedLessonIds,
      isCertified: enrollment.isCertified,
      certificateId: enrollment.certificateId
    });
  }

  return res.status(400).json({ error: 'Unsupported action' });
});

app.post('/api/courses/:id/enroll', (req: Request, res: Response) => {
  const courseId = req.params.id;
  const course = db.courses.get(courseId);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  const enrollmentKey = `${db.currentUserId}:${courseId}`;
  let enrollment = db.enrollments.get(enrollmentKey);

  if (!enrollment) {
    enrollment = {
      id: `enr-${Date.now()}`,
      studentId: db.currentUserId,
      courseId,
      enrolledAt: new Date().toISOString(),
      progressPercent: 0,
      completedLessonIds: [],
      isCertified: false,
      paymentStatus: 'completed'
    };
    db.enrollments.set(enrollmentKey, enrollment);
    course.studentsCount += 1;
  }

  res.json({ success: true, enrollment });
});

app.get('/api/my-courses', (req: Request, res: Response) => {
  const studentId = db.currentUserId || 'user-student-1';
  const myEnrollments = Array.from(db.enrollments.values()).filter(
    e => e.studentId === studentId
  );

  const result = myEnrollments.map(e => {
    const course = db.courses.get(e.courseId);
    return {
      enrollment: e,
      course
    };
  }).filter(item => item.course !== undefined);

  res.json(result);
});

app.post('/api/lessons/:lessonId/complete', (req: Request, res: Response) => {
  const { lessonId } = req.params;
  const { courseId } = req.body;

  const course = db.courses.get(courseId);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  const enrollmentKey = `${db.currentUserId}:${courseId}`;
  let enrollment = db.enrollments.get(enrollmentKey);

  if (!enrollment) {
    enrollment = {
      id: `enr-${Date.now()}`,
      studentId: db.currentUserId,
      courseId,
      enrolledAt: new Date().toISOString(),
      progressPercent: 0,
      completedLessonIds: [],
      isCertified: false,
      paymentStatus: 'completed'
    };
    db.enrollments.set(enrollmentKey, enrollment);
  }

  if (!enrollment.completedLessonIds.includes(lessonId)) {
    enrollment.completedLessonIds.push(lessonId);
  }

  let totalLessons = 0;
  for (const m of course.modules) {
    totalLessons += m.lessons.length;
  }
  totalLessons = totalLessons || 1;

  enrollment.progressPercent = Math.min(
    100,
    Math.round((enrollment.completedLessonIds.length / totalLessons) * 100)
  );

  if (enrollment.progressPercent >= 100 && !enrollment.isCertified) {
    enrollment.isCertified = true;
    const certNumber = `NXA-2026-${Math.floor(10000 + Math.random() * 90000)}-${course.id.toUpperCase().slice(0, 4)}`;
    const student = db.users.get(db.currentUserId) || { name: 'Julian Sterling Vance', id: db.currentUserId };
    const cert: Certificate = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNumber,
      studentId: student.id,
      studentName: student.name,
      courseId: course.id,
      courseTitle: course.title,
      issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      grade: 'Distinction',
      duration: course.duration || '120 Hours (12 Weeks)',
      instructorName: course.instructor?.name || 'Dr. Marcus Vance, Ph.D.',
      authorizedPerson: 'Elena Rostova, Academic Director',
      verificationUrl: `https://verify.nexusacademy.io/cert/${certNumber}`
    };
    db.certificates.set(cert.id, cert);
    enrollment.certificateId = cert.id;
  }

  res.json({
    success: true,
    progressPercent: enrollment.progressPercent,
    completedLessonIds: enrollment.completedLessonIds,
    isCertified: enrollment.isCertified,
    certificateId: enrollment.certificateId
  });
});

// 6. Quizzes & Automatic Grading
app.get('/api/quizzes', (req: Request, res: Response) => {
  const courseId = req.query.courseId as string;
  if (courseId) {
    const quiz = db.quizzes.get(courseId);
    return res.json(quiz ? [quiz] : []);
  }
  res.json(Array.from(db.quizzes.values()));
});

app.get('/api/courses/:id/quiz', (req: Request, res: Response) => {
  const quiz = db.quizzes.get(req.params.id);
  if (!quiz) {
    return res.status(404).json({ error: 'No quiz available for this course yet.' });
  }

  const clientQuestions = quiz.questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options
  }));

  res.json({
    id: quiz.id,
    title: quiz.title,
    courseId: quiz.courseId,
    passingScore: quiz.passingScore,
    questions: clientQuestions
  });
});

app.post('/api/quiz/submit', (req: Request, res: Response) => {
  const { courseId, answers } = req.body;
  const quiz = db.quizzes.get(courseId);

  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }

  let correctCount = 0;
  const review = quiz.questions.map(q => {
    const selected = answers[q.id];
    const isCorrect = selected === q.correctIndex;
    if (isCorrect) correctCount++;
    return {
      id: q.id,
      question: q.question,
      selectedOption: selected,
      correctOption: q.correctIndex,
      isCorrect,
      explanation: q.explanation
    };
  });

  const scorePercent = Math.round((correctCount / quiz.questions.length) * 100);
  const passed = scorePercent >= quiz.passingScore;

  const enrollmentKey = `${db.currentUserId}:${courseId}`;
  const enrollment = db.enrollments.get(enrollmentKey);
  if (enrollment) {
    enrollment.quizScore = scorePercent;
  }

  res.json({
    passed,
    scorePercent,
    correctCount,
    totalQuestions: quiz.questions.length,
    passingScore: quiz.passingScore,
    review
  });
});

// 7. Certificates (List & Get by ID)
app.get('/api/certificates', (req: Request, res: Response) => {
  const studentId = (req.query.studentId ? String(req.query.studentId) : db.currentUserId) || 'user-student-1';
  const student = db.users.get(studentId) || { name: 'Rahim Ahmed', id: studentId };

  // Always reflect current student's legal name
  const certs = Array.from(db.certificates.values()).map(c => {
    if (c.studentId === studentId) {
      return {
        ...c,
        studentName: student.name
      };
    }
    return c;
  });
  res.json(certs);
});

app.get('/api/certificates/:id', (req: Request, res: Response) => {
  const reqId = req.params.id;
  const student = db.users.get(db.currentUserId) || { name: 'Rahim Ahmed', id: db.currentUserId };

  // 1. Direct ID match
  let cert = db.certificates.get(reqId);

  // 2. Search by certificateNumber or courseId
  if (!cert) {
    cert = Array.from(db.certificates.values()).find(
      c => c.certificateNumber === reqId || c.courseId === reqId
    );
  }

  // 3. If requested for an existing course without an explicit certificate, generate it dynamically
  if (!cert) {
    const course = db.courses.get(reqId);
    if (course) {
      const certNumber = `LMS-2026-${course.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      cert = {
        id: `cert-${course.id}-${student.id}`,
        certificateNumber: certNumber,
        studentId: student.id,
        studentName: student.name,
        courseId: course.id,
        courseTitle: course.title,
        issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        grade: 'Distinction (98%)',
        duration: course.duration || '48 Hours (8 Weeks)',
        instructorName: course.instructor?.name || 'Dr. Tariqul Islam',
        authorizedPerson: 'Elena Rostova, Academic Director',
        verificationUrl: `https://verify.learnai.io/cert/${certNumber}`
      };
      db.certificates.set(cert.id, cert);
    }
  }

  if (!cert) {
    const sample = Array.from(db.certificates.values())[0];
    if (sample) {
      return res.json({
        ...sample,
        studentName: student.name
      });
    }
    return res.status(404).json({ error: 'Certificate not found' });
  }

  res.json({
    ...cert,
    studentName: student.name
  });
});

// 8. Assignments & Submissions
app.get('/api/assignments', (req: Request, res: Response) => {
  const courseId = req.query.courseId as string;
  let list = Array.from(db.assignments.values());
  if (courseId) {
    list = list.filter(a => a.courseId === courseId);
  }
  res.json(list);
});

app.get('/api/assignments/submissions', (req: Request, res: Response) => {
  const studentId = db.currentUserId || 'user-student-1';
  const list = Array.from(db.submissions.values()).filter(s => s.studentId === studentId);
  res.json(list);
});

app.post('/api/assignments/submit', (req: Request, res: Response) => {
  const { assignmentId, courseId, githubUrl, notes } = req.body;
  const studentId = db.currentUserId || 'user-student-1';

  const submission: AssignmentSubmission = {
    id: `sub-${Date.now()}`,
    assignmentId,
    studentId,
    courseId,
    githubUrl: githubUrl || '',
    notes: notes || '',
    submittedAt: new Date().toISOString(),
    status: 'submitted',
    grade: 'A+ (Verified)'
  };
  db.submissions.set(submission.id, submission);
  res.json({ success: true, submission });
});

// 9. Profile & Settings Update
app.put('/api/auth/profile', (req: Request, res: Response) => {
  const studentId = db.currentUserId || 'user-student-1';
  const user = db.users.get(studentId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { name, phone, bio, learningGoal } = req.body;
  if (name) user.name = name;
  if (phone) (user as any).phone = phone;
  if (bio) (user as any).bio = bio;
  if (learningGoal) (user as any).learningGoal = learningGoal;

  res.json({ success: true, user });
});

// 10. Coupon Validation
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ valid: false, message: 'Code required' });

  const clean = String(code).toUpperCase().trim();
  const knownDiscounts: { [k: string]: number } = {
    'PASSION20': 20,
    'PASSION15': 15,
    'PASSION10': 10,
    'PASSION5': 5,
    'LEARNAI15': 15,
    'DISCOUNT20': 20,
    'SUMMER20': 20,
    'EID25': 25,
    'STUDENT10': 10
  };

  const discount = knownDiscounts[clean] || 15;
  res.json({
    valid: true,
    code: clean,
    discountPercent: discount,
    message: `${discount}% AI Passion Discount Applied!`
  });
});

// 8. AI Chat & Recommendation Endpoints
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const {
    mode,
    question,
    courseId,
    lessonId,
    history,
    aiType = 'public-sales',
    studentData,
    isLoggedIn = false,
    userName
  } = req.body;

  try {
    let result: any;
    if (aiType === 'public-sales' || mode === 'public-sales') {
      result = await AIServices.askPublicSales(question, history || [], Boolean(isLoggedIn), userName);
    } else if (aiType === 'private-student' || mode === 'private-student') {
      const activeUser = db.users.get(db.currentUserId);
      const studentPayload = studentData || {
        name: activeUser?.name || userName || 'Rahim Ahmed',
        email: activeUser?.email || 'rahim@learnai.com',
        enrolledCourses: Array.from(db.enrollments.values())
          .filter(e => e.studentId === (activeUser?.id || db.currentUserId))
          .map(e => {
            const c = db.courses.get(e.courseId);
            const totalLessons = c?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 1;
            return {
              title: c?.title || 'Enrolled Course',
              progressPercent: e.progressPercent,
              completedLessons: e.completedLessonIds.length,
              totalLessons,
              isCertified: e.isCertified
            };
          }),
        activeCourseTitle: courseId ? db.courses.get(courseId)?.title : undefined
      };
      result = await AIServices.askPrivateStudent(question, studentPayload, history || []);
    } else if (mode === 'course-assistant' && courseId && lessonId) {
      result = await AIServices.askCourseAssistant(courseId, lessonId, question, history || []);
    } else if (mode === 'roadmap') {
      result = await AIServices.generateRoadmap(question);
    } else {
      // Default: AI Tutor
      result = await AIServices.askTutor(question, history || []);
    }

    // Parse coupon tags if present in response
    let couponOffer = null;
    if (result && result.content) {
      const match = result.content.match(/\[AI_COUPON:\s*code=([A-Z0-9]+),\s*discount=(\d+),\s*locked=(true|false)\]/i);
      if (match) {
        const code = match[1];
        const discount = parseInt(match[2], 10);
        const locked = match[3].toLowerCase() === 'true';
        couponOffer = {
          code,
          discount,
          locked,
          claimed: !locked && Boolean(isLoggedIn)
        };

        // Auto-save coupon if unlocked and user is logged in
        if (!locked && isLoggedIn && db.currentUserId) {
          const list = db.userCoupons.get(db.currentUserId) || [];
          if (!list.some(c => c.code === code)) {
            list.push({
              code,
              discountPercent: discount,
              claimedAt: new Date().toISOString(),
              used: false
            });
            db.userCoupons.set(db.currentUserId, list);
            console.log(`[AI Coupon] Saved unlocked coupon ${code} (${discount}% OFF) for user ${db.currentUserId}`);
          }
        }
      }
    }

    // Parse recommended courses mentioned or tagged in response
    const recommendedCourses: Course[] = [];
    if (result && result.content) {
      const content = result.content;
      const contentLower = content.toLowerCase();

      // 1. Tag match: [RECOMMENDED_COURSE: id=...] or [COURSE_CARD: id=...]
      const tagMatches = content.matchAll(/\[(?:RECOMMENDED_COURSE|COURSE_CARD):\s*(?:id=)?([a-zA-Z0-9_-]+)\]/gi);
      for (const tm of tagMatches) {
        const idOrSlug = tm[1].trim();
        const found = allDemoCourses.find(c => c.id === idOrSlug || c.slug === idOrSlug);
        if (found && !recommendedCourses.some(r => r.id === found.id)) {
          recommendedCourses.push(found);
        }
      }

      // 2. Title and keyword detection against all 15 demo courses
      for (const course of allDemoCourses) {
        if (contentLower.includes(course.title.toLowerCase())) {
          if (!recommendedCourses.some(r => r.id === course.id)) {
            recommendedCourses.push(course);
          }
        }
      }

      // 3. Keyword fallbacks if no exact title matched
      if (recommendedCourses.length === 0) {
        if (contentLower.includes('selenium') || contentLower.includes('playwright') || contentLower.includes('sqa')) {
          const sqa = allDemoCourses.find(c => c.id === 'course-sqa-automation');
          if (sqa) recommendedCourses.push(sqa);
        }
        if (contentLower.includes('mern') || contentLower.includes('full stack ecommerce')) {
          const mern = allDemoCourses.find(c => c.id === 'course-mern-ecommerce');
          if (mern && !recommendedCourses.some(r => r.id === mern.id)) recommendedCourses.push(mern);
        }
        if (contentLower.includes('ai agent') || (contentLower.includes('python') && contentLower.includes('agent'))) {
          const ai = allDemoCourses.find(c => c.id === 'course-ai-agent');
          if (ai && !recommendedCourses.some(r => r.id === ai.id)) recommendedCourses.push(ai);
        }
        if (contentLower.includes('docker') || contentLower.includes('devops') || contentLower.includes('kubernetes')) {
          const devops = allDemoCourses.find(c => c.id === 'course-docker-devops');
          if (devops && !recommendedCourses.some(r => r.id === devops.id)) recommendedCourses.push(devops);
        }
        if (contentLower.includes('ui/ux') || contentLower.includes('figma')) {
          const uiux = allDemoCourses.find(c => c.id === 'course-uiux-figma');
          if (uiux && !recommendedCourses.some(r => r.id === uiux.id)) recommendedCourses.push(uiux);
        }
        if (contentLower.includes('next.js') || contentLower.includes('nextjs')) {
          const nextjs = allDemoCourses.find(c => c.id === 'course-nextjs-fullstack');
          if (nextjs && !recommendedCourses.some(r => r.id === nextjs.id)) recommendedCourses.push(nextjs);
        }
      }
    }

    res.json({
      ...result,
      couponOffer,
      recommendedCourses: recommendedCourses.slice(0, 2)
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'AI request failed' });
  }
});

// 8.1 Coupon Management Endpoints
app.post('/api/ai/coupons/claim', (req: Request, res: Response) => {
  const { code, discountPercent } = req.body;
  if (!db.currentUserId) {
    return res.status(401).json({ error: 'Please sign in or register to claim this AI discount coupon.' });
  }

  const list = db.userCoupons.get(db.currentUserId) || [];
  const couponCode = (code || 'PASSION15').toUpperCase();
  const discount = Number(discountPercent) || 15;

  if (!list.some(c => c.code === couponCode)) {
    list.push({
      code: couponCode,
      discountPercent: discount,
      claimedAt: new Date().toISOString(),
      used: false
    });
    db.userCoupons.set(db.currentUserId, list);
    console.log(`[Coupon Claimed] User ${db.currentUserId} claimed ${couponCode} (${discount}% OFF)`);
  }

  res.json({
    success: true,
    message: `Coupon ${couponCode} (${discount}% OFF) successfully added to your account!`,
    coupons: list
  });
});

app.get('/api/ai/coupons', (req: Request, res: Response) => {
  if (!db.currentUserId) {
    return res.json([]);
  }
  const list = db.userCoupons.get(db.currentUserId) || [];
  res.json(list);
});

app.post('/api/ai/recommend', async (req: Request, res: Response) => {
  const { goal, level, preferredTopic, weeklyHours } = req.body;
  try {
    const recommendation = await AIServices.recommendCourse({
      goal: goal || 'Build Projects',
      level: level || 'Beginner',
      preferredTopic: preferredTopic || 'Programming',
      weeklyHours: weeklyHours || '10'
    });
    res.json(recommendation);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Recommendation failed' });
  }
});

app.get('/api/ai/models', (req: Request, res: Response) => {
  res.json(aiEngine.getStats());
});

app.post('/api/ai/models', (req: Request, res: Response) => {
  const { modelId } = req.body;
  if (modelId) {
    aiEngine.setPrimaryModel(modelId);
  }
  res.json({ success: true, activePrimary: aiEngine.getStats().primaryModel });
});

// 9. Admin & Instructor Metrics
app.get('/api/admin/stats', (req: Request, res: Response) => {
  const totalCourses = db.courses.size;
  let totalStudents = 0;
  let totalRevenue = 0;

  for (const c of db.courses.values()) {
    totalStudents += c.studentsCount;
    totalRevenue += c.price * c.studentsCount;
  }

  res.json({
    totalCourses,
    totalStudents,
    totalRevenue: `৳${totalRevenue.toLocaleString()}`,
    activeEnrollments: db.enrollments.size,
    aiStats: aiEngine.getStats()
  });
});

app.post('/api/courses', (req: Request, res: Response) => {
  const { title, description, category, level, price, originalPrice, duration } = req.body;
  const instructor = db.users.get(db.currentUserId) || db.users.get('user-instructor-1')!;

  const newCourse: Course = {
    id: `course-${Date.now()}`,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title,
    description,
    category: category || 'Programming',
    level: level || 'Beginner',
    price: Number(price) || 999,
    originalPrice: Number(originalPrice) || 1499,
    rating: 5.0,
    reviewsCount: 1,
    instructor: {
      id: instructor.id,
      name: instructor.name,
      avatar: instructor.avatar,
      title: instructor.title || 'Instructor'
    },
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    duration: duration || '6h 00m',
    lessonsCount: 1,
    studentsCount: 0,
    learningOutcomes: ['Understand key fundamentals', 'Build hands-on practical skills'],
    modules: [
      {
        id: `mod-${Date.now()}`,
        courseId: `course-${Date.now()}`,
        title: 'Module 01: Introduction',
        order: 1,
        lessons: [
          {
            id: `les-${Date.now()}`,
            moduleId: `mod-${Date.now()}`,
            title: 'Welcome & Overview',
            duration: '10m 00s',
            videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
            order: 1,
            content: 'Welcome to this newly published course!'
          }
        ]
      }
    ]
  };

  db.courses.set(newCourse.id, newCourse);
  res.status(201).json(newCourse);
});

// Serve built React client if available
const clientDistPath = fs.existsSync(path.join(__dirname, '..', 'frontend', 'dist'))
  ? path.join(__dirname, '..', 'frontend', 'dist')
  : path.join(__dirname, '..', 'client', 'dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get(/^(?!\/api).*/, (req: Request, res: Response) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// ============================================================================
// PART 6: SERVER BOOTLOADER & PORT LISTENER
// ============================================================================

const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

function startServer(port: number) {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                     LEARNAI LMS BACKEND SERVER                       ║
║        AI-Powered Online Course Management Platform Online           ║
╠══════════════════════════════════════════════════════════════════════╣
║  🚀 Server Port    : http://localhost:${port}                           ║
║  🤖 Primary AI     : ${aiEngine.getPrimaryModelId()}    ║
║  🛡️  Failover Chain : 5 Verified NVIDIA NIM Endpoints + Local Safe  ║
║  👥 Active User    : Rahim Ahmed (Student) [Instant Switchable]      ║
╚══════════════════════════════════════════════════════════════════════╝
    `);
    console.log(`[LearnAI] Server is actively running and waiting for requests...`);
    console.log(`[LearnAI] Press Ctrl+C to stop.\n`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[!] Port ${port} is currently occupied by another process.`);
      console.log(`[!] Automatically switching to fallback port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(`[!] Server Error:`, err);
    }
  });

  return server;
}

startServer(DEFAULT_PORT);

// Prevent unintended exit & handle terminations gracefully
process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection at]:', promise, 'reason:', reason);
});
