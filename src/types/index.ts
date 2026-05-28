export type ApiSuccess<T> = {
	success: true;
	data: T;
};

export type ApiFailure = {
	success: false;
	error: {
		code: string;
		message: string;
	};
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export type OrderType = 'DELIVERY' | 'PICKUP';

export type OrderStatus = 'PAID' | 'COOKING' | 'DELIVERING' | 'COMPLETED' | 'CANCELED';

export interface UserSummary {
	id: number;
	email: string;
	name: string;
	phone?: string;
	allergyInfo?: string[];
}

export interface CategorySummary {
	id: string;
	title: string;
	image: string;
	description: string;
}

export interface StoreSummary {
	id: number;
	name: string;
	subtitle: string;
	category: string;
	rating: number;
	reviewCount: number;
	deliveryTime: string;
	image: string;
	distance?: string;
}

export interface StoreDetail extends StoreSummary {
	minimumOrderAmount: number;
	deliveryFee: number;
	heroImage: string;
	logoImage: string;
	allergyInfo: string[];
	address: string;
	country: string;
}

export interface MenuOptionItem {
	label: string;
	priceDelta: number;
}

export interface MenuOptionGroup {
	name: string;
	required: boolean;
	items: MenuOptionItem[];
}

export interface MenuSummary {
	id: number;
	storeId: number;
	name: string;
	description: string;
	price: number;
	image: string;
	rating: number;
	reviewCount: number;
	options: MenuOptionGroup[];
}

export interface SelectedOption {
	name: string;
	label: string;
}

export interface CartItem {
	id: number;
	menuId: number;
	menuName: string;
	image: string;
	options: SelectedOption[];
	optionsSummary: string;
	unitPrice: number;
	quantity: number;
	totalPrice: number;
}

export interface CartSummary {
	items: CartItem[];
	subtotal: number;
	deliveryFee: number;
	discount: number;
	total: number;
}

export interface OrderSummary {
	id: number;
	status: OrderStatus;
	paidAmount: number;
	type: OrderType;
	address?: string;
	paymentMethod: string;
	createdAt: string;
	items: CartItem[];
}

export interface FavoriteStore {
	id: number;
	name: string;
	image: string;
	category: string;
}

export interface ExchangeBalance {
	balanceKRW: number;
	balanceUSD: number;
}
