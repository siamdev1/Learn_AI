import fs from 'fs';
import path from 'path';

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

function loadNvidiaApiKey(): string {
  if (process.env.NVIDIA_API_KEY && process.env.NVIDIA_API_KEY.trim()) {
    return process.env.NVIDIA_API_KEY.trim();
  }

  const possiblePaths = [
    path.join(process.cwd(), '..', 'NVIDIA AI MODEL testing', '.nvidia_key'),
    path.join(process.cwd(), '..', '.nvidia_key'),
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

  return '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';
}

const NVIDIA_API_KEY = loadNvidiaApiKey();
const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

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
      return true;
    }
    return false;
  }

  public getStats() {
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter(t => now - t < 60000);
    const activeCooldowns = Array.from(this.modelCooldowns.entries())
      .filter(([_, until]) => until > now)
      .map(([id]) => id);

    return {
      primaryModel: this.primaryModelId,
      currentRpm: this.requestTimestamps.length,
      maxRpmLimit: 40,
      activeCooldowns,
      ...this.stats,
      availableModels: AVAILABLE_MODELS
    };
  }

  public async generateChat(messages: Array<{ role: string; content: string }>, customPrimary?: string): Promise<{
    content: string;
    modelUsed: string;
    failoverOccurred: boolean;
    failoverTrail: string[];
    responseTimeMs?: number;
    autoPromotedToPrimary?: boolean;
  }> {
    this.stats.totalCalls++;

    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter(t => now - t < 60000);
    this.requestTimestamps.push(now);

    const startModelId = customPrimary || this.primaryModelId;

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

    const modelChain = eligibleModels.length > 0 ? [...eligibleModels, ...inCooldown] : fullChain;
    const failoverTrail: string[] = [];

    for (let i = 0; i < modelChain.length; i++) {
      const modelId = modelChain[i];
      const startTime = Date.now();
      try {
        const responseText = await this.callNvidiaAPI(modelId, messages);
        const durationMs = Date.now() - startTime;
        
        this.stats.successfulCalls++;
        const failoverOccurred = i > 0;
        if (failoverOccurred) {
          this.stats.failoversCount++;
          this.stats.lastFailoverAt = new Date().toISOString();
        }

        // Auto-promote any model that responds in < 15s to become the new Primary Model
        const previousPrimary = this.primaryModelId;
        let autoPromoted = false;
        if (durationMs < 15000 && this.primaryModelId !== modelId) {
          this.setPrimaryModelId(modelId);
          autoPromoted = true;
          console.log(`⚡ [Speed Promotion] Model ${modelId} responded in ${(durationMs / 1000).toFixed(2)}s (<15s). Auto-promoted to PRIMARY!`);
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

        if (errorMsg.includes('TIMEOUT_15S') || errorMsg.includes('aborted') || durationMs >= 14500) {
          this.modelCooldowns.set(modelId, Date.now() + 30000);
          failoverTrail.push(`${modelId} timed out (>15s), auto-switched`);
        } else if (errorMsg.includes('429') || errorMsg.toLowerCase().includes('rate limit') || errorMsg.toLowerCase().includes('quota')) {
          this.stats.rateLimitTrips++;
          this.modelCooldowns.set(modelId, Date.now() + 30000);
          failoverTrail.push(`${modelId} rate-limited (429), auto-switched`);
        } else {
          this.modelCooldowns.set(modelId, Date.now() + 20000);
          failoverTrail.push(`${modelId} failed (${errorMsg})`);
        }
      }
    }

    // Fallback if all offline
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
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const query = lastUserMessage.toLowerCase();

    if (query.includes('python') || query.includes('variable') || query.includes('loop')) {
      return `### 🐍 Python Core Concepts\n\nIn Python, variables are dynamically typed and initialized when assigned:\n\n\`\`\`python\nuser_name = "Rahim"\nscore = 95\nis_active = True\n\ndef calculate_grade(points):\n    if points >= 90:\n        return "A+"\n    return "A"\n\nprint(f"Student {user_name} Grade: {calculate_grade(score)}")\n\`\`\`\n\nKeep functions modular, use snake_case for variables, and maintain clean indentation.`;
    }

    if (query.includes('planner') || query.includes('schedule') || query.includes('week') || query.includes('routine')) {
      return `To create the most effective weekly planner for you, I have designed a **Universal Template** that balances productivity with well-being. 

Since I don't know your specific schedule yet, I have provided a **structured markdown template** below. You can copy this into any notes app, or you can print it out.

---

# 📅 Weekly Master Planner
**Goal of the Week:** *[e.g., Finish Project X, Exercise 4 times, Read 1 book]*

| Time | Mon | Tue | Wed | Thu | Fri | Sat | Sun |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **07:00** | 🌅 Morning Routine | Morning Routine | Morning Routine | Morning Routine | Morning Routine | Sleep In | Sleep In |
| **08:00** | Deep Work | Deep Work | Deep Work | Deep Work | Deep Work | Breakfast | Breakfast |
| **09:00** | Study Blocks | Study Blocks | Study Blocks | Study Blocks | Study Blocks | Activity/Hobby | Reflection |
| **10:00** | Code Labs | Code Labs | Code Labs | Code Labs | Code Labs | Free Time | Meal Prep |
| **11:00** | Review Session | Review Session | Review Session | Review Session | Review Session | Reading | Chill |
| **12:00** | 🥪 Lunch | 🥪 Lunch | 🥪 Lunch | 🥪 Lunch | 🥪 Lunch | 🥗 Out | 🥗 Family |
| **13:00** | Project Work | Project Work | Project Work | Project Work | Project Work | Walk | Nap |
| **14:00** | Astryx Design | Astryx Design | Astryx Design | Astryx Design | Astryx Design | Gaming | Music |
| **15:00** | AI Models | AI Models | AI Models | AI Models | AI Models | Social | Outdoor |
| **16:00** | Q&A / Review | Q&A / Review | Q&A / Review | Q&A / Review | Q&A / Review | Coffee | Coffee |
| **17:00** | Wrap Down | Wrap Down | Wrap Down | Wrap Down | Wrap Down | Relax | Relax |
| **18:00** | 🥗 Dinner | 🥗 Dinner | 🥗 Dinner | 🥗 Dinner | 🥗 Dinner | 🍕 Pizza | 🥗 Early |
| **19:00** | Personal Time | Personal Time | Personal Time | Personal Time | Social Night | Movie | Plan Week |
| **20:00** | Reading | Reading | Reading | Reading | Leisure | Reading | Early Bed |

---

### 🎯 Top 3 Priorities (The "Must-Dos")
1. Complete diploma Capstone module assignment
2. Review NVIDIA NIM rate-limiting MoE architecture
3. Practice React Astryx component design patterns

### ✅ Secondary Task List
* [ ] Push latest git branch to repository
* [ ] Test 40 RPM failover cascading fallback
* [ ] Verify certificate issuance pipeline

### 💧 Habit & Health Tracker
* **Water:** 💧 💧 💧 💧 💧 💧 💧
* **Exercise:** M T W T F S S 
* **Sleep (7h):** [ ]

---

## 💡 Master AI Tutor Pro-Tips for Success:
1.  **Eat the Frog:** Do your hardest, most dreaded task first thing in the "Deep Work" block while your energy is highest.
2.  **Time Batching:** Group similar tasks together (e.g., answer all emails at 2:00 PM) to avoid "context switching."
3.  **The 80/20 Rule:** Focus on the 20% of tasks that will yield 80% of your results.

---

**Would you like me to customize this for a specific role?** 
Tell me:
* Are you a **student, professional, or entrepreneur**?
* What are your **main goals** for this week?
* Do you have **fixed commitments** (like classes or shifts)?`;
    }

    if (query.includes('roadmap') || query.includes('career') || query.includes('month') || query.includes('web')) {
      return `### 🚀 6-Month Full Stack Learning Roadmap\n\n1. **Month 1: Fundamentals** — HTML5, CSS3, Flexbox, Grid & Modern JS (ES6+).\n2. **Month 2: Frontend Architecture** — React, Component Lifecycle, Hooks & Astryx UI.\n3. **Month 3: Backend Services** — Node.js, Next.js API Routes & Middleware.\n4. **Month 4: Database Mastery** — PostgreSQL/SQLite, Schema Design & ORM.\n5. **Month 5: AI & Integration** — LLM APIs, Prompt Engineering & RAG.\n6. **Month 6: Capstone Project** — Full production deployment, CI/CD & Presentation.`;
    }

    return `Hello! I am your **LearnAI Educational Assistant**.\n\nI can explain programming concepts, assist with course lessons, and generate tailored study roadmaps for your career goals.`;
  }
}

export const aiEngine = new AIEngine();
