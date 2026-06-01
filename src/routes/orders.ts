import express from 'express';
import { supabase } from '../utils/supabase';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

const ORDER_STATUS_GAUGE: Record<string, number> = {
  PAID: 10,
  COOKING: 35,
  DELIVERING: 75,
  COMPLETED: 100,
  CANCELED: 0,
};

// POST /api/v1/orders  [auth]
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { type = 'DELIVERY', deliveryAddress, cartItemIds } = req.body;

    if (!['DELIVERY', 'PICKUP'].includes(type)) {
      return res.status(400).json({ success: false, message: 'type은 DELIVERY 또는 PICKUP이어야 합니다.' });
    }

    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', req.userId!)
      .maybeSingle();

    if (!cart) {
      return res.status(400).json({ success: false, message: '장바구니가 비어 있습니다.' });
    }

    let cartQuery = supabase
      .from('cart_items')
      .select('id, menu_id, quantity, menus(id, name, price, image_url, store_id)')
      .eq('cart_id', cart.id);

    if (Array.isArray(cartItemIds) && cartItemIds.length > 0) {
      cartQuery = cartQuery.in('id', cartItemIds);
    }

    const { data: cartItems, error: cartError } = await cartQuery;

    if (cartError || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: '주문할 항목이 없습니다.' });
    }

    const firstMenu = cartItems[0].menus as { store_id: number | null } | null;
    const storeId = firstMenu?.store_id ?? null;

    const totalAmount = cartItems.reduce((sum, ci) => {
      const menu = ci.menus as { price: number } | null;
      return sum + (menu?.price ?? 0) * (ci.quantity ?? 1);
    }, 0);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: req.userId!,
        store_id: storeId,
        delivery_address: deliveryAddress ?? null,
        total_amount: totalAmount,
        status: 'PAID',
      })
      .select('id, status, total_amount, delivery_address, ordered_at')
      .single();

    if (orderError) {
      return res.status(400).json({ success: false, message: '주문 생성 실패', error: orderError.message });
    }

    const orderItemRows = cartItems.map((ci) => {
      const menu = ci.menus as { price: number } | null;
      return {
        order_id: order.id,
        menu_id: ci.menu_id,
        quantity: ci.quantity ?? 1,
        price: menu?.price ?? 0,
      };
    });

    const { error: itemsError } = await supabase.from('order_items').insert(orderItemRows);
    if (itemsError) {
      return res.status(400).json({ success: false, message: '주문 아이템 저장 실패', error: itemsError.message });
    }

    await supabase.from('cart_items').delete().in('id', cartItems.map((ci) => ci.id));

    res.status(201).json({ success: true, message: '주문이 완료됐습니다.', data: order });
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/orders/:orderId  [auth]
router.get('/:orderId', authMiddleware, async (req, res, next) => {
  try {
    const orderId = Number(req.params.orderId);

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id, status, total_amount, delivery_address, ordered_at,
        order_items(id, menu_id, quantity, price, menus(name, image_url))
      `)
      .eq('id', orderId)
      .maybeSingle();

    if (error || !order) {
      return res.status(404).json({ success: false, message: '주문을 찾을 수 없습니다.' });
    }

    res.json({ success: true, message: '주문 조회 성공', data: order });
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/orders/:orderId/status
router.get('/:orderId/status', async (req, res, next) => {
  try {
    const orderId = Number(req.params.orderId);

    const { data: order, error } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .maybeSingle();

    if (error || !order) {
      return res.status(404).json({ success: false, message: '주문을 찾을 수 없습니다.' });
    }

    const status = order.status ?? 'UNKNOWN';
    res.json({
      success: true,
      message: '주문 상태 조회 성공',
      data: { status, gauge: ORDER_STATUS_GAUGE[status] ?? 0 },
    });
  } catch (e) {
    next(e);
  }
});

export default router;
