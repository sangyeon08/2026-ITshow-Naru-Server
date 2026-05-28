import { fail, ok } from '../common';
import { cartItems, orders } from '../common/mock-data';
import type { ApiResult, OrderSummary, OrderType } from '../types';

export interface CreateOrderRequest {
	type?: unknown;
	address?: unknown;
	paymentMethod?: unknown;
	cartItemIds?: unknown;
	requestNote?: unknown;
}

export function createOrder(body: CreateOrderRequest): ApiResult<{ order: OrderSummary }> {
	const type = normalizeOrderType(body.type);
	if (!type) {
		return fail('INVALID_ORDER_TYPE', 'type must be DELIVERY or PICKUP.');
	}

	const paymentMethod = typeof body.paymentMethod === 'string' ? body.paymentMethod : 'Credit';
	const cartItemIds = Array.isArray(body.cartItemIds)
		? body.cartItemIds.map(Number).filter((id) => Number.isInteger(id))
		: cartItems.map((item) => item.id);
	const selectedItems = cartItems.filter((item) => cartItemIds.includes(item.id));

	if (selectedItems.length === 0) {
		return fail('EMPTY_ORDER', 'At least one cart item is required.');
	}

	const subtotal = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
	const order: OrderSummary = {
		id: orders.length + 1,
		status: 'PAID',
		paidAmount: subtotal + 3000,
		type,
		address: typeof body.address === 'string' ? body.address : undefined,
		paymentMethod,
		createdAt: new Date().toISOString(),
		items: selectedItems,
	};

	orders.push(order);

	return ok({ order });
}

export function getOrderById(orderId: number): ApiResult<{ order: OrderSummary }> {
	const order = orders.find((item) => item.id === orderId);
	if (!order) {
		return fail('ORDER_NOT_FOUND', 'Order was not found.');
	}

	return ok({ order });
}

export function getOrderStatus(orderId: number): ApiResult<{ status: string; gauge: number }> {
	const order = orders.find((item) => item.id === orderId);
	if (!order) {
		return fail('ORDER_NOT_FOUND', 'Order was not found.');
	}

	const gaugeByStatus: Record<string, number> = {
		PAID: 10,
		COOKING: 35,
		DELIVERING: 75,
		COMPLETED: 100,
		CANCELED: 0,
	};

	return ok({
		status: order.status,
		gauge: gaugeByStatus[order.status] ?? 0,
	});
}

function normalizeOrderType(type: unknown): OrderType | null {
	if (type === 'DELIVERY' || type === 'PICKUP') {
		return type;
	}

	return null;
}
