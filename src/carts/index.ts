import { fail, ok } from '../common';
import { cartItems, menus } from '../common/mock-data';
import type { ApiResult, CartItem, CartSummary, SelectedOption } from '../types';

export interface AddCartItemRequest {
	menuId?: unknown;
	quantity?: unknown;
	options?: unknown;
}

export interface UpdateCartItemRequest {
	quantity?: unknown;
}

const deliveryFee = 3000;
const discount = 0;

export function getCart(): ApiResult<CartSummary> {
	return ok(buildCartSummary(cartItems));
}

export function addCartItem(body: AddCartItemRequest): ApiResult<{ cartItem: CartItem; cart: CartSummary }> {
	const menuId = Number(body.menuId);
	const quantity = Number(body.quantity ?? 1);

	if (!Number.isInteger(menuId) || menuId <= 0) {
		return fail('INVALID_CART_ITEM', 'menuId must be a positive number.');
	}

	if (!Number.isInteger(quantity) || quantity <= 0) {
		return fail('INVALID_CART_ITEM', 'quantity must be a positive number.');
	}

	const menu = menus.find((item) => item.id === menuId);
	if (!menu) {
		return fail('MENU_NOT_FOUND', 'Menu was not found.');
	}

	const options = normalizeOptions(body.options);
	const optionPrice = options.reduce((sum, selected) => {
		const group = menu.options.find((item) => item.name === selected.name);
		const option = group?.items.find((item) => item.label === selected.label);
		return sum + (option?.priceDelta ?? 0);
	}, 0);

	const unitPrice = menu.price + optionPrice;
	const cartItem: CartItem = {
		id: cartItems.length + 1,
		menuId: menu.id,
		menuName: menu.name,
		image: menu.image,
		options,
		optionsSummary: options.map((option) => option.label).join(' · '),
		unitPrice,
		quantity,
		totalPrice: unitPrice * quantity,
	};

	cartItems.push(cartItem);

	return ok({
		cartItem,
		cart: buildCartSummary(cartItems),
	});
}

export function updateCartItem(
	cartItemId: number,
	body: UpdateCartItemRequest,
): ApiResult<{ cartItem: CartItem; cart: CartSummary }> {
	const quantity = Number(body.quantity);
	if (!Number.isInteger(quantity) || quantity <= 0) {
		return fail('INVALID_CART_ITEM', 'quantity must be a positive number.');
	}

	const cartItem = cartItems.find((item) => item.id === cartItemId);
	if (!cartItem) {
		return fail('CART_ITEM_NOT_FOUND', 'Cart item was not found.');
	}

	cartItem.quantity = quantity;
	cartItem.totalPrice = cartItem.unitPrice * quantity;

	return ok({
		cartItem,
		cart: buildCartSummary(cartItems),
	});
}

export function removeCartItem(cartItemId: number): ApiResult<CartSummary> {
	const index = cartItems.findIndex((item) => item.id === cartItemId);
	if (index < 0) {
		return fail('CART_ITEM_NOT_FOUND', 'Cart item was not found.');
	}

	cartItems.splice(index, 1);
	return ok(buildCartSummary(cartItems));
}

function buildCartSummary(items: CartItem[]): CartSummary {
	const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

	return {
		items,
		subtotal,
		deliveryFee,
		discount,
		total: subtotal + deliveryFee - discount,
	};
}

function normalizeOptions(options: unknown): SelectedOption[] {
	if (!Array.isArray(options)) {
		return [];
	}

	return options
		.filter((item): item is Record<string, unknown> => item !== null && typeof item === 'object')
		.filter((item) => typeof item.name === 'string' && typeof item.label === 'string')
		.map((item) => ({
			name: item.name as string,
			label: item.label as string,
		}));
}
