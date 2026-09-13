import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const cert = db.certificates.get(id);
    if (!cert) return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    return NextResponse.json(cert);
  }

  return NextResponse.json(Array.from(db.certificates.values()));
}
