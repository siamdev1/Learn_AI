import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aiEngine } from '@/lib/aiEngine';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    framework: 'Next.js App Router Backend',
    appName: 'LearnAI LMS Platform',
    timestamp: new Date().toISOString(),
    primaryModel: aiEngine.getPrimaryModelId(),
    activeUser: db.users.get(db.currentUserId)
  });
}
