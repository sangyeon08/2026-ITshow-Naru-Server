// 응답에 다라 성공 여부 담아서 알려줌. + 에러코드도 담아뒀으니까 보기 편할듯!

import type { ApiFailure, ApiResult, ApiSuccess } from '../types';

export function ok<T>(data: T): ApiSuccess<T> {
	return {
		success: true,
		data,
	};
}

export function fail(code: string, message: string): ApiFailure {
	return {
		success: false,
		error: {
			code,
			message,
		},
	};
}

export function requiredString(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0;
}

export function unwrapOrThrow<T>(result: ApiResult<T>): T {
	if (result.success) {
		return result.data;
	}

	throw new Error(`${result.error.code}: ${result.error.message}`);
}
