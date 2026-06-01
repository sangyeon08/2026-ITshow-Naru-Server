import express from 'express';
import { supabase } from '../utils/supabase';

const router = express.Router();

// GET /api/v1/categories
router.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, image_url')
      .order('id');

    if (error) {
      return res.status(400).json({ success: false, message: '카테고리 조회 실패', error: error.message });
    }

    res.json({ success: true, message: `${data.length}개 카테고리 조회`, data });
  } catch (e) {
    next(e);
  }
});

export default router;
