import { ok } from '../common';
import type { ApiResult } from '../types';

export function searchPlaces(destination = ''): ApiResult<{ places: Array<{ id: string; name: string; address: string }> }> {
	const keyword = destination.trim() || 'Seoul';

	return ok({
		places: [
			{
				id: 'place-1',
				name: `${keyword} Station`,
				address: 'Seoul, Korea',
			},
			{
				id: 'place-2',
				name: `${keyword} Food Street`,
				address: 'Seoul Jung-gu',
			},
		],
	});
}

export function getRoutes(): ApiResult<{ routes: Array<{ type: string; duration: string; summary: string }> }> {
	return ok({
		routes: [
			{
				type: 'WALK',
				duration: '12min',
				summary: 'Walk straight and turn right near the station.',
			},
			{
				type: 'BUS',
				duration: '18min',
				summary: 'Take bus 501 and get off after 3 stops.',
			},
		],
	});
}
