import { fail, ok } from '../common';
import { menus } from '../common/mock-data';
import type { ApiResult, MenuSummary } from '../types';

export function getMenusByStoreId(storeId: number): ApiResult<{ menus: MenuSummary[] }> {
	const result = menus.filter((menu) => menu.storeId === storeId);

	if (result.length === 0) {
		return fail('MENUS_NOT_FOUND', 'Menus were not found for this store.');
	}

	return ok({ menus: result });
}

export function getMenuById(menuId: number): ApiResult<{ menu: MenuSummary }> {
	const menu = menus.find((item) => item.id === menuId);
	if (!menu) {
		return fail('MENU_NOT_FOUND', 'Menu was not found.');
	}

	return ok({ menu });
}
