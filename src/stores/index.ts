import { fail, ok } from '../common';
import { categories, stores } from '../common/mock-data';
import type { ApiResult, CategorySummary, StoreDetail, StoreSummary } from '../types';

export function getCategories(): ApiResult<{ categories: CategorySummary[] }> {
	return ok({ categories });
}

export function searchStores(query = ''): ApiResult<{ stores: StoreSummary[] }> {
	const normalizedQuery = query.trim().toLowerCase();
	const result = normalizedQuery
		? stores.filter((store) => {
				const searchable = `${store.name} ${store.subtitle} ${store.category}`.toLowerCase();
				return searchable.includes(normalizedQuery);
			})
		: stores;

	return ok({
		stores: result.map(toStoreSummary),
	});
}

export function getNearbyStores(): ApiResult<{ stores: StoreSummary[] }> {
	return ok({
		stores: stores.map(toStoreSummary),
	});
}

export function getStoreById(storeId: number): ApiResult<{ store: StoreDetail }> {
	const store = stores.find((item) => item.id === storeId);
	if (!store) {
		return fail('STORE_NOT_FOUND', 'Store was not found.');
	}

	return ok({ store });
}

function toStoreSummary(store: StoreDetail): StoreSummary {
	return {
		id: store.id,
		name: store.name,
		subtitle: store.subtitle,
		category: store.category,
		rating: store.rating,
		reviewCount: store.reviewCount,
		deliveryTime: store.deliveryTime,
		image: store.image,
		distance: store.distance,
	};
}
