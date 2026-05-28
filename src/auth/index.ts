import { fail, ok, requiredString } from '../common';
import { users } from '../common/mock-data';
import type { ApiResult, UserSummary } from '../types';

export interface LoginRequest {
	email?: unknown;
	password?: unknown;
}

export interface SignupRequest {
	email?: unknown;
	username?: unknown;
	name?: unknown;
	password?: unknown;
	phone?: unknown;
}

export interface AuthResponse {
	user: UserSummary;
	token: string;
}

export function login(body: LoginRequest): ApiResult<AuthResponse> {
	if (!requiredString(body.email) || !requiredString(body.password)) {
		return fail('INVALID_AUTH_REQUEST', 'email and password are required.');
	}

	const user = users.find((item) => item.email === body.email);
	if (!user) {
		return fail('INVALID_CREDENTIALS', 'Invalid email or password.');
	}

	return ok({
		user,
		token: `dev-token-${user.id}`,
	});
}

export function signup(body: SignupRequest): ApiResult<AuthResponse> {
	if (!requiredString(body.email) || !requiredString(body.password)) {
		return fail('INVALID_SIGNUP_REQUEST', 'email and password are required.');
	}

	const nameSource = body.username ?? body.name;
	if (!requiredString(nameSource)) {
		return fail('INVALID_SIGNUP_REQUEST', 'username or name is required.');
	}

	const existingUser = users.find((item) => item.email === body.email);
	if (existingUser) {
		return fail('EMAIL_ALREADY_EXISTS', 'This email is already registered.');
	}

	const user: UserSummary = {
		id: users.length + 1,
		email: body.email,
		name: nameSource,
		phone: requiredString(body.phone) ? body.phone : undefined,
		allergyInfo: [],
	};

	return ok({
		user,
		token: `dev-token-${user.id}`,
	});
}
