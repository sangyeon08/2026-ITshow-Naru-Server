import express from 'express';
import { supabase } from '../utils/supabase';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);

async function getOrCreateCartId(userId: number): Promise<number> {
  const { data: existing } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from('carts')
    .insert({ user_id: userId })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  return created.id;
}

async function buildCartData(cartId: number) {
  const { data, error } = await supabase
    .from('cart_items')
    .select('id, menu_id, quantity, menus(id, name, price, image_url)')
    .eq('cart_id', cartId);

  if (error) throw new Error(error.message);

  const items = (data ?? []).map((row) => {
    const menu = row.menus as { id: number; name: string | null; price: number; image_url: string | null } | null;
    const price = menu?.price ?? 0;
    const quantity = row.quantity ?? 1;
    return {
      id: row.id,
      menuId: row.menu_id,
      menuName: menu?.name ?? '',
      imageUrl: menu?.image_url ?? '',
      price,
      quantity,
      totalPrice: price * quantity,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  return { items, subtotal, total: subtotal };
}

// GET /api/v1/cart
router.get('/', async (req, res, next) => {
  try {
    const cartId = await getOrCreateCartId(req.userId!);
    const data = await buildCartData(cartId);
    res.json({ success: true, message: '장바구니 조회 성공', data });
  } catch (e) {
    next(e);
  }
});

// POST /api/v1/cart/items
router.post('/items', async (req, res, next) => {
  try {
    const { menuId, quantity = 1 } = req.body;

    if (!menuId || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'menuId와 quantity(>0)가 필요합니다.' });
    }

    const { data: menu, error: menuError } = await supabase
      .from('menus')
      .select('id, name, price')
      .eq('id', menuId)
      .maybeSingle();

    if (menuError || !menu) {
      return res.status(404).json({ success: false, message: '메뉴를 찾을 수 없습니다.' });
    }

    const cartId = await getOrCreateCartId(req.userId!);

    const { data: cartItem, error: insertError } = await supabase
      .from('cart_items')
      .insert({ cart_id: cartId, menu_id: menuId, quantity })
      .select('id, menu_id, quantity')
      .single();

    if (insertError) {
      return res.status(400).json({ success: false, message: '장바구니 추가 실패', error: insertError.message });
    }

    const cart = await buildCartData(cartId);
    res.status(201).json({ success: true, message: '장바구니에 추가했습니다.', data: { cartItem, cart } });
  } catch (e) {
    next(e);
  }
});

// PATCH /api/v1/cart/items/:cartItemId
router.patch('/items/:cartItemId', async (req, res, next) => {
  try {
    const cartItemId = Number(req.params.cartItemId);
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'quantity(>0)가 필요합니다.' });
    }

    const { data: existing, error: fetchError } = await supabase
      .from('cart_items')
      .select('id, cart_id, carts(user_id)')
      .eq('id', cartItemId)
      .maybeSingle();

    if (fetchError || !existing) {
      return res.status(404).json({ success: false, message: '장바구니 항목을 찾을 수 없습니다.' });
    }

    const cartUserId = (existing.carts as { user_id: number | null } | null)?.user_id;
    if (cartUserId !== req.userId) {
      return res.status(404).json({ success: false, message: '장바구니 항목을 찾을 수 없습니다.' });
    }

    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId);

    if (updateError) {
      return res.status(400).json({ success: false, message: '수량 변경 실패', error: updateError.message });
    }

    const cart = await buildCartData(existing.cart_id!);
    res.json({ success: true, message: '수량을 변경했습니다.', data: cart });
  } catch (e) {
    next(e);
  }
});

// DELETE /api/v1/cart/items/:cartItemId
router.delete('/items/:cartItemId', async (req, res, next) => {
  try {
    const cartItemId = Number(req.params.cartItemId);

    const { data: existing, error: fetchError } = await supabase
      .from('cart_items')
      .select('id, cart_id, carts(user_id)')
      .eq('id', cartItemId)
      .maybeSingle();

    if (fetchError || !existing) {
      return res.status(404).json({ success: false, message: '장바구니 항목을 찾을 수 없습니다.' });
    }

    const cartUserId = (existing.carts as { user_id: number | null } | null)?.user_id;
    if (cartUserId !== req.userId) {
      return res.status(404).json({ success: false, message: '장바구니 항목을 찾을 수 없습니다.' });
    }

    const { error: deleteError } = await supabase.from('cart_items').delete().eq('id', cartItemId);

    if (deleteError) {
      return res.status(400).json({ success: false, message: '삭제 실패', error: deleteError.message });
    }

    const cart = await buildCartData(existing.cart_id!);
    res.json({ success: true, message: '장바구니에서 삭제했습니다.', data: cart });
  } catch (e) {
    next(e);
  }
});

export default router;
