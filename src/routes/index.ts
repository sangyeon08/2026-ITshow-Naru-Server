export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RoutePriority = 'P0' | 'P1';

export interface ApiRoute {
	priority: RoutePriority;
	domain: string;
	name: string;
	method: HttpMethod;
	endpoint: string;
	description: string;
	requestExample: string;
	responseExample: string;
}

export const routes: ApiRoute[] = [
	{
		priority: 'P0',
		domain: 'system',
		name: 'Health check',
		method: 'GET',
		endpoint: '/health',
		description: '서버 실행 상태 확인',
		requestExample: '(none)',
		responseExample: '{"status":"ok","service":"naru-backend-api"}',
	},
	{
		priority: 'P0',
		domain: 'auth',
		name: 'Login',
		method: 'POST',
		endpoint: '/api/v1/auth/login',
		description: '이메일과 비밀번호로 로그인하고 개발용 토큰을 반환',
		requestExample: '{"email":"john@example.com","password":"test-password"}',
		responseExample:
			'{"user":{"id":1,"email":"john@example.com","name":"John Tourist"},"token":"dev-token-1"}',
	},
	{
		priority: 'P0',
		domain: 'auth',
		name: 'Signup',
		method: 'POST',
		endpoint: '/api/v1/auth/signup',
		description: '신규 사용자 가입 후 개발용 토큰을 반환',
		requestExample: '{"email":"new@example.com","username":"New User","password":"test-password"}',
		responseExample:
			'{"user":{"id":3,"email":"new@example.com","name":"New User","allergyInfo":[]},"token":"dev-token-3"}',
	},
	{
		priority: 'P0',
		domain: 'stores',
		name: 'Categories',
		method: 'GET',
		endpoint: '/api/v1/categories',
		description: '홈 화면 카테고리 그리드 조회',
		requestExample: '(none)',
		responseExample:
			'{"categories":[{"id":"korean","title":"Korean","image":"assets/images/cat_korean.png","description":"Warm rice bowls..."}]}',
	},
	{
		priority: 'P0',
		domain: 'stores',
		name: 'Store search',
		method: 'GET',
		endpoint: '/api/v1/stores/search',
		description: '검색어 기반 가게 목록 조회',
		requestExample: 'Query: ?query=tteokbokki',
		responseExample:
			'{"stores":[{"id":2,"name":"Yupki Ddukbokki Sillim","category":"Street","rating":4.8}]}',
	},
	{
		priority: 'P0',
		domain: 'stores',
		name: 'Store detail',
		method: 'GET',
		endpoint: '/api/v1/stores/{storeId}',
		description: '가게 상세 정보 조회',
		requestExample: 'Path: storeId=1',
		responseExample:
			'{"store":{"id":1,"name":"Simin Jokbal Bossam Sillim","minimumOrderAmount":15000,"deliveryFee":0}}',
	},
	{
		priority: 'P0',
		domain: 'menus',
		name: 'Store menus',
		method: 'GET',
		endpoint: '/api/v1/stores/{storeId}/menus',
		description: '가게별 메뉴와 옵션 목록 조회',
		requestExample: 'Path: storeId=1',
		responseExample:
			'{"menus":[{"id":1,"storeId":1,"name":"Half [Jok, Bo Set]","price":38000,"options":[...]}]}',
	},
	{
		priority: 'P0',
		domain: 'cart',
		name: 'Add cart item',
		method: 'POST',
		endpoint: '/api/v1/cart/items',
		description: '선택한 메뉴 옵션을 장바구니에 추가',
		requestExample:
			'{"menuId":1,"quantity":1,"options":[{"name":"Price","label":"Small (2-3 servings)"}]}',
		responseExample: '{"cartItem":{"id":1,"menuId":1,"menuName":"Half [Jok, Bo Set]"},"cart":{...}}',
	},
	{
		priority: 'P0',
		domain: 'cart',
		name: 'Cart',
		method: 'GET',
		endpoint: '/api/v1/cart',
		description: '장바구니 목록과 금액 합계 조회',
		requestExample: '(none)',
		responseExample: '{"items":[...],"subtotal":38000,"deliveryFee":3000,"discount":0,"total":41000}',
	},
	{
		priority: 'P0',
		domain: 'cart',
		name: 'Update cart item',
		method: 'PATCH',
		endpoint: '/api/v1/cart/items/{cartItemId}',
		description: '장바구니 항목 수량 변경',
		requestExample: '{"quantity":2}',
		responseExample: '{"cartItem":{"id":1,"quantity":2,"totalPrice":76000},"cart":{...}}',
	},
	{
		priority: 'P0',
		domain: 'cart',
		name: 'Remove cart item',
		method: 'DELETE',
		endpoint: '/api/v1/cart/items/{cartItemId}',
		description: '장바구니 항목 삭제',
		requestExample: 'Path: cartItemId=1',
		responseExample: '{"items":[],"subtotal":0,"deliveryFee":3000,"discount":0,"total":3000}',
	},
	{
		priority: 'P0',
		domain: 'orders',
		name: 'Create order',
		method: 'POST',
		endpoint: '/api/v1/orders',
		description: '배달 또는 픽업 주문 생성',
		requestExample:
			'{"type":"DELIVERY","address":"Seoul Jung-gu Hotel Naru","paymentMethod":"Credit","cartItemIds":[1]}',
		responseExample: '{"order":{"id":1,"status":"PAID","paidAmount":41000,"type":"DELIVERY"}}',
	},
	{
		priority: 'P1',
		domain: 'users',
		name: 'My profile',
		method: 'GET',
		endpoint: '/api/v1/users/me',
		description: '마이페이지 사용자 프로필 조회',
		requestExample: 'Header: Authorization: Bearer dev-token-1',
		responseExample: '{"user":{"id":1,"email":"john@example.com","name":"John Tourist"}}',
	},
	{
		priority: 'P1',
		domain: 'users',
		name: 'My orders',
		method: 'GET',
		endpoint: '/api/v1/users/me/orders',
		description: '마이페이지 주문 내역 조회',
		requestExample: 'Header: Authorization: Bearer dev-token-1',
		responseExample: '{"orders":[{"id":1,"status":"PAID","paidAmount":41000}]}',
	},
	{
		priority: 'P1',
		domain: 'users',
		name: 'My favorites',
		method: 'GET',
		endpoint: '/api/v1/users/me/favorites',
		description: '찜한 가게 목록 조회',
		requestExample: 'Header: Authorization: Bearer dev-token-1',
		responseExample: '{"stores":[{"id":3,"name":"Nene Chicken","category":"Chicken"}]}',
	},
	{
		priority: 'P1',
		domain: 'stores',
		name: 'Nearby stores',
		method: 'GET',
		endpoint: '/api/v1/stores/nearby',
		description: '현재 위치 기반 주변 가게 조회',
		requestExample: 'Query: ?lat=37.5&lng=127.0',
		responseExample: '{"stores":[{"id":1,"name":"Simin Jokbal Bossam Sillim","distance":"1.2km away"}]}',
	},
	{
		priority: 'P1',
		domain: 'maps',
		name: 'Place search',
		method: 'GET',
		endpoint: '/api/v1/map/search',
		description: '길찾기 장소 검색',
		requestExample: 'Query: ?destination=Hongdae',
		responseExample: '{"places":[{"id":"place-1","name":"Hongdae Station","address":"Seoul, Korea"}]}',
	},
	{
		priority: 'P1',
		domain: 'maps',
		name: 'Routes',
		method: 'GET',
		endpoint: '/api/v1/map/routes',
		description: '길찾기 경로 조회',
		requestExample: 'Query: ?startLat=...&startLng=...&endLat=...&endLng=...',
		responseExample: '{"routes":[{"type":"WALK","duration":"12min","summary":"Walk straight..."}]}',
	},
	{
		priority: 'P1',
		domain: 'exchange',
		name: 'Exchange balance',
		method: 'GET',
		endpoint: '/api/v1/exchange/balance',
		description: '마이페이지 환전 잔액 조회',
		requestExample: 'Header: Authorization: Bearer dev-token-1',
		responseExample: '{"balanceKRW":67500,"balanceUSD":50}',
	},
	{
		priority: 'P1',
		domain: 'exchange',
		name: 'Exchange rate',
		method: 'GET',
		endpoint: '/api/v1/exchange/rates',
		description: '환율 조회',
		requestExample: 'Query: ?from=USD&to=KRW',
		responseExample: '{"from":"USD","to":"KRW","rate":1350.5}',
	},
];

export const groupedRoutes = routes.reduce<Record<string, ApiRoute[]>>((groups, route) => {
	if (!groups[route.domain]) {
		groups[route.domain] = [];
	}

	groups[route.domain].push(route);
	return groups;
}, {});
