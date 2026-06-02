import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../utils/supabase';

const router = express.Router();

// POST /api/v1/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'email과 password가 필요합니다.' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, phone, password_hash')
      .eq('email', email)
      .maybeSingle();

    if (error || !user || !user.password_hash) {
      return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 틀렸습니다.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 틀렸습니다.' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    const { password_hash: _, ...userData } = user;

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

    const { data: user, error } = await supabase
      .from('users')
      .insert({ email, name: displayName, password_hash: passwordHash, phone: phone || null })
      .select('id, email, name, phone')
      .single();

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
