import { ok } from '../common';
import { favorites, orders, users } from '../common/mock-data';
import type { ApiResult, FavoriteStore, OrderSummary, UserSummary } from '../types';

export function getMe(): ApiResult<{ user: UserSummary }> {
	return ok({ user: users[0] });
}

export function getMyOrders(): ApiResult<{ orders: OrderSummary[] }> {
	return ok({ orders });
}

export function getMyFavorites(): ApiResult<{ stores: FavoriteStore[] }> {
	return ok({ stores: favorites });
}
