import { ok } from '../common';
import type { ApiResult } from '../types';

export function getNotifications(): ApiResult<{ notifications: Array<{ id: number; title: string; message: string }> }> {
	return ok({
		notifications: [
			{
				id: 1,
				title: 'Order received',
				message: 'Your order has been received by the store.',
			},
		],
	});
}
