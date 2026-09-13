import { NextResponse } from 'next/server';
import { db, Enrollment, Certificate } from '@/lib/db';

export async function GET() {
  const myEnrollments = Array.from(db.enrollments.values()).filter(
    e => e.studentId === db.currentUserId
  );

  const result = myEnrollments.map(e => {
    const course = db.courses.get(e.courseId);
    return {
      enrollment: e,
      course
    };
  }).filter(item => item.course !== undefined);

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, courseId, lessonId } = body;

    if (action === 'enroll') {
      const course = db.courses.get(courseId);
      if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

      const key = `${db.currentUserId}:${courseId}`;
      let enrollment = db.enrollments.get(key);

      if (!enrollment) {
        enrollment = {
          id: `enr-${Date.now()}`,
          studentId: db.currentUserId,
          courseId,
          enrolledAt: new Date().toISOString(),
          progressPercent: 0,
          completedLessonIds: [],
          isCertified: false
        };
        db.enrollments.set(key, enrollment);
        course.studentsCount += 1;
      }
      return NextResponse.json({ success: true, enrollment });
    }

    if (action === 'complete-lesson') {
      const course = db.courses.get(courseId);
      if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

      const key = `${db.currentUserId}:${courseId}`;
      let enrollment = db.enrollments.get(key);

      if (!enrollment) {
        enrollment = {
          id: `enr-${Date.now()}`,
          studentId: db.currentUserId,
          courseId,
          enrolledAt: new Date().toISOString(),
          progressPercent: 0,
          completedLessonIds: [],
          isCertified: false
        };
        db.enrollments.set(key, enrollment);
      }

      if (!enrollment.completedLessonIds.includes(lessonId)) {
        enrollment.completedLessonIds.push(lessonId);
      }

      let totalLessons = 0;
      for (const m of course.modules) {
        totalLessons += m.lessons.length;
      }

      enrollment.progressPercent = Math.min(
        100,
        Math.round((enrollment.completedLessonIds.length / totalLessons) * 100)
      );

      if (enrollment.progressPercent === 100 && !enrollment.isCertified) {
        enrollment.isCertified = true;
        const certNumber = `CERT-LMS-${Math.floor(100000 + Math.random() * 900000)}`;
        const student = db.users.get(db.currentUserId)!;
        const cert: Certificate = {
          id: `cert-${Date.now()}`,
          certificateNumber: certNumber,
          studentId: student.id,
          studentName: student.name,
          courseId: course.id,
          courseTitle: course.title,
          issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          grade: 'Distinction'
        };
        db.certificates.set(cert.id, cert);
        enrollment.certificateId = cert.id;
      }

      return NextResponse.json({
        success: true,
        progressPercent: enrollment.progressPercent,
        completedLessonIds: enrollment.completedLessonIds,
        isCertified: enrollment.isCertified,
        certificateId: enrollment.certificateId
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
