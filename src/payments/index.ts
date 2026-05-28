import { ok } from '../common';
import type { ApiResult } from '../types';

export function confirmPayment(orderId: number): ApiResult<{ orderId: number; status: 'PAID' }> {
	return ok({
		orderId,
		status: 'PAID',
	});
}
