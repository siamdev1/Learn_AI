import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aiEngine } from '@/lib/aiEngine';

export async function GET() {
  const totalCourses = db.courses.size;
  let totalStudents = 0;
  let totalRevenue = 0;

  for (const c of db.courses.values()) {
    totalStudents += c.studentsCount;
    totalRevenue += c.price * c.studentsCount;
  }

  return NextResponse.json({
    totalCourses,
    totalStudents,
    totalRevenue: `৳${totalRevenue.toLocaleString()}`,
    activeEnrollments: db.enrollments.size,
    aiStats: aiEngine.getStats()
  });
}
