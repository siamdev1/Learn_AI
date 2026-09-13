import { NextResponse } from 'next/server';
import { aiEngine } from '@/lib/aiEngine';

export async function GET() {
  return NextResponse.json(aiEngine.getStats());
}

export async function POST(req: Request) {
  try {
    const { modelId } = await req.json();
    if (!modelId) return NextResponse.json({ error: 'modelId is required' }, { status: 400 });

    const success = aiEngine.setPrimaryModelId(modelId);
    if (success) {
      return NextResponse.json({ success: true, activePrimary: modelId });
    }
    return NextResponse.json({ error: 'Model not recognized' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
