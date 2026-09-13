import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aiEngine } from '@/lib/aiEngine';

export async function POST(req: Request) {
  try {
    const { goal, level, preferredTopic, weeklyHours } = await req.json();

    const coursesList = Array.from(db.courses.values()).map(c => ({
      id: c.id,
      title: c.title,
      category: c.category,
      level: c.level,
      description: c.description
    }));

    const systemPrompt = `You are the Lead Career Advisor for LearnAI LMS.
Given student profile: Goal: ${goal}, Level: ${level}, Interest: ${preferredTopic}, Commitment: ${weeklyHours} hrs/wk.
Available Courses:
${JSON.stringify(coursesList, null, 2)}
Select best matching course ID and provide a 2-3 sentence encouraging explanation.
Respond in valid JSON:
{
  "recommendedCourseId": "course-id-here",
  "matchScore": 94,
  "reasoning": "Reason..."
}`;

    const aiResult = await aiEngine.generateChat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Analyze and recommend the ideal course.' }
    ]);

    let parsed: any = null;
    try {
      const cleaned = aiResult.content.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      let matchedId = 'course-python-101';
      const topicLower = (preferredTopic || '').toLowerCase();
      if (topicLower.includes('web') || topicLower.includes('react')) matchedId = 'course-web-201';
      else if (topicLower.includes('ai') || topicLower.includes('data')) matchedId = 'course-ai-301';
      else if (topicLower.includes('cloud') || topicLower.includes('devops')) matchedId = 'course-cloud-401';

      parsed = {
        recommendedCourseId: matchedId,
        matchScore: 93,
        reasoning: `Tailored curriculum matching your goals in ${preferredTopic || 'software development'}.`
      };
    }

    const course = db.courses.get(parsed.recommendedCourseId) || db.courses.get('course-python-101')!;

    return NextResponse.json({
      recommendedCourse: course,
      matchScore: parsed.matchScore || 93,
      reasoning: parsed.reasoning,
      modelUsed: aiResult.modelUsed,
      failoverOccurred: aiResult.failoverOccurred
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
