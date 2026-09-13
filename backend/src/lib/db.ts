import { allDemoCourses } from './coursesData';

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
  passingScore: number;
  questions: QuizQuestion[];
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  points: number;
  description: string;
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
}

export class DatabaseStore {
  public users: Map<string, User> = new Map();
  public courses: Map<string, Course> = new Map();
  public quizzes: Map<string, Quiz> = new Map();
  public assignments: Map<string, Assignment> = new Map();
  public enrollments: Map<string, Enrollment> = new Map();
  public certificates: Map<string, Certificate> = new Map();
  public currentUserId: string = 'user-student-1';

  constructor() {
    this.seedData();
  }

  private seedData() {
    const studentUser: User = {
      id: 'user-student-1',
      name: 'Rahim Ahmed',
      email: 'rahim@learnai.com',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      title: 'Computer Science Diploma Student',
      bio: 'Aspiring Full Stack & AI Software Engineer.'
    };

    const instructorUser: User = {
      id: 'user-instructor-1',
      name: 'Dr. Tariqul Islam',
      email: 'tariqul@learnai.com',
      role: 'instructor',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      title: 'Senior Software Architect & Instructor',
      bio: '12+ years experience in Software Engineering and Artificial Intelligence.'
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

    const coursePython: Course = {
      id: 'course-python-101',
      slug: 'python-programming-masterclass',
      title: 'Python Programming Masterclass',
      description: 'Master Python fundamentals, OOP, data structures, and real-world projects with interactive AI assistance.',
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
        'Understand Python syntax, data types, and logical flow',
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
              content: `### Welcome to Python Masterclass\nSetting up Python 3.11+, virtual environments, and writing your first script.`
            },
            {
              id: 'les-py-102',
              moduleId: 'mod-py-1',
              title: 'Variables, Data Types & Control Flow',
              duration: '18m 15s',
              videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8',
              order: 2,
              content: `### Variables & Control Flow\nIntegers, Floats, Strings, conditionals, and loops.`
            },
            {
              id: 'les-py-103',
              moduleId: 'mod-py-1',
              title: 'Functions & Clean Modular Code',
              duration: '22m 00s',
              videoUrl: 'https://www.youtube.com/embed/9Os0o3wzS_I',
              order: 3,
              content: `### Defining Functions\nParameters, return values, and modular script design.`
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
              content: `### Classes & Constructors\nObject modeling, attributes, and __init__ methods.`
            },
            {
              id: 'les-py-202',
              moduleId: 'mod-py-2',
              title: 'Inheritance & Polymorphism',
              duration: '20m 45s',
              videoUrl: 'https://www.youtube.com/embed/RSl87lqOXDE',
              order: 5,
              content: `### Inheritance\nExtending classes, method overriding, and super().`
            },
            {
              id: 'les-py-203',
              moduleId: 'mod-py-2',
              title: 'Capstone Project: CLI Banking System',
              duration: '35m 00s',
              videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
              order: 6,
              content: `### Capstone Banking Project\nBuilding a real-world console application with account management.`
            }
          ]
        }
      ]
    };

    const courseWeb: Course = {
      id: 'course-web-201',
      slug: 'fullstack-web-dev',
      title: 'Modern Full-Stack Web Development (React & Node.js)',
      description: 'Build production-ready web applications using React, TypeScript, Node.js, and Astryx design principles.',
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
        'Design RESTful backend APIs with Next.js and Express',
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
              content: `### React Architecture\nComponents, props, state, and rendering cycles.`
            },
            {
              id: 'les-web-102',
              moduleId: 'mod-web-1',
              title: 'Custom Hooks & State Management',
              duration: '24m 10s',
              videoUrl: 'https://www.youtube.com/embed/0ZJgIjIuY7U',
              order: 2,
              content: `### Custom Hooks\nReusable logic for fetching, session management, and UI state.`
            }
          ]
        }
      ]
    };

    const courseAI: Course = {
      id: 'course-ai-301',
      slug: 'practical-ai-data-science',
      title: 'Practical AI & Data Science with Machine Learning',
      description: 'Hands-on guide to Python for Data Science, Scikit-Learn, and integrating Large Language Models (LLMs) with NVIDIA NIM.',
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
        'Connecting LLMs with NVIDIA NIM and Prompt Engineering',
        'Deploying AI predictive models into production web interfaces'
      ],
      modules: [
        {
          id: 'mod-ai-1',
          courseId: 'course-ai-301',
          title: 'Module 01: Machine Learning & LLMs',
          order: 1,
          lessons: [
            {
              id: 'les-ai-101',
              moduleId: 'mod-ai-1',
              title: 'Connecting LLMs with NVIDIA NIM Endpoints',
              duration: '34m 00s',
              videoUrl: 'https://www.youtube.com/embed/2TJxpyO3ei4',
              order: 1,
              content: `### Integrating NVIDIA NIM\nCalling Nemotron and Llama models with OpenAI-compatible clients and failover cascades.`
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
              content: `### Docker Basics\nBuilding images, managing containers, and multi-stage builds.`
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

    // Seed Quiz
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
          explanation: '__init__ is Python constructor method for initializing new object instances.'
        },
        {
          id: 'q3',
          question: 'Which keyword accesses methods and properties of a parent class?',
          options: ['parent()', 'this()', 'super()', 'base()'],
          correctIndex: 2,
          explanation: 'super() delegates method calls to the parent or sibling class.'
        }
      ]
    };
    this.quizzes.set(pythonQuiz.courseId, pythonQuiz);

    // Seed Assignment
    const pythonAssignment: Assignment = {
      id: 'asg-py-1',
      courseId: coursePython.id,
      title: 'Assignment 01: Design a Student Record Management Class',
      dueDate: '2026-04-15',
      points: 100,
      description: 'Implement a Student class with attributes for name, id, and grades list. Write methods to add grade, calculate GPA, and export to JSON.'
    };
    this.assignments.set(pythonAssignment.id, pythonAssignment);

    // Seed Initial Enrollment for Student Rahim
    const initialEnrollment: Enrollment = {
      id: 'enr-rahim-py-1',
      studentId: studentUser.id,
      courseId: coursePython.id,
      enrolledAt: '2026-03-01T10:00:00Z',
      progressPercent: 33,
      completedLessonIds: ['les-py-101', 'les-py-102'],
      isCertified: false
    };
    this.enrollments.set(`${studentUser.id}:${coursePython.id}`, initialEnrollment);
  }
}

// Global Singleton for Next.js hot-reload persistence
const globalForDb = globalThis as unknown as { dbInstance?: DatabaseStore };
export const db = globalForDb.dbInstance || new DatabaseStore();
if (process.env.NODE_ENV !== 'production') globalForDb.dbInstance = db;
