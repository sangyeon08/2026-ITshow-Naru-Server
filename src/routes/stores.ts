import express from 'express';
import { supabase } from '../utils/supabase';

const router = express.Router();

// GET /api/v1/stores/search?query=...
router.get('/search', async (req, res, next) => {
  try {
    const query = String(req.query.query || '').trim();

    let q = supabase
      .from('stores')
      .select('id, name, description, image_url, rating, review_count, address, categories(id, name)');

    if (query) {
      q = q.ilike('name', `%${query}%`);
    }

    const { data, error } = await q.order('rating', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: '가게 검색 실패', error: error.message });
    }

    res.json({ success: true, message: `${data.length}개 가게 검색`, data });
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/stores/nearby?lat=...&lng=...
router.get('/nearby', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('stores')
      .select('id, name, description, image_url, rating, review_count, address, latitude, longitude, categories(id, name)')
      .order('rating', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: '주변 가게 조회 실패', error: error.message });
    }

    res.json({ success: true, message: `${data.length}개 가게 조회`, data });
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/stores/:storeId/reviews
router.get('/:storeId/reviews', async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);

    const { data, error } = await supabase
      .from('reviews')
      .select('id, rating, content, country, created_at, users(name)')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: '리뷰 조회 실패', error: error.message });
    }

    res.json({ success: true, message: `${data.length}개 리뷰 조회`, data });
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/stores/:storeId/menus
router.get('/:storeId/menus', async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);

    const { data, error } = await supabase
      .from('menus')
      .select('id, store_id, name, description, price, image_url, allergy_notice')
      .eq('store_id', storeId)
      .order('id');

    if (error) {
      return res.status(400).json({ success: false, message: '메뉴 조회 실패', error: error.message });
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: '해당 가게의 메뉴가 없습니다.' });
    }

    res.json({ success: true, message: `${data.length}개 메뉴 조회`, data });
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/stores/:storeId
router.get('/:storeId', async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);

    const { data, error } = await supabase
      .from('stores')
      .select('id, name, description, image_url, rating, review_count, address, latitude, longitude, categories(id, name)')
      .eq('id', storeId)
      .maybeSingle();

    if (error) {
      return res.status(400).json({ success: false, message: '가게 조회 실패', error: error.message });
    }
    if (!data) {
      return res.status(404).json({ success: false, message: '가게를 찾을 수 없습니다.' });
    }

    res.json({ success: true, message: '가게 조회 성공', data });
  } catch (e) {
    next(e);
  }
});

export default router;
