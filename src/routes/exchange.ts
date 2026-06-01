import express from 'express';
import { supabase } from '../utils/supabase';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// GET /api/v1/exchange/balance  [auth]
router.get('/balance', authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('balances')
      .select('balance_krw, balance_usd')
      .eq('user_id', req.userId!)
      .maybeSingle();

    if (error) {
      return res.status(400).json({ success: false, message: '잔액 조회 실패', error: error.message });
    }

    res.json({
      success: true,
      message: '잔액 조회 성공',
      data: { balanceKRW: data?.balance_krw ?? 0, balanceUSD: data?.balance_usd ?? 0 },
    });
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/exchange/rates?from=USD&to=KRW
router.get('/rates', async (req, res, next) => {
  try {
    const from = String(req.query.from || 'USD').toUpperCase();
    const to = String(req.query.to || 'KRW').toUpperCase();

    const { data, error } = await supabase
      .from('exchange_rates')
      .select('from_currency, to_currency, rate, fetched_at')
      .eq('from_currency', from)
      .eq('to_currency', to)
      .order('fetched_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      const staticRates: Record<string, number> = {
        'USD-KRW': 1350.5,
        'KRW-USD': 1 / 1350.5,
        'JPY-KRW': 9.2,
        'KRW-JPY': 1 / 9.2,
      };
      const rate = staticRates[`${from}-${to}`] ?? 1;
      return res.json({ success: true, message: '환율 조회 성공 (기본값)', data: { from, to, rate } });
    }

    res.json({
      success: true,
      message: '환율 조회 성공',
      data: { from, to, rate: data.rate, fetchedAt: data.fetched_at },
    });
  } catch (e) {
    next(e);
  }
});

export default router;
