// api 돌리려고 만든 더미데이터! 나중에 진짜 DB 연결하고 값 넣으면 지울 예정

import type {
	CartItem,
	CategorySummary,
	FavoriteStore,
	MenuSummary,
	OrderSummary,
	StoreDetail,
	UserSummary,
} from '../types';

export const users: UserSummary[] = [
	{
		id: 1,
		email: 'john@example.com',
		name: 'John Tourist',
		phone: '010-1111-2222',
		allergyInfo: ['peanut'],
	},
	{
		id: 2,
		email: 'anna@example.com',
		name: 'Anna Traveler',
		phone: '010-3333-4444',
		allergyInfo: ['shellfish'],
	},
];

export const categories: CategorySummary[] = [
	{
		id: 'korean',
		title: 'Korean',
		image: 'assets/images/cat_korean.png',
		description: 'Warm rice bowls, stews, and bold Korean favorites ready for delivery.',
	},
	{
		id: 'chicken',
		title: 'Chicken',
		image: 'assets/images/cat_chicken_single.png',
		description: 'Crispy fried chicken, sweet-spicy sauces, and franchise favorites.',
	},
	{
		id: 'street',
		title: 'Street',
		image: 'assets/images/cat_street.png',
		description: 'Street-food classics for quick cravings, late snacks, and sharing.',
	},
	{
		id: 'coffee',
		title: 'Coffee',
		image: 'assets/images/cat_coffee.png',
		description: 'Coffee, tea, and cafe drinks for mornings and afternoon breaks.',
	},
];

export const stores: StoreDetail[] = [
	{
		id: 1,
		name: 'Simin Jokbal Bossam Sillim',
		subtitle: 'Tender jokbal and bossam plates for a filling meal.',
		category: 'Korean',
		rating: 5.0,
		reviewCount: 2002,
		deliveryTime: '25~40min',
		image: 'assets/images/food_jokbal.png',
		distance: '1.2km away',
		minimumOrderAmount: 15000,
		deliveryFee: 0,
		heroImage: 'assets/images/food_jokbal.png',
		logoImage: 'assets/images/jockbal_profile.png',
		allergyInfo: ['pork', 'soy', 'sesame'],
		address: 'Seoul Gwanak-gu Sillim-dong',
		country: 'KR',
	},
	{
		id: 2,
		name: 'Yupki Ddukbokki Sillim',
		subtitle: 'Spicy tteokbokki with chewy rice cakes and fish cake.',
		category: 'Street',
		rating: 4.8,
		reviewCount: 132,
		deliveryTime: '20~35min',
		image: 'assets/images/food_tteokbokki.png',
		distance: '900m away',
		minimumOrderAmount: 12000,
		deliveryFee: 3000,
		heroImage: 'assets/images/food_tteokbokki.png',
		logoImage: 'assets/images/yupki_profile.png',
		allergyInfo: ['wheat', 'soy', 'fish'],
		address: 'Seoul Gwanak-gu Sillim-ro',
		country: 'KR',
	},
	{
		id: 3,
		name: 'Nene Chicken',
		subtitle: 'Crispy chicken with classic Korean dipping sauces.',
		category: 'Chicken',
		rating: 4.7,
		reviewCount: 905,
		deliveryTime: '30~45min',
		image: 'assets/images/franchise_nene_bg.png',
		distance: '2.3km away',
		minimumOrderAmount: 16000,
		deliveryFee: 2000,
		heroImage: 'assets/images/franchise_nene_bg.png',
		logoImage: 'assets/images/franchise_nene_logo.png',
		allergyInfo: ['chicken', 'wheat', 'soy'],
		address: 'Seoul Mapo-gu',
		country: 'KR',
	},
	{
		id: 4,
		name: 'Ediya Coffee Sillim',
		subtitle: 'Reliable iced coffee and quick cafe delivery.',
		category: 'Coffee',
		rating: 4.6,
		reviewCount: 421,
		deliveryTime: '15~25min',
		image: 'assets/images/cat_ediya.png',
		distance: '650m away',
		minimumOrderAmount: 8000,
		deliveryFee: 2500,
		heroImage: 'assets/images/cat_ediya.png',
		logoImage: 'assets/images/cat_ediya.png',
		allergyInfo: ['milk'],
		address: 'Seoul Gwanak-gu',
		country: 'KR',
	},
];

export const menus: MenuSummary[] = [
	{
		id: 1,
		storeId: 1,
		name: 'Half [Jok, Bo Set]',
		description: 'Jokbal and bossam set with rich savory flavor.',
		price: 38000,
		image: 'assets/images/food_jokbal.png',
		rating: 3.2,
		reviewCount: 132,
		options: [
			{
				name: 'Price',
				required: true,
				items: [
					{ label: 'Small (2-3 servings)', priceDelta: 0 },
					{ label: 'Medium (3-4 servings)', priceDelta: 10000 },
					{ label: 'Large (4-5 servings)', priceDelta: 20000 },
				],
			},
			{
				name: 'Choose Jokbal',
				required: true,
				items: [
					{ label: 'Jokbal', priceDelta: 0 },
					{ label: 'Medium (3-4 servings)', priceDelta: 3000 },
					{ label: 'Large (4-5 servings)', priceDelta: 3000 },
				],
			},
			{
				name: 'Choose Drink',
				required: false,
				items: [
					{ label: 'CokaCola 500ml', priceDelta: 0 },
					{ label: 'Sprite 500ml', priceDelta: 0 },
					{ label: 'Fanta', priceDelta: 1000 },
				],
			},
		],
	},
	{
		id: 2,
		storeId: 2,
		name: 'Mala Tteokbokki',
		description: 'A spicy mala twist on chewy Korean tteokbokki.',
		price: 12000,
		image: 'assets/images/Mala_Tteokbokki.png',
		rating: 4.1,
		reviewCount: 88,
		options: [],
	},
	{
		id: 3,
		storeId: 3,
		name: 'Spicy Seasoned Chicken',
		description: 'Saucy, spicy, and built for sharing.',
		price: 19000,
		image: 'assets/images/Spicyseasoned.png',
		rating: 4.5,
		reviewCount: 205,
		options: [],
	},
];

export const cartItems: CartItem[] = [
	{
		id: 1,
		menuId: 1,
		menuName: 'Half [Jok, Bo Set]',
		image: 'assets/images/food_jokbal.png',
		options: [
			{ name: 'Price', label: 'Small (2-3 servings)' },
			{ name: 'Choose Jokbal', label: 'Jokbal' },
			{ name: 'Choose Drink', label: 'CokaCola 500ml' },
		],
		optionsSummary: 'Small (2-3 servings) · Jokbal · CokaCola 500ml',
		unitPrice: 38000,
		quantity: 1,
		totalPrice: 38000,
	},
];

export const orders: OrderSummary[] = [
	{
		id: 1,
		status: 'PAID',
		paidAmount: 41000,
		type: 'DELIVERY',
		address: 'Seoul Jung-gu Hotel Naru',
		paymentMethod: 'Credit',
		createdAt: '2026-05-29T00:00:00.000Z',
		items: cartItems,
	},
];

export const favorites: FavoriteStore[] = [
	{
		id: 3,
		name: 'Nene Chicken',
		image: 'assets/images/cat_chicken_single.png',
		category: 'Chicken',
	},
	{
		id: 2,
		name: 'Yupki Ddukbokki',
		image: 'assets/images/food_tteokbokki.png',
		category: 'Street',
	},
];
