import { login, signup } from './auth';
import { addCartItem, getCart, removeCartItem, updateCartItem } from './carts';
import { getExchangeBalance, getExchangeRate } from './exchanges';
import { searchPlaces, getRoutes } from './maps';
import { getMenusByStoreId } from './menus';
import { createOrder, getOrderById, getOrderStatus } from './orders';
import { getCategories, getNearbyStores, getStoreById, searchStores } from './stores';
import { getMe, getMyFavorites, getMyOrders } from './users';

export const app = {
	name: 'naru-backend-api',
};

export function healthCheck() {
	return {
		status: 'ok',
		service: app.name,
	};
}

export const apiHandlers = {
	healthCheck,
	auth: {
		login,
		signup,
	},
	stores: {
		getCategories,
		searchStores,
		getNearbyStores,
		getStoreById,
	},
	menus: {
		getMenusByStoreId,
	},
	cart: {
		getCart,
		addCartItem,
		updateCartItem,
		removeCartItem,
	},
	orders: {
		createOrder,
		getOrderById,
		getOrderStatus,
	},
	users: {
		getMe,
		getMyOrders,
		getMyFavorites,
	},
	maps: {
		searchPlaces,
		getRoutes,
	},
	exchanges: {
		getExchangeBalance,
		getExchangeRate,
	},
};
