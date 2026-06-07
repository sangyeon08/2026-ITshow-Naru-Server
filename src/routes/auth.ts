import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../utils/supabase';

const router = express.Router();

type AuthUser = {
  id: number;
  email: string | null;
  name: string | null;
  phone: string | null;
  password_hash?: string | null;
  password?: string | null;
};

const passwordHashColumnMissing = (message?: string) =>
  Boolean(message?.includes('password_hash') && message.includes('column'));

async function findUserByEmail(email: string) {
  const primary = await supabase
    .from('users')
    .select('id, email, name, phone, password_hash')
    .eq('email', email)
    .maybeSingle();

  if (!passwordHashColumnMissing(primary.error?.message)) {
    return primary as { data: AuthUser | null; error: typeof primary.error };
  }

  const legacy = await supabase
    .from('users')
    .select('id, email, name, phone, password')
    .eq('email', email)
    .maybeSingle();

  return legacy as unknown as { data: AuthUser | null; error: typeof primary.error };
}

async function createUser(email: string, displayName: string, passwordHash: string, phone?: string) {
  const baseUser = { email, name: displayName, phone: phone || null };
  const primary = await supabase
    .from('users')
    .insert({ ...baseUser, password_hash: passwordHash })
    .select('id, email, name, phone')
    .single();

  if (!passwordHashColumnMissing(primary.error?.message)) {
    return primary;
  }

  return supabase
    .from('users')
    .insert({ ...baseUser, password: passwordHash } as never)
    .select('id, email, name, phone')
    .single();
}

// POST /api/v1/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'email과 password가 필요합니다.' });
    }

    const { data: user, error } = await findUserByEmail(email);
    const storedPasswordHash = user?.password_hash ?? user?.password;

    if (error || !user || !storedPasswordHash) {
      return res.status(401).json({ success: false, message: '존재하지 않은 이메일 또는 비밀번호 입니다' });
    }

    const match = await bcrypt.compare(password, storedPasswordHash);
    if (!match) {
      return res.status(401).json({ success: false, message: '존재하지 않은 이메일 또는 비밀번호 입니다' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    const { password_hash: _passwordHash, password: _password, ...userData } = user;

    res.json({ success: true, message: '로그인 성공', data: { user: userData, token } });
  } catch (e) {
    next(e);
  }
});

// POST /api/v1/auth/signup
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, name, username, phone } = req.body;
    const displayName = name || username;

    if (!email || !password || !displayName) {
      return res.status(400).json({ success: false, message: 'email, password, name이 필요합니다.' });
    }

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ success: false, message: '이미 사용 중인 이메일입니다.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data: user, error } = await createUser(email, displayName, passwordHash, phone);

    if (error) {
      return res.status(400).json({ success: false, message: '회원가입 실패', error: error.message });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.status(201).json({ success: true, message: '회원가입 성공', data: { user, token } });
  } catch (e) {
    next(e);
  }
});

export default router;
