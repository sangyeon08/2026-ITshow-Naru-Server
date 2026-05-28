import { ok } from '../common';
import type { ApiResult, ExchangeBalance } from '../types';

export function getExchangeBalance(): ApiResult<ExchangeBalance> {
	return ok({
		balanceKRW: 67500,
		balanceUSD: 50,
	});
}

export function getExchangeRate(from = 'USD', to = 'KRW'): ApiResult<{ from: string; to: string; rate: number }> {
	return ok({
		from,
		to,
		rate: from === 'USD' && to === 'KRW' ? 1350.5 : 1,
	});
}
