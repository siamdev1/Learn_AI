import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('courseId');

  if (!courseId) {
    return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
  }

  const quiz = db.quizzes.get(courseId);
  if (!quiz) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
  }

  const clientQuestions = quiz.questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options
  }));

  return NextResponse.json({
    id: quiz.id,
    title: quiz.title,
    courseId: quiz.courseId,
    passingScore: quiz.passingScore,
    questions: clientQuestions
  });
}

export async function POST(req: Request) {
  try {
    const { courseId, answers } = await req.json();
    const quiz = db.quizzes.get(courseId);

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
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

    return NextResponse.json({
      passed,
      scorePercent,
      correctCount,
      totalQuestions: quiz.questions.length,
      passingScore: quiz.passingScore,
      review
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
