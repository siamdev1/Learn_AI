import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const course = db.courses.get(params.id);
  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }

  const enrollmentKey = `${db.currentUserId}:${course.id}`;
  const enrollment = db.enrollments.get(enrollmentKey);

  return NextResponse.json({
    course,
    isEnrolled: !!enrollment,
    enrollment: enrollment || null
  });
}
