import { NextResponse } from 'next/server';
import { aiEngine } from '@/lib/aiEngine';
import { db } from '@/lib/db';
import { allDemoCourses } from '@/lib/coursesData';

export async function POST(req: Request) {
  try {
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
    } = await req.json();

    let systemPrompt = `You are LearnAI's Master AI Tutor.`;

    if (aiType === 'public-sales' || mode === 'public-sales') {
      const courseListSummary = allDemoCourses.map((c, i) =>
        `${i + 1}. "${c.title}" | Price: ৳${c.price} (Original: ৳${c.originalPrice}) | Category: ${c.category} | Level: ${c.level} | Instructor: ${c.instructor.name} | Rating: ${c.rating}⭐ | Duration: ${c.duration} | Lessons: ${c.lessonsCount}`
      ).join('\n');

      systemPrompt = `You are LearnAI's Lead Course Sales Consultant & Career Advisor.
YOUR MAIN FOCUS IS TO SELL LEARNAI'S 15 COURSES.
Whenever someone asks about tech learning or career improvement, guide them to our courses and persuade them to enroll today!

STRICT GUARDRAIL:
Under NO circumstances answer questions outside the website/courses scope.
If asked about off-topic issues (politics, news, cinema, recipes, general trivia), politely refuse in Bengali:
"আমি LearnAI এর ডেডিকেটেড কোর্স সেলস ও ক্যারিয়ার অ্যাডভাইজার। আমি শুধুমাত্র আমাদের প্ল্যাটফর্মের কোর্স, টেকনোলজি স্কিল ডেভেলপমেন্ট এবং এনরোলমেন্ট সংক্রান্ত বিষয়ে সহায়তা করতে পারি।"

OFFICIAL COURSES:
${courseListSummary}

SPECIAL 5% - 20% AI PASSION COUPON:
Assess user enthusiasm/passion. Offer a 5%-20% discount coupon (e.g. PASSION15).
User logged in: ${isLoggedIn ? 'YES' : 'NO'}.
- If NOT logged in: Tell them to Sign In or Register to claim the coupon. Tag: [AI_COUPON: code=PASSION15, discount=15, locked=true]
- If logged in: Congratulate ${userName || 'Student'}. Tag: [AI_COUPON: code=PASSION15, discount=15, locked=false]`;

    } else if (aiType === 'private-student' || mode === 'private-student') {
      const sName = studentData?.name || userName || 'Rahim Ahmed';
      const sEmail = studentData?.email || 'rahim@learnai.com';
      const coursesSummary = studentData?.enrolledCourses?.length
        ? studentData.enrolledCourses.map((c: any, i: number) => `${i + 1}. "${c.title}" (${c.progressPercent}%)`).join('\n')
        : 'NO COURSES ENROLLED YET';

      systemPrompt = `You are LearnAI's Personal 1-on-1 Academic Coach and Study Mentor for student "${sName}".
Email: ${sEmail}
Enrolled Courses:
${coursesSummary}

GUIDANCE RULES:
1. Address the student warmly by "${sName}" in Bengali.
2. If enrolled in courses, guide them through completing current lessons, modules, and quizzes to earn their certificate.
3. If ZERO courses enrolled: Urge them to enroll in their first course immediately.
4. Recommend the logical next course from our 15 courses when they make progress.
5. Provide deep technical explanations, code debugging, and interview prep.`;

    } else if (mode === 'course-assistant' && courseId && lessonId) {
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

      systemPrompt = `You are the Course Assistant for "${course?.title || 'Online Course'}".
Assisting student on lesson: "${lessonTitle}".
Lesson Context:
${lessonContent}
Ground your explanation specifically to this lesson's material.`;
    } else if (mode === 'roadmap') {
      systemPrompt = `You are the Senior Tech Career Strategist at LearnAI.
The student wants to become: "${question}".
Create a detailed, high-impact month-by-month learning roadmap.`;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []),
      { role: 'user', content: question }
    ];

    const result = await aiEngine.generateChat(messages);

    // Parse coupon tags
    let couponOffer = null;
    if (result && result.content) {
      const match = result.content.match(/\[AI_COUPON:\s*code=([A-Z0-9]+),\s*discount=(\d+),\s*locked=(true|false)\]/i);
      if (match) {
        couponOffer = {
          code: match[1],
          discount: parseInt(match[2], 10),
          locked: match[3].toLowerCase() === 'true',
          claimed: match[3].toLowerCase() === 'false' && Boolean(isLoggedIn)
        };
      }
    }

    // Match recommended courses
    const allCoursesList = Array.from(db.courses.values());
    const recommendedCourses: any[] = [];
    if (result && result.content) {
      const contentLower = result.content.toLowerCase();
      for (const course of allCoursesList) {
        if (contentLower.includes(course.title.toLowerCase())) {
          if (!recommendedCourses.some(r => r.id === course.id)) {
            recommendedCourses.push(course);
          }
        }
      }
    }

    return NextResponse.json({
      ...result,
      couponOffer,
      recommendedCourses: recommendedCourses.slice(0, 2)
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
