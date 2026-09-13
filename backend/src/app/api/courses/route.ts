import { NextResponse } from 'next/server';
import { db, Course } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  let list = Array.from(db.courses.values());

  if (category && category !== 'All') {
    list = list.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }

  return NextResponse.json(list);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, category, level, price } = body;
    const instructor = db.users.get('user-instructor-1')!;

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title,
      description: description || 'Comprehensive newly published course.',
      category: category || 'Programming',
      level: level || 'Beginner',
      price: Number(price) || 999,
      originalPrice: (Number(price) || 999) + 500,
      rating: 5.0,
      reviewsCount: 1,
      instructor: {
        id: instructor.id,
        name: instructor.name,
        avatar: instructor.avatar,
        title: instructor.title || 'Instructor'
      },
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      duration: '6h 00m',
      lessonsCount: 1,
      studentsCount: 0,
      learningOutcomes: ['Understand core practical foundations', 'Build hands-on production code'],
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
              title: 'Welcome & Curriculum Overview',
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
    return NextResponse.json(newCourse, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
