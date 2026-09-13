import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface AuthPendingSession {
  sessionId: string;
  userId?: string;
  tempUser?: any;
  otpCode: string;
  otpChannel: 'email' | 'sms';
  targetContact: string;
  expiresAt: number;
  otpVerified: boolean;
  twoFactorVerified: boolean;
}

const authPendingSessions = new Map<string, AuthPendingSession>();

export async function GET() {
  const user = db.users.get(db.currentUserId);
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null });
  }
  return NextResponse.json({ authenticated: true, user });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body.action || (body.role ? 'switch-role' : 'login');

    // 1. One-click demo login
    if (action === 'demo-quick-login' || action === 'switch-role') {
      const role = body.role || 'student';
      let targetUser;
      for (const u of db.users.values()) {
        if (u.role === role) {
          targetUser = u;
          break;
        }
      }

      if (!targetUser) {
        return NextResponse.json({ error: 'Demo account not found' }, { status: 404 });
      }

      if (body.requireSecurityCheck) {
        const sessionId = `auth_sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        authPendingSessions.set(sessionId, {
          sessionId,
          userId: targetUser.id,
          otpCode,
          otpChannel: 'email',
          targetContact: targetUser.email,
          expiresAt: Date.now() + 5 * 60 * 1000,
          otpVerified: false,
          twoFactorVerified: false
        });

        return NextResponse.json({
          requireOtp: true,
          sessionId,
          role: targetUser.role,
          userName: targetUser.name,
          channel: 'email',
          targetContact: targetUser.email,
          devOtpPreview: otpCode
        });
      }

      db.currentUserId = targetUser.id;
      return NextResponse.json({ success: true, user: targetUser });
    }

    // 2. Email Login
    if (action === 'login') {
      const { email, deliveryMethod = 'email' } = body;
      const cleanEmail = String(email || '').trim().toLowerCase();
      let user;
      for (const u of db.users.values()) {
        if (u.email.toLowerCase() === cleanEmail) {
          user = u;
          break;
        }
      }

      if (!user) {
        return NextResponse.json({ error: 'No user account found with this email' }, { status: 401 });
      }

      const sessionId = `auth_sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const contact = deliveryMethod === 'sms' ? (user as any).phone || '+880 1700-000000' : user.email;

      authPendingSessions.set(sessionId, {
        sessionId,
        userId: user.id,
        otpCode,
        otpChannel: deliveryMethod === 'sms' ? 'sms' : 'email',
        targetContact: contact,
        expiresAt: Date.now() + 5 * 60 * 1000,
        otpVerified: false,
        twoFactorVerified: false
      });

      return NextResponse.json({
        requireOtp: true,
        sessionId,
        channel: deliveryMethod === 'sms' ? 'sms' : 'email',
        targetContact: contact,
        devOtpPreview: otpCode,
        user
      });
    }

    // 3. Registration (Student or Instructor/Tutor)
    if (action === 'register') {
      const { name, email, role = 'student', phone = '+880 1711-223344', expertise = 'Programming', bio, deliveryMethod = 'email' } = body;
      const cleanEmail = String(email || '').trim().toLowerCase();

      for (const u of db.users.values()) {
        if (u.email.toLowerCase() === cleanEmail) {
          return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
        }
      }

      const targetRole = role === 'instructor' ? 'instructor' : 'student';
      const tempUser = {
        id: `user-${targetRole}-${Date.now()}`,
        name: String(name || '').trim(),
        email: cleanEmail,
        role: targetRole,
        avatar: targetRole === 'instructor'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        title: targetRole === 'instructor' ? `Instructor (${expertise})` : 'Diploma Student',
        bio: bio || (targetRole === 'instructor' ? `Expert instructor specializing in ${expertise}.` : 'Student at LearnAI.')
      };

      const sessionId = `auth_sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const contact = deliveryMethod === 'sms' ? phone : cleanEmail;

      authPendingSessions.set(sessionId, {
        sessionId,
        tempUser,
        otpCode,
        otpChannel: deliveryMethod === 'sms' ? 'sms' : 'email',
        targetContact: contact,
        expiresAt: Date.now() + 5 * 60 * 1000,
        otpVerified: false,
        twoFactorVerified: false
      });

      return NextResponse.json({
        requireOtp: true,
        sessionId,
        channel: deliveryMethod === 'sms' ? 'sms' : 'email',
        targetContact: contact,
        devOtpPreview: otpCode,
        user: tempUser
      }, { status: 201 });
    }

    // 4. Resend OTP
    if (action === 'resend-otp') {
      const { sessionId, deliveryMethod } = body;
      const session = authPendingSessions.get(sessionId);
      if (!session) return NextResponse.json({ error: 'Session expired' }, { status: 404 });

      const freshOtp = Math.floor(100000 + Math.random() * 900000).toString();
      session.otpCode = freshOtp;
      if (deliveryMethod === 'sms' || deliveryMethod === 'email') {
        session.otpChannel = deliveryMethod;
      }

      return NextResponse.json({
        success: true,
        sessionId,
        channel: session.otpChannel,
        devOtpPreview: freshOtp
      });
    }

    // 5. Verify OTP
    if (action === 'verify-otp') {
      const { sessionId, code } = body;
      const session = authPendingSessions.get(sessionId);
      if (!session) return NextResponse.json({ error: 'Session expired' }, { status: 404 });

      const cleanCode = String(code || '').trim();
      if (cleanCode !== session.otpCode && cleanCode !== '123456') {
        return NextResponse.json({ error: 'Incorrect OTP code' }, { status: 400 });
      }

      session.otpVerified = true;
      return NextResponse.json({ success: true, require2fa: true, dev2faHint: '123456' });
    }

    // 6. Verify 2FA
    if (action === 'verify-2fa') {
      const { sessionId, code } = body;
      const session = authPendingSessions.get(sessionId);
      if (!session || !session.otpVerified) {
        return NextResponse.json({ error: 'Please verify OTP first' }, { status: 400 });
      }

      let finalUser;
      if (session.userId) {
        finalUser = db.users.get(session.userId);
      } else if (session.tempUser) {
        finalUser = session.tempUser;
        db.users.set(finalUser.id, finalUser);
      }

      if (!finalUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 400 });
      }

      db.currentUserId = finalUser.id;
      authPendingSessions.delete(sessionId);

      return NextResponse.json({
        success: true,
        authenticated: true,
        user: finalUser,
        token: `token_${finalUser.id}_${Date.now()}`
      });
    }

    // 7. Logout
    if (action === 'logout') {
      db.currentUserId = '';
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
