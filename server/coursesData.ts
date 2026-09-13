import { Course } from './server';

export const allDemoCourses: Course[] = [
  // 01. SQA Automation Testing with Selenium & Playwright
  {
    id: 'course-sqa-automation',
    slug: 'sqa-automation-testing-selenium-playwright',
    title: 'SQA Automation Testing with Selenium & Playwright',
    description: 'এই কোর্সে Selenium ও Playwright ব্যবহার করে modern web application-এর automated testing শেখানো হবে। Test case design, browser automation, debugging এবং scalable automation workflow সম্পর্কে practical দক্ষতা তৈরি হবে।',
    fullDescription: 'Manual testing থেকে automation-এর দিকে যেতে চাইলে test case design, browser automation, debugging এবং scalable automation workflow সম্পর্কে practical ধারণা তৈরি হবে। Industry-standard automation framework তৈরি থেকে শুরু করে CI/CD integration পর্যন্ত hands-on প্র্যাকটিস করানো হবে।',
    category: 'Web Development',
    level: 'Beginner → Advanced',
    price: 1890,
    originalPrice: 2999,
    rating: 4.9,
    reviewsCount: 1420,
    instructor: {
      id: 'inst-hridoy',
      name: 'Hridoy Das',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: 'Lead Software Engineer (Automation)',
      role: 'Lead Software Engineer (Automation), Mir Info Systems Limited',
      bio: '8+ years of software testing automation experience across global fintech and enterprise cloud platforms.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
    duration: '7 Hours',
    lessonsCount: 9,
    studentsCount: 7900,
    certificate: true,
    learningOutcomes: [
      'Software testing fundamentals & QA lifecycle',
      'Automation testing concepts and strategy design',
      'Selenium WebDriver architecture & browser driver management',
      'Element locating strategies (XPath, CSS Selectors, Text)',
      'Robust test case design and execution pipelines',
      'Playwright fundamentals & modern fast headless execution',
      'Automated browser testing across Chrome, Firefox & WebKit',
      'Test debugging, tracing, screenshots & video recording',
      'Regression testing concepts in Agile workflows',
      'Maintainable automation structure (Page Object Model - POM)',
      'Real-world continuous testing workflow with CI/CD'
    ],
    projects: [
      'End-to-End E-Commerce Automation Framework (Selenium + TestNG)',
      'Modern Multi-Tab Fast Browser Suite with Playwright',
      'Automated Form Validation & Dynamic Data Grid Test Runner'
    ],
    requirements: [
      'Basic understanding of manual software testing or programming fundamentals',
      'Computer with Windows, macOS, or Linux and Chrome browser installed',
      'Passion for QA quality assurance and automation engineering'
    ],
    suitableFor: [
      'Beginner QA learners & Computer Science students',
      'Manual testers wanting to switch to Automation QA',
      'Software engineers wanting reliable automated testing',
      'SQA engineers looking for Playwright & Selenium mastery',
      'Automation testing career seekers in Bangladesh & Global Market'
    ],
    tags: ['SQA', 'Selenium', 'Playwright', 'Automation Testing', 'QA', 'Software Testing'],
    modules: [
      {
        id: 'mod-sqa-1',
        courseId: 'course-sqa-automation',
        title: 'Module 01: Introduction to Software Testing & Automation Fundamentals',
        order: 1,
        lessons: [
          {
            id: 'les-sqa-101',
            moduleId: 'mod-sqa-1',
            title: 'Software Testing Fundamentals & QA Lifecycle',
            duration: '45m 00s',
            videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
            order: 1,
            content: 'Understand the QA mindset, bug lifecycle, and why automation is essential for modern web applications.'
          },
          {
            id: 'les-sqa-102',
            moduleId: 'mod-sqa-1',
            title: 'Automation Testing Fundamentals & When to Automate',
            duration: '40m 00s',
            videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8',
            order: 2,
            content: 'Cost-benefit analysis of automation vs manual testing, ROI calculation, and test suite planning.'
          }
        ]
      },
      {
        id: 'mod-sqa-2',
        courseId: 'course-sqa-automation',
        title: 'Module 02: Selenium Setup & WebDriver Architecture',
        order: 2,
        lessons: [
          {
            id: 'les-sqa-201',
            moduleId: 'mod-sqa-2',
            title: 'Selenium Setup & WebDriver Initialization',
            duration: '50m 00s',
            videoUrl: 'https://www.youtube.com/embed/9Os0o3wzS_I',
            order: 3,
            content: 'Configuring Java/Python environment, browser drivers, and launching your first automated browser instance.'
          },
          {
            id: 'les-sqa-202',
            moduleId: 'mod-sqa-2',
            title: 'Locators & Web Elements (XPath & CSS Selectors)',
            duration: '55m 00s',
            videoUrl: 'https://www.youtube.com/embed/JeznW_7DlB0',
            order: 4,
            content: 'Absolute vs relative XPath, dynamic text matching, dropdowns, radio buttons, and checkbox automation.'
          },
          {
            id: 'les-sqa-203',
            moduleId: 'mod-sqa-2',
            title: 'Test Case Automation & Assertions',
            duration: '48m 00s',
            videoUrl: 'https://www.youtube.com/embed/RSl87lqOXDE',
            order: 5,
            content: 'Writing unit test assertions, handling timeouts, explicit waits, and implicit waits.'
          }
        ]
      },
      {
        id: 'mod-sqa-3',
        courseId: 'course-sqa-automation',
        title: 'Module 03: Playwright Modern Automation & Real-World Capstone',
        order: 3,
        lessons: [
          {
            id: 'les-sqa-301',
            moduleId: 'mod-sqa-3',
            title: 'Playwright Introduction & Zero-Config Setup',
            duration: '45m 00s',
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            order: 6,
            content: 'Discover why Playwright is dominating modern testing: auto-waiting, parallel execution, and built-in tracing.'
          },
          {
            id: 'les-sqa-302',
            moduleId: 'mod-sqa-3',
            title: 'Advanced Browser Automation & API Interception',
            duration: '52m 00s',
            videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8',
            order: 7,
            content: 'Mocking network responses, multi-tab contexts, file upload automation, and mobile emulation.'
          },
          {
            id: 'les-sqa-303',
            moduleId: 'mod-sqa-3',
            title: 'Real-World Automation Project & Reporting',
            duration: '60m 00s',
            videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
            order: 8,
            content: 'Complete end-to-end e-commerce automation with HTML test reports and GitHub Actions integration.'
          }
        ]
      }
    ]
  },

  // 02. UX Leadership: Become a 10X Product Designer
  {
    id: 'course-ux-leadership',
    slug: 'ux-leadership-become-a-10x-product-designer',
    title: 'UX Leadership: Become a 10X Product Designer',
    description: 'একজন UI/UX designer থেকে product-focused designer এবং future design leader হওয়ার জন্য এই course-এর focus হবে UX thinking, product design, user research, design process এবং leadership।',
    fullDescription: 'Course শেষে learner একটি product-এর UX problem identify করে research → wireframe → prototype → design system → final design পর্যন্ত যেতে পারবে। Design team lead করা ও stakeholder alignment শেখানো হবে।',
    category: 'Design',
    level: 'Beginner → Advanced',
    price: 1575,
    originalPrice: 2500,
    rating: 4.8,
    reviewsCount: 980,
    instructor: {
      id: 'inst-tushar',
      name: 'S M Aliuzzaman Tushar',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      title: 'Lead Product Designer & UX Strategist',
      role: 'Lead Product Designer, Design Leadership Consultant',
      bio: '10+ years shaping digital products, design systems, and cross-functional teams.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU',
    duration: '41 Hours',
    lessonsCount: 31,
    studentsCount: 3890,
    certificate: true,
    learningOutcomes: [
      'UX fundamentals & human-centered cognitive psychology',
      'User-centered design thinking and discovery workflows',
      'Qualitative & quantitative user research methodologies',
      'User persona building & actionable customer journey mapping',
      'Information architecture (IA) & navigation hierarchy design',
      'Figma wireframing, component tokens, & interactive prototyping',
      'Scalable design systems with auto-layout and component variants',
      'Product thinking & ROI alignment for business stakeholders',
      'Design decision making, UX strategy, & team leadership'
    ],
    projects: [
      'Full Fintech Mobile Banking UX Case Study (Research to Prototype)',
      'Enterprise SaaS Design System in Figma with 150+ Components',
      'Conversion-Optimized E-Commerce Checkout Experience Overhaul'
    ],
    requirements: [
      'Basic familiarity with Figma or design software is helpful but not required',
      'A computer with modern web browser to run Figma',
      'Curiosity about user behavior and digital product strategy'
    ],
    suitableFor: [
      'UI/UX Designers wanting to step into Product Leadership',
      'Graphic Designers switching to Digital Product Design',
      'Product Managers & Founders wanting design mastery',
      'Creative individuals eager to build real-world Figma portfolios'
    ],
    tags: ['UX', 'UI Design', 'Product Design', 'Figma', 'UX Research', 'Design Leadership'],
    modules: [
      {
        id: 'mod-ux-1',
        courseId: 'course-ux-leadership',
        title: 'Module 01: UX Foundation & Understanding Users',
        order: 1,
        lessons: [
          { id: 'les-ux-1', moduleId: 'mod-ux-1', title: 'UX Philosophy & Mental Models', duration: '45m', videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU', order: 1, content: 'Core UX heuristics and user expectations.' },
          { id: 'les-ux-2', moduleId: 'mod-ux-1', title: 'User Research & Interviewing Techniques', duration: '55m', videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU', order: 2, content: 'Conducting empathy interviews and surveys.' },
          { id: 'les-ux-3', moduleId: 'mod-ux-1', title: 'Persona & Journey Mapping Workshop', duration: '50m', videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU', order: 3, content: 'Synthesizing pain points into journey maps.' }
        ]
      },
      {
        id: 'mod-ux-2',
        courseId: 'course-ux-leadership',
        title: 'Module 02: Information Architecture & Design Systems in Figma',
        order: 2,
        lessons: [
          { id: 'les-ux-4', moduleId: 'mod-ux-2', title: 'Information Architecture & Sitemap Hierarchy', duration: '40m', videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU', order: 4, content: 'Structuring navigation for cognitive ease.' },
          { id: 'les-ux-5', moduleId: 'mod-ux-2', title: 'Wireframing & Low-Fidelity Prototyping', duration: '60m', videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU', order: 5, content: 'Rapid visual iteration before high-fidelity.' },
          { id: 'les-ux-6', moduleId: 'mod-ux-2', title: 'Building Scalable Figma Design Systems', duration: '75m', videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU', order: 6, content: 'Tokens, typography scales, color palettes, and auto-layout.' }
        ]
      },
      {
        id: 'mod-ux-3',
        courseId: 'course-ux-leadership',
        title: 'Module 03: Product Strategy & Design Leadership',
        order: 3,
        lessons: [
          { id: 'les-ux-7', moduleId: 'mod-ux-3', title: 'Product Thinking & Design Metrics (HEART Framework)', duration: '50m', videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU', order: 7, content: 'Aligning UX metrics with business revenue.' },
          { id: 'les-ux-8', moduleId: 'mod-ux-3', title: 'Presenting to Stakeholders & Leading Teams', duration: '45m', videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU', order: 8, content: 'Pitching design decisions with confidence.' }
        ]
      }
    ]
  },

  // 03. Complete Full Stack Ecommerce Project Development with MERN
  {
    id: 'course-mern-ecommerce',
    slug: 'complete-full-stack-ecommerce-development-mern',
    title: 'Complete Full Stack Ecommerce Project Development with MERN',
    description: 'MERN Stack ব্যবহার করে একটি complete e-commerce application তৈরি করার মাধ্যমে frontend, backend, database, authentication এবং API integration শেখানো হবে।',
    fullDescription: 'Production-ready e-commerce platform built from ground up. Features include user registration, authentication, product catalogue, search, filters, shopping cart, checkout, payment gateway integration, order tracking, and a powerful admin management dashboard.',
    category: 'Web Development',
    level: 'Beginner → Advanced',
    price: 1575,
    originalPrice: 2500,
    rating: 4.9,
    reviewsCount: 1650,
    instructor: {
      id: 'inst-tariqul',
      name: 'Dr. Tariqul Islam',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      title: 'Principal Full Stack Architect & Tech Lead',
      role: 'Principal Full Stack Architect, 12+ Years Experience',
      bio: 'Architected multiple enterprise SaaS platforms using MERN, Next.js and distributed cloud systems.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M',
    duration: '18 Hours',
    lessonsCount: 226,
    studentsCount: 1750,
    certificate: true,
    learningOutcomes: [
      'MongoDB database design, Mongoose schemas, and aggregation pipelines',
      'Express.js backend routing, middleware, and error handling',
      'React.js modern component architecture, hooks, and context API',
      'Node.js runtime server architecture and RESTful API standards',
      'Secure JWT authentication, password hashing, and cookie sessions',
      'Shopping cart state management and checkout workflow',
      'Admin dashboard with role-based access control (RBAC)',
      'Order management, invoice generation, and status updates',
      'Full-stack cloud deployment on Vercel, Render, and MongoDB Atlas'
    ],
    projects: [
      'Full-Stack E-Commerce Platform with Admin Panel & Payment Gateway',
      'Real-time Inventory Tracker & Stock Notification Service',
      'Customer Review & Rating System with Verified Buyer Badges'
    ],
    requirements: [
      'Basic knowledge of HTML, CSS, and modern JavaScript (ES6+)',
      'Node.js installed on your computer',
      'Enthusiasm for full-stack software development'
    ],
    suitableFor: [
      'Aspiring Full-Stack Developers wanting a job-winning portfolio project',
      'Frontend developers transitioning to full-stack engineering',
      'Computer science diploma & university students preparing for viva',
      'Entrepreneurs wanting to build custom e-commerce applications'
    ],
    tags: ['MERN', 'React', 'Node.js', 'MongoDB', 'Express', 'Ecommerce', 'Full Stack'],
    modules: [
      {
        id: 'mod-mern-1',
        courseId: 'course-mern-ecommerce',
        title: 'Module 01: MERN Stack Architecture & Backend API Setup',
        order: 1,
        lessons: [
          { id: 'les-m-1', moduleId: 'mod-mern-1', title: 'Node & Express Setup with TypeScript/ESM', duration: '35m', videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M', order: 1, content: 'Server boilerplate and environment configurations.' },
          { id: 'les-m-2', moduleId: 'mod-mern-1', title: 'MongoDB Atlas Connection & Schema Modeling', duration: '45m', videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M', order: 2, content: 'Creating Product, User, and Order models.' },
          { id: 'les-m-3', moduleId: 'mod-mern-1', title: 'JWT Authentication & Role Middleware', duration: '50m', videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M', order: 3, content: 'Protecting admin routes and customer sessions.' }
        ]
      },
      {
        id: 'mod-mern-2',
        courseId: 'course-mern-ecommerce',
        title: 'Module 02: React Client & Dynamic Storefront',
        order: 2,
        lessons: [
          { id: 'les-m-4', moduleId: 'mod-mern-2', title: 'React Storefront UI with Modern Cards & Filters', duration: '55m', videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M', order: 4, content: 'Category filtering, search debouncing, and pagination.' },
          { id: 'les-m-5', moduleId: 'mod-mern-2', title: 'Cart Management, LocalStorage & Checkout Flow', duration: '60m', videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M', order: 5, content: 'Managing quantities, tax calculations, and shipping.' },
          { id: 'les-m-6', moduleId: 'mod-mern-2', title: 'Admin Panel: Product CRUD & Order Status Management', duration: '65m', videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M', order: 6, content: 'Creating, updating, and deleting products with image upload.' }
        ]
      }
    ]
  },

  // 04. DSA with JavaScript
  {
    id: 'course-dsa-javascript',
    slug: 'dsa-with-javascript',
    title: 'DSA with JavaScript',
    description: 'JavaScript ব্যবহার করে Data Structures & Algorithms শেখার জন্য এই course। Problem-solving skill এবং technical interview preparation-এর জন্য গুরুত্বপূর্ণ concepts cover করা হবে।',
    fullDescription: 'Learner JavaScript দিয়ে algorithmic problem solve এবং coding interview-এর জন্য structured approach তৈরি করতে পারবে। Big O notation, Linked Lists, Trees, Graphs, Sorting, Searching এবং LeetCode-style problem solving হাতে-কলমে শেখানো হবে।',
    category: 'Web Development',
    level: 'Beginner → Advanced',
    price: 1575,
    originalPrice: 2500,
    rating: 4.8,
    reviewsCount: 890,
    instructor: {
      id: 'inst-fahim',
      name: 'Fahim Ahmed',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      title: 'Senior Algorithms Engineer',
      role: 'Senior Algorithms Engineer & Competitive Programmer',
      bio: 'Solved 1500+ problems on LeetCode/Codeforces; trained hundreds of software engineers for FAANG interviews.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://www.youtube.com/embed/8hly31xKli0',
    duration: '33 Hours',
    lessonsCount: 28,
    studentsCount: 1750,
    certificate: true,
    learningOutcomes: [
      'Algorithm complexity analysis & Big O (Time & Space)',
      'Primitive vs Reference memory management in JavaScript',
      'Arrays, Strings manipulation, and Hash Tables implementation',
      'Singly & Doubly Linked Lists with pointer mechanics',
      'Stack & Queue implementation (LIFO vs FIFO patterns)',
      'Trees, Binary Search Trees (BST), and Tree Traversals (BFS & DFS)',
      'Graph representations (Adjacency Matrix & List) & Dijkstra algorithm',
      'Recursion mechanics, Call Stack visualization, and Backtracking',
      'Sorting algorithms (Merge Sort, Quick Sort, Bubble Sort) & Binary Search',
      'Interview-style problem solving patterns (Two Pointers, Sliding Window)'
    ],
    projects: [
      'Custom JavaScript In-Memory Database with BST Indexing',
      'Shortest Path Visualizer using Graph Algorithms',
      'LeetCode Top 50 Essential JavaScript Problem Solutions'
    ],
    requirements: [
      'Basic knowledge of JavaScript (variables, functions, loops, arrays)',
      'Curiosity for problem solving and analytical thinking'
    ],
    suitableFor: [
      'JavaScript & Frontend developers preparing for technical interviews',
      'Computer Science students aiming for competitive programming foundation',
      'Developers wanting to write optimized, high-performance code'
    ],
    tags: ['DSA', 'JavaScript', 'Algorithms', 'Data Structures', 'Problem Solving', 'Coding Interview'],
    modules: [
      {
        id: 'mod-dsa-1',
        courseId: 'course-dsa-javascript',
        title: 'Module 01: Complexity Analysis & Core Data Structures',
        order: 1,
        lessons: [
          { id: 'les-dsa-1', moduleId: 'mod-dsa-1', title: 'Big O Notation: Time & Space Complexity', duration: '40m', videoUrl: 'https://www.youtube.com/embed/8hly31xKli0', order: 1, content: 'Understanding O(1), O(n), O(log n), and O(n^2).' },
          { id: 'les-dsa-2', moduleId: 'mod-dsa-1', title: 'Arrays & String Optimization Patterns', duration: '50m', videoUrl: 'https://www.youtube.com/embed/8hly31xKli0', order: 2, content: 'Two Pointers and Sliding Window techniques.' },
          { id: 'les-dsa-3', moduleId: 'mod-dsa-1', title: 'Hash Tables & Collision Resolution', duration: '45m', videoUrl: 'https://www.youtube.com/embed/8hly31xKli0', order: 3, content: 'Custom hash function implementation in JavaScript.' }
        ]
      },
      {
        id: 'mod-dsa-2',
        courseId: 'course-dsa-javascript',
        title: 'Module 02: Trees, Graphs & Recursion',
        order: 2,
        lessons: [
          { id: 'les-dsa-4', moduleId: 'mod-dsa-2', title: 'Linked Lists & Pointer Manipulation', duration: '55m', videoUrl: 'https://www.youtube.com/embed/8hly31xKli0', order: 4, content: 'Reverse linked list, detect cycles, and fast-slow pointers.' },
          { id: 'les-dsa-5', moduleId: 'mod-dsa-2', title: 'Binary Search Trees & Traversal (BFS / DFS)', duration: '60m', videoUrl: 'https://www.youtube.com/embed/8hly31xKli0', order: 5, content: 'In-order, Pre-order, and Post-order recursive traversals.' },
          { id: 'les-dsa-6', moduleId: 'mod-dsa-2', title: 'Graphs & Shortest Path Algorithms', duration: '65m', videoUrl: 'https://www.youtube.com/embed/8hly31xKli0', order: 6, content: 'Breadth-First Search on graphs and cycle detection.' }
        ]
      }
    ]
  },

  // 05. Mastering Product Management
  {
    id: 'course-product-management',
    slug: 'mastering-product-management',
    title: 'Mastering Product Management',
    description: 'Product idea থেকে successful product তৈরি করার complete product-management workflow শেখানো হবে। Product discovery, customer research, roadmap, MVP এবং metrics mastery।',
    fullDescription: 'Become a high-impact Product Manager capable of driving 0 to 1 and growth stages. Understand customer needs, write PRDs, manage sprint roadmaps, measure conversion funnels, and align engineering with business goals.',
    category: 'Design',
    level: 'Beginner → Advanced',
    price: 1575,
    originalPrice: 2500,
    rating: 4.8,
    reviewsCount: 1120,
    instructor: {
      id: 'inst-pm-team',
      name: 'S M Aliuzzaman Tushar & Shadman Rahman',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      title: 'Head of Product & Senior Growth Strategist',
      role: 'Product Leadership at Leading Tech Scaleups',
      bio: 'Scaled products from 0 to 1M+ active users across South Asia and international markets.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://www.youtube.com/embed/G2P6cI1N3jA',
    duration: '37 Hours',
    lessonsCount: 30,
    studentsCount: 3890,
    certificate: true,
    learningOutcomes: [
      'Product management fundamentals & the PM role definition',
      'Customer discovery & qualitative problem validation',
      'Market sizing (TAM, SAM, SOM) & competitor analysis',
      'Product strategy formulation & vision mapping',
      'MVP scoping, feature prioritization frameworks (RICE, MoSCoW)',
      'User stories, acceptance criteria & PRD document writing',
      'North Star Metric & actionable business analytics (AARRR Funnel)',
      'Stakeholder alignment across engineering, design & sales',
      'Go-to-market (GTM) launch strategy and post-launch optimization'
    ],
    projects: [
      'End-to-End Product Requirement Document (PRD) for a Ride-Sharing Feature',
      'Interactive Product Roadmap in Jira / Notion',
      'Cohort Retention & Funnel Analytics Dashboard Design'
    ],
    requirements: [
      'No prior technical coding background needed',
      'Interest in business strategy, user experience, and product development'
    ],
    suitableFor: [
      'Aspiring Product Managers & Associate PMs',
      'Software engineers and designers transitioning into Product Management',
      'Entrepreneurs and founders building technology startups'
    ],
    tags: ['Product Management', 'Product Strategy', 'MVP', 'Product Manager', 'Startup'],
    modules: [
      {
        id: 'mod-pm-1',
        courseId: 'course-product-management',
        title: 'Module 01: Product Discovery & Strategy Validation',
        order: 1,
        lessons: [
          { id: 'les-pm-1', moduleId: 'mod-pm-1', title: 'The Role of Product Manager in 2026', duration: '40m', videoUrl: 'https://www.youtube.com/embed/G2P6cI1N3jA', order: 1, content: 'Balancing User Needs, Tech Feasibility, and Business Viability.' },
          { id: 'les-pm-2', moduleId: 'mod-pm-1', title: 'Customer Discovery & Problem Interviews', duration: '50m', videoUrl: 'https://www.youtube.com/embed/G2P6cI1N3jA', order: 2, content: 'Avoiding confirmation bias and finding true pain points.' }
        ]
      },
      {
        id: 'mod-pm-2',
        courseId: 'course-product-management',
        title: 'Module 02: Execution, Roadmapping & Metrics',
        order: 2,
        lessons: [
          { id: 'les-pm-3', moduleId: 'mod-pm-2', title: 'Writing Crisp PRDs and Agile User Stories', duration: '55m', videoUrl: 'https://www.youtube.com/embed/G2P6cI1N3jA', order: 3, content: 'Defining scope, edge cases, and acceptance criteria.' },
          { id: 'les-pm-4', moduleId: 'mod-pm-2', title: 'Product Analytics: Tracking Funnels & Retention', duration: '60m', videoUrl: 'https://www.youtube.com/embed/G2P6cI1N3jA', order: 4, content: 'Using Amplitude/Mixpanel to identify user drop-offs.' }
        ]
      }
    ]
  },

  // 06. Machine Learning Mastery 2026
  {
    id: 'course-machine-learning-2026',
    slug: 'machine-learning-mastery-2026',
    title: 'Machine Learning Mastery 2026',
    description: 'Python জানা learners-দের জন্য machine learning-এর fundamental থেকে বিভিন্ন supervised, unsupervised এবং introductory neural-network/NLP concepts শেখানোর course।',
    fullDescription: 'Master modern Machine Learning algorithms with Python, Scikit-Learn, Pandas, and NumPy. Cover 12 hands-on modules including feature scaling, regression, classification, support vector machines, clustering, and neural networks with real-life projects.',
    category: 'Artificial Intelligence',
    level: 'Beginner → Advanced',
    price: 1890,
    originalPrice: 2999,
    rating: 4.8,
    reviewsCount: 1350,
    instructor: {
      id: 'inst-sunny',
      name: 'MD. Arif Istiake Sunny',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: 'Lead Data Scientist & ML Researcher',
      role: 'Lead Data Scientist, AI Research Fellow',
      bio: 'Published ML researcher with 7+ years of experience training industrial predictive models.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://www.youtube.com/embed/i_LwzRVP7bg',
    duration: '10 Hours',
    lessonsCount: 12,
    studentsCount: 3900,
    certificate: true,
    learningOutcomes: [
      'Machine learning lifecycle and pipeline architecture',
      'Data preprocessing, feature scaling & transformation techniques',
      'Linear regression, loss functions & outlier detection',
      'Feature engineering, one-hot encoding & categorical handling',
      'Logistic regression & binary classification metrics (ROC-AUC)',
      'K-Nearest Neighbors (KNN) classifier and distance metrics',
      'Support Vector Machines (SVM) with linear & RBF kernels',
      'K-Means clustering & unsupervised pattern recognition',
      'Naive Bayes probabilistic classification for text/spam detection',
      'Introduction to artificial neural networks and forward propagation',
      'NLP fundamentals: tokenization, TF-IDF, and sentiment analysis'
    ],
    projects: [
      'Real-Life Housing Price Prediction Engine using Linear Regression',
      'Customer Churn Prediction Model with Logistic Regression & SVM',
      'Unsupervised Customer Segmentation using K-Means Clustering'
    ],
    requirements: [
      'Basic Python programming knowledge (syntax, loops, functions)',
      'High school level mathematics and curiosity for data science'
    ],
    suitableFor: [
      'Python developers transitioning into Machine Learning & Data Science',
      'Engineering and CS students aiming for AI research and industry roles',
      'Professionals wanting to build predictive models from real tabular data'
    ],
    tags: ['Machine Learning', 'Python', 'AI', 'Data Science', 'ML Algorithms', 'NLP'],
    modules: [
      {
        id: 'mod-ml-1',
        courseId: 'course-machine-learning-2026',
        title: 'Module 01: ML Fundamentals, Metrics & Feature Engineering',
        order: 1,
        lessons: [
          { id: 'les-ml-1', moduleId: 'mod-ml-1', title: 'Introduction to Machine Learning & Evaluation Metrics', duration: '50m', videoUrl: 'https://www.youtube.com/embed/i_LwzRVP7bg', order: 1, content: 'Accuracy, Precision, Recall, F1 Score, and Confusion Matrix.' },
          { id: 'les-ml-2', moduleId: 'mod-ml-1', title: 'Feature Scaling & Data Transformation', duration: '45m', videoUrl: 'https://www.youtube.com/embed/i_LwzRVP7bg', order: 2, content: 'StandardScaler, MinMaxScaler, and handling missing data.' },
          { id: 'les-ml-3', moduleId: 'mod-ml-1', title: 'Feature Engineering & Categorical Encoding', duration: '48m', videoUrl: 'https://www.youtube.com/embed/i_LwzRVP7bg', order: 3, content: 'One-hot encoding, Label encoding, and feature extraction.' }
        ]
      },
      {
        id: 'mod-ml-2',
        courseId: 'course-machine-learning-2026',
        title: 'Module 02: Supervised & Unsupervised Classifiers',
        order: 2,
        lessons: [
          { id: 'les-ml-4', moduleId: 'mod-ml-2', title: 'Linear & Logistic Regression with Outlier Detection', duration: '55m', videoUrl: 'https://www.youtube.com/embed/i_LwzRVP7bg', order: 4, content: 'Gradient descent, cost functions, and decision boundaries.' },
          { id: 'les-ml-5', moduleId: 'mod-ml-2', title: 'KNN Classifier & Support Vector Machines (SVM)', duration: '50m', videoUrl: 'https://www.youtube.com/embed/i_LwzRVP7bg', order: 5, content: 'Finding optimal decision hyperplanes and kernel tricks.' },
          { id: 'les-ml-6', moduleId: 'mod-ml-2', title: 'K-Means Clustering & Naive Bayes Classifier', duration: '52m', videoUrl: 'https://www.youtube.com/embed/i_LwzRVP7bg', order: 6, content: 'Elbow method for clusters and Bayes theorem in action.' }
        ]
      },
      {
        id: 'mod-ml-3',
        courseId: 'course-machine-learning-2026',
        title: 'Module 03: Neural Networks & NLP Foundations',
        order: 3,
        lessons: [
          { id: 'les-ml-7', moduleId: 'mod-ml-3', title: 'Introduction to Neural Networks & Perceptrons', duration: '60m', videoUrl: 'https://www.youtube.com/embed/i_LwzRVP7bg', order: 7, content: 'Neurons, activation functions, and weights optimization.' },
          { id: 'les-ml-8', moduleId: 'mod-ml-3', title: 'Introduction to NLP & Text Processing Applications', duration: '55m', videoUrl: 'https://www.youtube.com/embed/i_LwzRVP7bg', order: 8, content: 'Building a spam detection classifier with Scikit-learn.' }
        ]
      }
    ]
  },

  // 07. Applied NLP & LLM Engineering 2026
  {
    id: 'course-nlp-llm-engineering',
    slug: 'applied-nlp-llm-engineering-2026',
    title: 'Applied NLP & LLM Engineering 2026',
    description: 'Modern NLP এবং Large Language Model engineering-এর practical concepts শেখানোর course। Transformers, embeddings, prompt design, fine-tuning ও production workflows।',
    fullDescription: 'Build next-generation LLM applications. Learn transformer self-attention mechanisms, vector embeddings, prompt engineering, LoRA/QLoRA fine-tuning, and model evaluation for production reliability.',
    category: 'Artificial Intelligence',
    level: 'Intermediate → Advanced',
    price: 1890,
    originalPrice: 2800,
    rating: 5.0,
    reviewsCount: 1840,
    instructor: {
      id: 'inst-tahmid',
      name: 'Tahmid Rahman',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      title: 'AI/NLP Staff Engineer',
      role: 'Staff AI Engineer, Generative AI Pioneer',
      bio: 'Pioneered enterprise LLM deployments and automated knowledge systems for Fortune 500 companies.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://www.youtube.com/embed/zjkBMFhNj_g',
    duration: '7 Hours',
    lessonsCount: 6,
    studentsCount: 4900,
    certificate: true,
    learningOutcomes: [
      'Modern NLP fundamentals & tokenization mechanisms',
      'Transformer architecture & multi-head self-attention mechanisms',
      'Vector embeddings and semantic latent space understanding',
      'LLM inference optimization & prompt engineering design patterns',
      'Parameter-Efficient Fine-Tuning (PEFT, LoRA & QLoRA)',
      'LLM application development with structured outputs',
      'Model evaluation (BLEU, ROUGE, LLM-as-a-Judge)',
      'Production deployment considerations & inference cost management'
    ],
    projects: [
      'Custom LoRA Fine-Tuned Domain LLM on Open Source Weights',
      'Production Semantic Search & Document Summarizer API'
    ],
    requirements: [
      'Intermediate Python proficiency and familiarity with ML concepts',
      'Google Colab or GPU access (free tier Colab works)'
    ],
    suitableFor: [
      'AI Engineers wanting hands-on LLM architecture mastery',
      'Data Scientists transitioning from traditional ML to GenAI',
      'Backend developers building intelligent LLM-powered services'
    ],
    tags: ['NLP', 'LLM', 'Transformers', 'AI', 'Fine-Tuning', 'Generative AI'],
    modules: [
      {
        id: 'mod-nlp-1',
        courseId: 'course-nlp-llm-engineering',
        title: 'Module 01: Transformers & LLM Architecture',
        order: 1,
        lessons: [
          { id: 'les-nlp-1', moduleId: 'mod-nlp-1', title: 'Transformers Architecture & Self-Attention Explained', duration: '60m', videoUrl: 'https://www.youtube.com/embed/zjkBMFhNj_g', order: 1, content: 'Positional encoding, query, key, value matrix operations.' },
          { id: 'les-nlp-2', moduleId: 'mod-nlp-1', title: 'Vector Embeddings & Semantic Search Pipelines', duration: '50m', videoUrl: 'https://www.youtube.com/embed/zjkBMFhNj_g', order: 2, content: 'Generating and storing high-dimensional text vectors.' }
        ]
      },
      {
        id: 'mod-nlp-2',
        courseId: 'course-nlp-llm-engineering',
        title: 'Module 02: Fine-Tuning & Production LLM Deployment',
        order: 2,
        lessons: [
          { id: 'les-nlp-3', moduleId: 'mod-nlp-2', title: 'PEFT & LoRA Fine-Tuning on Custom Datasets', duration: '75m', videoUrl: 'https://www.youtube.com/embed/zjkBMFhNj_g', order: 3, content: 'Adapting Llama/Mistral weights on domain data.' },
          { id: 'les-nlp-4', moduleId: 'mod-nlp-2', title: 'Production Considerations & LLM Evaluation', duration: '55m', videoUrl: 'https://www.youtube.com/embed/zjkBMFhNj_g', order: 4, content: 'Measuring latency, throughput, hallucinations, and safety.' }
        ]
      }
    ]
  },

  // 08. AI Tools Complete Course
  {
    id: 'course-ai-tools-complete',
    slug: 'ai-tools-complete-course',
    title: 'AI Tools Complete Course',
    description: 'একটি course-এর মাধ্যমে বিভিন্ন popular AI tools ব্যবহার করে productivity, content creation, research, design এবং automation-এর কাজ করার practical workflow শেখানো হবে।',
    fullDescription: 'Supercharge your daily workflow using modern AI tools: ChatGPT, Claude, Gemini, and NotebookLM. Learn structured prompt writing, document analysis, automated research, creative content generation, and business use cases.',
    category: 'Artificial Intelligence',
    level: 'Beginner',
    price: 1920,
    originalPrice: 2500,
    rating: 4.9,
    reviewsCount: 1210,
    instructor: {
      id: 'inst-shourov',
      name: 'Shourov Barua',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      title: 'AI Content & Automation Specialist',
      role: 'AI Content Strategist, 500K+ Community Leader',
      bio: 'Trained over 50,000 professionals on utilizing generative AI for personal productivity.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://www.youtube.com/embed/2eWuYf-aZE4',
    duration: '6 Hours',
    lessonsCount: 32,
    studentsCount: 3000,
    certificate: true,
    learningOutcomes: [
      'Mastering ChatGPT: Advanced reasoning, custom GPTs & Canvas',
      'Claude 3.5 Sonnet: Artifacts, long-context analysis & clean coding',
      'Google Gemini: Multimodal image, video & audio reasoning',
      'Google NotebookLM: AI source-grounded research & audio overviews',
      'Effective prompt writing techniques for consistent results',
      'Document analysis: Summarizing 200+ page PDFs in seconds',
      'AI productivity: Automated email, reports & spreadsheet analysis',
      'Creative AI usage for marketing copy, presentations & graphics',
      'Real-world business use cases and ROI optimization'
    ],
    projects: [
      'NotebookLM Automated Research Brief from 10 Research Papers',
      'Custom ChatGPT Productivity Agent for Daily Task Scheduling',
      'Multimodal Product Description & Social Media Campaign Suite'
    ],
    requirements: [
      'No technical programming background required',
      'Free account on ChatGPT, Claude, or Google Gemini'
    ],
    suitableFor: [
      'Students, freelancers, and professionals looking to 10x productivity',
      'Content creators, writers, marketers, and business owners',
      'Anyone curious about how to practically use modern AI tools'
    ],
    tags: ['ChatGPT', 'Claude', 'Gemini', 'NotebookLM', 'AI Tools', 'Prompting'],
    modules: [
      {
        id: 'mod-ait-1',
        courseId: 'course-ai-tools-complete',
        title: 'Module 01: ChatGPT, Claude & Gemini Mastery',
        order: 1,
        lessons: [
          { id: 'les-ait-1', moduleId: 'mod-ait-1', title: 'ChatGPT Pro Workflows & Custom GPTs', duration: '45m', videoUrl: 'https://www.youtube.com/embed/2eWuYf-aZE4', order: 1, content: 'Canvas editor, voice mode, and memory personalization.' },
          { id: 'les-ait-2', moduleId: 'mod-ait-1', title: 'Claude 3.5 Artifacts for Design & Development', duration: '40m', videoUrl: 'https://www.youtube.com/embed/2eWuYf-aZE4', order: 2, content: 'Creating live interactive widgets and technical writing.' },
          { id: 'les-ait-3', moduleId: 'mod-ait-1', title: 'Google Gemini Multimodal Capabilities', duration: '35m', videoUrl: 'https://www.youtube.com/embed/2eWuYf-aZE4', order: 3, content: 'Analyzing images, YouTube videos, and Google Workspace integration.' }
        ]
      },
      {
        id: 'mod-ait-2',
        courseId: 'course-ai-tools-complete',
        title: 'Module 02: NotebookLM & Advanced Productivity',
        order: 2,
        lessons: [
          { id: 'les-ait-4', moduleId: 'mod-ait-2', title: 'NotebookLM: Grounded Research & Audio Podcasts', duration: '50m', videoUrl: 'https://www.youtube.com/embed/2eWuYf-aZE4', order: 4, content: 'Zero hallucination research on private notes and source PDFs.' },
          { id: 'les-ait-5', moduleId: 'mod-ait-2', title: 'Automating Daily Business & Study Tasks', duration: '45m', videoUrl: 'https://www.youtube.com/embed/2eWuYf-aZE4', order: 5, content: 'From idea to polished presentation in under 15 minutes.' }
        ]
      }
    ]
  },

  // 09. AI দিয়ে Automation
  {
    id: 'course-ai-automation-bengali',
    slug: 'ai-diye-automation',
    title: 'AI দিয়ে Automation',
    description: 'AI ব্যবহার করে repetitive কাজ কমানো এবং automated workflow তৈরি করার basic ধারণা শেখানোর short practical course।',
    fullDescription: 'Learn how to automate daily repetitive business and personal tasks with AI. Build automated content pipelines, customer response workflows, and data processing systems without writing complex code.',
    category: 'AI & Automation',
    level: 'Beginner',
    price: 1920,
    originalPrice: 2500,
    rating: 5.0,
    reviewsCount: 1560,
    instructor: {
      id: 'inst-shourov-2',
      name: 'Shourov Barua',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      title: 'AI Workflow Specialist',
      role: 'Lead Automation Strategist',
      bio: 'Specialist in no-code business automation and generative workflow systems.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://www.youtube.com/embed/H14bBuluwB8',
    duration: '1 Hour',
    lessonsCount: 7,
    studentsCount: 4900,
    certificate: true,
    learningOutcomes: [
      'Automation কী এবং কীভাবে আধুনিক ব্যবসা দ্রুতগতি পায়',
      'AI automation fundamentals & trigger-action logic',
      'Workflow design patterns for personal and business efficiency',
      'Integrating AI tools into daily spreadsheets and email accounts',
      'Eliminating repetitive task bottlenecks in 3 simple steps',
      'Connecting webhook triggers with AI response generators',
      'Measuring time and cost savings from AI automated pipelines'
    ],
    projects: [
      'Automated Content Generation & Social Media Scheduler',
      'AI-Powered Incoming Email Task Summarizer',
      'Simple Small Business Customer Inquiry Auto-Responder'
    ],
    requirements: [
      'No prior programming or automation experience needed',
      'Internet connection and a computer/laptop'
    ],
    suitableFor: [
      'Business owners wanting to save employee hours',
      'Freelancers wanting to automate client reporting',
      'Beginners wanting to understand automation without coding'
    ],
    tags: ['AI Automation', 'Automation', 'AI', 'Workflow', 'Productivity'],
    modules: [
      {
        id: 'mod-aiau-1',
        courseId: 'course-ai-automation-bengali',
        title: 'Module 01: Automation Fundamentals & Tool Integration',
        order: 1,
        lessons: [
          { id: 'les-aiau-1', moduleId: 'mod-aiau-1', title: 'Introduction to AI Automation & Core Concepts', duration: '15m', videoUrl: 'https://www.youtube.com/embed/H14bBuluwB8', order: 1, content: 'Understanding Triggers, Actions, and AI decision logic.' },
          { id: 'les-aiau-2', moduleId: 'mod-aiau-1', title: 'Hands-on Automated Content & Task Processing Workflow', duration: '25m', videoUrl: 'https://www.youtube.com/embed/H14bBuluwB8', order: 2, content: 'Connecting forms to AI to generate automated document outputs.' },
          { id: 'les-aiau-3', moduleId: 'mod-aiau-1', title: 'Building a Simple Business Auto-Responder', duration: '20m', videoUrl: 'https://www.youtube.com/embed/H14bBuluwB8', order: 3, content: 'Automating responses to frequent queries with high quality.' }
        ]
      }
    ]
  },

  // 10. Prompt Engineering + Masterpack
  {
    id: 'course-prompt-engineering',
    slug: 'prompt-engineering-plus-masterpack',
    title: 'Prompt Engineering + Masterpack',
    description: 'Generative AI থেকে ভালো এবং consistent output পাওয়ার জন্য prompt engineering-এর practical techniques শেখানো হবে। Reusable prompt masterpack অন্তর্ভুক্ত।',
    fullDescription: 'Stop getting generic AI answers. Master context engineering, few-shot prompting, system role instructions, chain-of-thought, and structured JSON output. Comes with 100+ battle-tested reusable prompt templates.',
    category: 'AI & Automation',
    level: 'Beginner → Intermediate',
    price: 1920,
    originalPrice: 2500,
    rating: 4.9,
    reviewsCount: 1780,
    instructor: {
      id: 'inst-shourov-3',
      name: 'Shourov Barua',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      title: 'Prompt Systems Architect',
      role: 'Prompt Systems Specialist',
      bio: 'Creator of the Masterpack library used by thousands of creative professionals worldwide.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://www.youtube.com/embed/jC4v5AS4RIM',
    duration: '1 Hour',
    lessonsCount: 7,
    studentsCount: 4900,
    certificate: true,
    learningOutcomes: [
      'Prompt engineering fundamentals & how LLMs parse instructions',
      'Writing razor-sharp directives with zero ambiguity',
      'Context engineering: Supplying relevant facts without token bloat',
      'Role prompting & persona calibration for distinct outputs',
      'Few-shot prompting: Teaching the model through high-quality examples',
      'Enforcing structured outputs (JSON, Markdown Tables, YAML)',
      'Prompt optimization & minimizing hallucinations',
      'AI workflow prompting for multi-step reasoning',
      'Full access to the curated Prompt Masterpack template library'
    ],
    projects: [
      'Custom Persona System Prompt for Technical Code Reviews',
      'Multi-Shot Data Extraction Prompt that outputs strict JSON schemas',
      'Automated Copywriting Prompt Funnel with Brand Tone Consistency'
    ],
    requirements: [
      'Familiarity with accessing ChatGPT, Claude, or any modern LLM',
      'No programming background needed'
    ],
    suitableFor: [
      'Writers, researchers, and marketing professionals',
      'Software developers wanting to write better LLM prompts in code',
      'Anyone looking to extract high-value professional output from AI'
    ],
    tags: ['Prompt Engineering', 'ChatGPT', 'AI', 'LLM', 'Prompt Design'],
    modules: [
      {
        id: 'mod-pe-1',
        courseId: 'course-prompt-engineering',
        title: 'Module 01: Core Prompt Design & Structure',
        order: 1,
        lessons: [
          { id: 'les-pe-1', moduleId: 'mod-pe-1', title: 'Prompt Anatomy: Role, Objective, Context & Constraints', duration: '20m', videoUrl: 'https://www.youtube.com/embed/jC4v5AS4RIM', order: 1, content: 'Breaking down the 4 pillars of high-accuracy prompts.' },
          { id: 'les-pe-2', moduleId: 'mod-pe-1', title: 'Advanced Prompting: Few-Shot, CoT & Structured Outputs', duration: '25m', videoUrl: 'https://www.youtube.com/embed/jC4v5AS4RIM', order: 2, content: 'Chain of thought reasoning and JSON mode outputs.' },
          { id: 'les-pe-3', moduleId: 'mod-pe-1', title: 'Prompt Masterpack Walkthrough & Real-World Use', duration: '20m', videoUrl: 'https://www.youtube.com/embed/jC4v5AS4RIM', order: 3, content: 'Utilizing the masterpack templates for instant results.' }
        ]
      }
    ]
  },

  // 11. Build AI Agent with Python
  {
    id: 'course-ai-agent-python',
    slug: 'build-ai-agent-with-python',
    title: 'Build AI Agent with Python',
    description: 'Python ব্যবহার করে intelligent AI Agent তৈরি করার জন্য LLM, tools, APIs এবং agent workflow নিয়ে practical development শেখানো হবে।',
    fullDescription: 'Step into autonomous AI engineering. Learn how to build Python-powered AI agents that can reason, plan, call tools and external APIs, remember conversation state, and execute multi-step workflows autonomously.',
    category: 'Artificial Intelligence',
    level: 'Intermediate → Advanced',
    price: 1890,
    originalPrice: 2800,
    rating: 4.9,
    reviewsCount: 940,
    instructor: {
      id: 'inst-tahmid-2',
      name: 'Tahmid Rahman',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      title: 'Senior AI Agent Engineer',
      role: 'Senior AI Agent Engineer, Open Source Contributor',
      bio: 'Specialist in LangChain, LlamaIndex, and autonomous multi-agent systems.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://www.youtube.com/embed/Fw3bnJ_JtV4',
    duration: '12 Hours',
    lessonsCount: 15,
    studentsCount: 1980,
    certificate: true,
    learningOutcomes: [
      'AI Agent fundamentals: Perception, Reasoning, and Action (ReAct loop)',
      'Python AI development environment setup & SDK integration',
      'Connecting OpenAI / Open-Source LLMs via modern APIs',
      'Function calling & Tool calling mechanics in depth',
      'Writing custom Python tools (Web Search, Math Engine, DB Queries)',
      'Agent workflow orchestration and error-recovery loops',
      'Short-term vs long-term memory systems for agents',
      'External REST API integration and automated payload formatting',
      'Multi-step autonomous reasoning workflows (Plan-and-Solve)',
      'Building production-ready Agent architecture'
    ],
    projects: [
      'Autonomous Python-Powered Research & Financial Market Agent',
      'Automated Customer Support Agent with Database Read/Write Tools',
      'Code Debugging & Execution Agent with Local Sandbox'
    ],
    requirements: [
      'Comfortable with Python (classes, async functions, dictionaries)',
      'Basic understanding of REST APIs and JSON'
    ],
    suitableFor: [
      'Python developers wanting to enter the booming AI Agent industry',
      'Software engineers wanting to build autonomous assistants and copilots',
      'Data scientists seeking to wrap models in action-oriented agent architectures'
    ],
    tags: ['AI Agent', 'Python', 'LLM', 'OpenAI', 'AI Automation', 'Generative AI'],
    modules: [
      {
        id: 'mod-aia-1',
        courseId: 'course-ai-agent-python',
        title: 'Module 01: Agent Architecture & Function Calling',
        order: 1,
        lessons: [
          { id: 'les-aia-1', moduleId: 'mod-aia-1', title: 'What is an AI Agent? The ReAct Framework', duration: '45m', videoUrl: 'https://www.youtube.com/embed/Fw3bnJ_JtV4', order: 1, content: 'Thought, Action, Observation feedback loops explained.' },
          { id: 'les-aia-2', moduleId: 'mod-aia-1', title: 'Function Calling & Tool Definition in Python', duration: '55m', videoUrl: 'https://www.youtube.com/embed/Fw3bnJ_JtV4', order: 2, content: 'Defining JSON schemas for tools and parsing LLM tool calls.' }
        ]
      },
      {
        id: 'mod-aia-2',
        courseId: 'course-ai-agent-python',
        title: 'Module 02: Memory, Tool Integration & Capstone Agent',
        order: 2,
        lessons: [
          { id: 'les-aia-3', moduleId: 'mod-aia-2', title: 'Equipping Agents with Web Search & Python Execution', duration: '60m', videoUrl: 'https://www.youtube.com/embed/Fw3bnJ_JtV4', order: 3, content: 'Enabling agents to browse the live web and run sandboxed code.' },
          { id: 'les-aia-4', moduleId: 'mod-aia-2', title: 'Agent Memory & Multi-Step Reasoning Project', duration: '75m', videoUrl: 'https://www.youtube.com/embed/Fw3bnJ_JtV4', order: 4, content: 'Building a complete autonomous researcher agent from scratch.' }
        ]
      }
    ]
  },

  // 12. AI Automation Fundamentals with n8n
  {
    id: 'course-n8n-automation-fundamentals',
    slug: 'ai-automation-fundamentals-with-n8n',
    title: 'AI Automation Fundamentals with n8n',
    description: 'No-code/low-code automation platform n8n ব্যবহার করে AI-powered workflow তৈরি করার fundamentals শেখানো হবে।',
    fullDescription: 'Discover why n8n is the top self-hosted automation platform for developers and businesses. Build complex workflows connecting webhooks, databases, AI nodes, and cloud APIs without managing server code.',
    category: 'AI & Automation',
    level: 'Beginner → Intermediate',
    price: 1890,
    originalPrice: 2800,
    rating: 4.9,
    reviewsCount: 1040,
    instructor: {
      id: 'inst-khair',
      name: 'Khair Ahammed',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      title: 'Lead Automation Consultant',
      role: 'Lead Automation Architect, Certified n8n Expert',
      bio: 'Implemented 200+ production n8n workflows for international SaaS companies.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://www.youtube.com/embed/Pj1i9XG8l2s',
    duration: '10 Hours',
    lessonsCount: 9,
    studentsCount: 2100,
    certificate: true,
    learningOutcomes: [
      'n8n architecture, self-hosting options, and cloud setup',
      'Core workflow nodes: Triggers, Actions, and Logic flow controllers',
      'Working with Webhooks, HTTP Request nodes, and REST APIs',
      'Data transformation using built-in JavaScript expressions and JSON',
      'Integrating OpenAI, Anthropic, and open-source AI nodes in n8n',
      'Automated email processing, Slack/Discord notification bots',
      'Database integration: Connecting PostgreSQL, Airtable, and Google Sheets',
      'Error handling, retry strategies, and production workflow monitoring',
      'Building a complete end-to-end automated business pipeline'
    ],
    projects: [
      'Automated Lead Qualification & CRM Syncing Pipeline with n8n',
      'AI Document Parser that extracts invoice data and updates Google Sheets',
      'Slack Customer Support Bot powered by n8n AI LangChain nodes'
    ],
    requirements: [
      'A computer with modern web browser',
      'No complex coding background needed; basic logic understanding is enough'
    ],
    suitableFor: [
      'No-code builders, agency owners, and automation freelancers',
      'Software engineers looking for rapid backend automation orchestration',
      'Operations teams wanting to eliminate manual data entry'
    ],
    tags: ['n8n', 'AI Automation', 'Workflow Automation', 'No-Code', 'API', 'AI'],
    modules: [
      {
        id: 'mod-n8n-1',
        courseId: 'course-n8n-automation-fundamentals',
        title: 'Module 01: n8n Foundations & Core Architecture',
        order: 1,
        lessons: [
          { id: 'les-n8n-1', moduleId: 'mod-n8n-1', title: 'n8n Setup, Interface Tour & First Workflow', duration: '45m', videoUrl: 'https://www.youtube.com/embed/Pj1i9XG8l2s', order: 1, content: 'Canvas layout, nodes, connections, and execution logs.' },
          { id: 'les-n8n-2', moduleId: 'mod-n8n-1', title: 'Triggers, Webhooks & HTTP Request Nodes', duration: '50m', videoUrl: 'https://www.youtube.com/embed/Pj1i9XG8l2s', order: 2, content: 'Listening for webhooks and calling third-party REST APIs.' }
        ]
      },
      {
        id: 'mod-n8n-2',
        courseId: 'course-n8n-automation-fundamentals',
        title: 'Module 02: AI Nodes & Business Production Project',
        order: 2,
        lessons: [
          { id: 'les-n8n-3', moduleId: 'mod-n8n-2', title: 'Embedding AI Nodes & Structured Data Processing', duration: '60m', videoUrl: 'https://www.youtube.com/embed/Pj1i9XG8l2s', order: 3, content: 'Using AI to summarize, classify, and format incoming data.' },
          { id: 'les-n8n-4', moduleId: 'mod-n8n-2', title: 'Complete Business Automation Capstone', duration: '70m', videoUrl: 'https://www.youtube.com/embed/Pj1i9XG8l2s', order: 4, content: 'Building a multi-channel lead processing pipeline from scratch.' }
        ]
      }
    ]
  },

  // 13. NLP & LLM Engineering with RAG
  {
    id: 'course-nlp-llm-rag',
    slug: 'nlp-llm-engineering-with-rag',
    title: 'NLP & LLM Engineering with RAG',
    description: 'নিজস্ব documents/data ব্যবহার করে LLM-powered application তৈরি করার জন্য NLP, embeddings, retrieval এবং RAG architecture শেখানো হবে।',
    fullDescription: 'Build enterprise-grade Retrieval-Augmented Generation (RAG) systems. Connect private company documents, PDFs, and knowledge bases to LLMs with zero hallucination. Learn vector databases, semantic search, hybrid retrieval, and reranking.',
    category: 'Artificial Intelligence',
    level: 'Intermediate → Advanced',
    price: 1890,
    originalPrice: 2800,
    rating: 4.9,
    reviewsCount: 1680,
    instructor: {
      id: 'inst-tahmid-3',
      name: 'Tahmid Rahman',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      title: 'Principal AI Systems Architect',
      role: 'Principal AI Systems Architect, RAG Specialist',
      bio: 'Architected private enterprise RAG systems processing millions of internal documents.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://www.youtube.com/embed/tcqEUSncn8I',
    duration: '15 Hours',
    lessonsCount: 14,
    studentsCount: 3900,
    certificate: true,
    learningOutcomes: [
      'NLP foundation & chunking strategies (Fixed, Recursive, Semantic)',
      'LLM context windows and grounding fundamentals',
      'Vector embeddings (OpenAI text-embedding-3, BGE, HuggingFace)',
      'Vector databases: ChromaDB, Pinecone, Qdrant, and pgvector',
      'Semantic similarity search: Cosine similarity vs Euclidean distance',
      'Information retrieval pipelines: Sparse vs Dense vs Hybrid Search',
      'RAG architecture: Document parsing, indexing, and prompt injection',
      'Context injection and prompt defense against hallucination',
      'Reranking models (Cohere Rerank) and query transformation (Hypothetical Doc Embeddings - HyDE)',
      'RAG evaluation frameworks (Ragas: Faithfulness, Answer Relevance)',
      'Deploying a production RAG knowledge assistant API'
    ],
    projects: [
      'RAG-based AI Knowledge Assistant for Company Policies & Manuals',
      'Hybrid Retrieval Search Engine with Cohere Reranking',
      'Ragas Automated Evaluation Benchmark Pipeline'
    ],
    requirements: [
      'Python programming knowledge (functions, virtual environments, pip)',
      'Basic familiarity with LLM APIs and prompt engineering'
    ],
    suitableFor: [
      'AI Engineers building enterprise Q&A systems over proprietary data',
      'Backend developers adding intelligent search and documentation bots',
      'Data engineers wanting to master vector storage and retrieval architecture'
    ],
    tags: ['RAG', 'LLM', 'NLP', 'Vector Database', 'Embeddings', 'AI'],
    modules: [
      {
        id: 'mod-rag-1',
        courseId: 'course-nlp-llm-rag',
        title: 'Module 01: Vector Embeddings & Vector Databases',
        order: 1,
        lessons: [
          { id: 'les-rag-1', moduleId: 'mod-rag-1', title: 'The Mechanics of RAG & Why Fine-Tuning is Not Enough', duration: '45m', videoUrl: 'https://www.youtube.com/embed/tcqEUSncn8I', order: 1, content: 'The retrieval architecture: User -> Retriever -> Context -> LLM.' },
          { id: 'les-rag-2', moduleId: 'mod-rag-1', title: 'Document Parsing & Smart Chunking Strategies', duration: '55m', videoUrl: 'https://www.youtube.com/embed/tcqEUSncn8I', order: 2, content: 'Overcoming chunk boundary issues with recursive text splitters.' },
          { id: 'les-rag-3', moduleId: 'mod-rag-1', title: 'Setting up Vector Stores: ChromaDB and pgvector', duration: '50m', videoUrl: 'https://www.youtube.com/embed/tcqEUSncn8I', order: 3, content: 'Indexing documents and performing fast approximate nearest neighbor queries.' }
        ]
      },
      {
        id: 'mod-rag-2',
        courseId: 'course-nlp-llm-rag',
        title: 'Module 02: Advanced RAG, Reranking & Evaluation',
        order: 2,
        lessons: [
          { id: 'les-rag-4', moduleId: 'mod-rag-2', title: 'Hybrid Search & Cohere Cross-Encoder Reranking', duration: '65m', videoUrl: 'https://www.youtube.com/embed/tcqEUSncn8I', order: 4, content: 'Combining keyword BM25 with vector search for 95%+ precision.' },
          { id: 'les-rag-5', moduleId: 'mod-rag-2', title: 'Evaluating RAG with Ragas & Production Deployment', duration: '70m', videoUrl: 'https://www.youtube.com/embed/tcqEUSncn8I', order: 5, content: 'Benchmarking answer relevance, context recall, and faithfulness.' }
        ]
      }
    ]
  },

  // 14. AI Agents with n8n — No-Code Automation
  {
    id: 'course-ai-agents-n8n',
    slug: 'ai-agents-with-n8n-no-code-automation',
    title: 'AI Agents with n8n — No-Code Automation',
    description: 'Coding ছাড়াই n8n-এর মাধ্যমে AI Agent এবং automated business workflows তৈরি করার practical course। Customer support, lead qualification, এবং content pipelines।',
    fullDescription: 'Build fully autonomous AI agents without writing a single line of Python or JavaScript. Connect memory, tools, and reasoning nodes inside n8n to handle complex multi-step customer inquiries, lead qualification, and dynamic operations.',
    category: 'AI & Automation',
    level: 'Beginner → Intermediate',
    price: 1890,
    originalPrice: 2800,
    rating: 4.8,
    reviewsCount: 880,
    instructor: {
      id: 'inst-khair-2',
      name: 'Khair Ahammed',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      title: 'Lead Automation Architect',
      role: 'Lead Automation Architect, Enterprise n8n Specialist',
      bio: 'Engineered dozens of multi-step autonomous agent solutions using n8n for international brands.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://www.youtube.com/embed/Sby1U39G4qU',
    duration: '15 Hours',
    lessonsCount: 11,
    studentsCount: 1700,
    certificate: true,
    learningOutcomes: [
      'AI Agent fundamentals in a visual no-code paradigm',
      'n8n AI Agent node architecture & sub-node configuration',
      'Equipping visual agents with calculator, database & web search tools',
      'Configuring conversational memory (Window buffer, Redis memory)',
      'Automated decision routing based on sentiment and customer value',
      'Connecting agents to WhatsApp, Telegram, Slack, and email channels',
      'Multi-agent collaboration inside n8n workflows',
      'Automated lead qualification and instant meeting scheduling',
      'Production deployment, security, and webhook rate limiting'
    ],
    projects: [
      'AI Customer Support Agent that checks order status in Google Sheets',
      'Lead Qualification & Calendar Booking Agent for B2B Agencies',
      'Automated Content Research & LinkedIn Post Drafting Agent'
    ],
    requirements: [
      'No coding knowledge required',
      'An n8n instance (local, desktop, or cloud) and OpenAI API key'
    ],
    suitableFor: [
      'Agency owners offering high-ticket AI automation services',
      'Entrepreneurs wanting to automate customer support around the clock',
      'Business managers seeking intelligent workflow orchestration'
    ],
    tags: ['n8n', 'AI Agents', 'No-Code', 'Automation', 'LLM', 'Workflow'],
    modules: [
      {
        id: 'mod-aagn8n-1',
        courseId: 'course-ai-agents-n8n',
        title: 'Module 01: n8n AI Agent Node & Tool Integration',
        order: 1,
        lessons: [
          { id: 'les-aagn-1', moduleId: 'mod-aagn8n-1', title: 'The n8n AI Agent Node Architecture', duration: '45m', videoUrl: 'https://www.youtube.com/embed/Sby1U39G4qU', order: 1, content: 'Understanding Model, Memory, and Tool connectors.' },
          { id: 'les-aagn-2', moduleId: 'mod-aagn8n-1', title: 'Equipping Your Agent with Real-Time Database Tools', duration: '55m', videoUrl: 'https://www.youtube.com/embed/Sby1U39G4qU', order: 2, content: 'Allowing the agent to read and write database records.' }
        ]
      },
      {
        id: 'mod-aagn8n-2',
        courseId: 'course-ai-agents-n8n',
        title: 'Module 02: Production Agent Projects',
        order: 2,
        lessons: [
          { id: 'les-aagn-3', moduleId: 'mod-aagn8n-2', title: 'Building a Full Customer Support Agent for WhatsApp/Web', duration: '65m', videoUrl: 'https://www.youtube.com/embed/Sby1U39G4qU', order: 3, content: 'Handling order queries, refunds, and FAQ resolution automatically.' },
          { id: 'les-aagn-4', moduleId: 'mod-aagn8n-2', title: 'Multi-Agent Collaboration & Error Fallbacks', duration: '60m', videoUrl: 'https://www.youtube.com/embed/Sby1U39G4qU', order: 4, content: 'Passing tasks between researcher agent and writer agent.' }
        ]
      }
    ]
  },

  // 15. Deep Learning Mastery 2026
  {
    id: 'course-deep-learning-2026',
    slug: 'deep-learning-mastery-2026',
    title: 'Deep Learning Mastery 2026',
    description: 'Neural networks এবং deep learning-এর core concepts থেকে CNN এবং RNN-এর মতো important architectures সম্পর্কে practical ধারণা তৈরি করার course।',
    fullDescription: 'Unravel the mysteries of modern artificial neural networks. Learn backpropagation, activation functions, convolutional neural networks (CNN) for computer vision, and recurrent neural networks (RNN/LSTM) for sequence modeling with PyTorch.',
    category: 'AI & Automation',
    level: 'Intermediate → Advanced',
    price: 1890,
    originalPrice: 2800,
    rating: 4.8,
    reviewsCount: 650,
    instructor: {
      id: 'inst-tahmid-4',
      name: 'Tahmid Rahman',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      title: 'Deep Learning Specialist',
      role: 'Deep Learning Researcher & PyTorch Engineer',
      bio: 'Conducted computer vision and sequence modeling research for modern autonomous applications.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://www.youtube.com/embed/aircAruvnKk',
    duration: '7 Hours',
    lessonsCount: 6,
    studentsCount: 820,
    certificate: true,
    learningOutcomes: [
      'Deep Learning fundamentals & biology-inspired artificial neurons',
      'Multi-Layer Perceptrons (MLP), layers, weights, and biases',
      'Activation functions: ReLU, Sigmoid, Tanh, and Leaky ReLU',
      'Forward propagation and mathematical backpropagation with Chain Rule',
      'Optimizers: Stochastic Gradient Descent (SGD), Adam, and learning rate schedules',
      'Preventing overfitting: Dropout, Batch Normalization, and L2 Regularization',
      'Convolutional Neural Networks (CNN) for image recognition & feature maps',
      'Recurrent Neural Networks (RNN) and LSTMs for time-series & sequence prediction',
      'End-to-end model training, validation, and PyTorch deployment'
    ],
    projects: [
      'Image Classification Model with Convolutional Neural Networks (CNN)',
      'Neural Network from Scratch using NumPy and Matrix Math',
      'Time-Series Stock / Sequence Prediction Model with LSTM'
    ],
    requirements: [
      'Basic Python programming and NumPy matrix manipulation',
      'Basic calculus (derivatives) and linear algebra concepts'
    ],
    suitableFor: [
      'Computer Science students aiming for deep learning research',
      'Engineers wanting to master PyTorch and modern neural architectures',
      'Data scientists seeking to progress from Scikit-Learn to Deep Learning'
    ],
    tags: ['Deep Learning', 'Neural Networks', 'CNN', 'RNN', 'Python', 'AI'],
    modules: [
      {
        id: 'mod-dl-1',
        courseId: 'course-deep-learning-2026',
        title: 'Module 01: Neural Network Architecture & Backpropagation',
        order: 1,
        lessons: [
          { id: 'les-dl-1', moduleId: 'mod-dl-1', title: 'Deep Learning Introduction & Neuron Math', duration: '50m', videoUrl: 'https://www.youtube.com/embed/aircAruvnKk', order: 1, content: 'Weights, biases, dot products, and activation functions.' },
          { id: 'les-dl-2', moduleId: 'mod-dl-1', title: 'Forward & Backpropagation with Gradient Descent', duration: '65m', videoUrl: 'https://www.youtube.com/embed/aircAruvnKk', order: 2, content: 'Deriving the chain rule and updating weights.' }
        ]
      },
      {
        id: 'mod-dl-2',
        courseId: 'course-deep-learning-2026',
        title: 'Module 02: CNN for Vision & RNN for Sequences',
        order: 2,
        lessons: [
          { id: 'les-dl-3', moduleId: 'mod-dl-2', title: 'Convolutional Neural Networks (CNN) for Image Recognition', duration: '70m', videoUrl: 'https://www.youtube.com/embed/aircAruvnKk', order: 3, content: 'Kernels, padding, stride, pooling, and feature maps.' },
          { id: 'les-dl-4', moduleId: 'mod-dl-2', title: 'Recurrent Neural Networks (RNN) & LSTM for Sequence Data', duration: '65m', videoUrl: 'https://www.youtube.com/embed/aircAruvnKk', order: 4, content: 'Hidden states, vanishing gradients, and LSTM memory gates.' }
        ]
      }
    ]
  }
];
