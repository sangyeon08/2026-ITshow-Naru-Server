export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRoute {
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
		domain: 'auth',
		name: '회원가입',
		method: 'POST',
		endpoint: '/api/v1/auth/signup',
		description: '이름, 이메일, 전화번호, 비밀번호 기입',
		requestExample: '{"name":"John", "email":"a@a.com", "password":"123"}',
		responseExample: '{"userId":1, "message":"가입 성공"}',
	},
	{
		domain: 'auth',
		name: '로그인',
		method: 'POST',
		endpoint: '/api/v1/auth/login',
		description: '이메일과 비밀번호로 로그인',
		requestExample: '{"email":"a@a.com", "password":"123"}',
		responseExample: '{"userId":1, "token":"jwt-token"}',
	},
	{
		domain: 'users',
		name: '유저 정보 조회',
		method: 'GET',
		endpoint: '/api/v1/users/me',
		description: '프로필 및 등록 정보(알레르기 등) 조회',
		requestExample: 'Header: {"Authorization": "Bearer..."}',
		responseExample: '{"name":"John", "allergy":"Peanut"}',
	},
	{
		domain: 'users',
		name: '주문 내역 조회',
		method: 'GET',
		endpoint: '/api/v1/users/me/orders',
		description: '과거 주문 내역 목록 조회',
		requestExample: 'Header: {"Authorization": "Bearer..."}',
		responseExample: '[{"orderId":101, "storeName":"국밥집"}]',
	},
	{
		domain: 'stores',
		name: '음식 검색',
		method: 'GET',
		endpoint: '/api/v1/stores/search',
		description: '검색바로 음식 검색',
		requestExample: 'Query: ?query=떡볶이',
		responseExample: '[{"storeId":2, "name":"신전떡볶이"}]',
	},
	{
		domain: 'stores',
		name: '카테고리 조회',
		method: 'GET',
		endpoint: '/api/v1/categories',
		description: '음식 종류(한식/중식 등) 조회',
		requestExample: '(없음)',
		responseExample: '[{"categoryId":1, "name":"한식"}]',
	},
	{
		domain: 'stores',
		name: '근처 맛집 조회',
		method: 'GET',
		endpoint: '/api/v1/stores/nearby',
		description: '내 위치 기반 근처 맛집 조회',
		requestExample: 'Query: ?lat=37.5&lng=127.0',
		responseExample: '[{"storeId":3, "dist":"100m"}]',
	},
	{
		domain: 'stores',
		name: '가게 상세 조회',
		method: 'GET',
		endpoint: '/api/v1/stores/{storeId}',
		description: '가게 메뉴 및 알레르기 안내 정보 조회',
		requestExample: 'Path: storeId=3',
		responseExample: '{"menus":[...], "hasAllergy":true}',
	},
	{
		domain: 'stores',
		name: '리뷰 조회',
		method: 'GET',
		endpoint: '/api/v1/stores/{storeId}/reviews',
		description: '같은/다른 나라 방문객 리뷰 조회',
		requestExample: 'Query: ?country=US',
		responseExample: '[{"user":"Anna", "content":"Good"}]',
	},
	{
		domain: 'cart',
		name: '장바구니 담기',
		method: 'POST',
		endpoint: '/api/v1/cart',
		description: '장바구니에 메뉴 담기',
		requestExample: '{"storeId":3, "menuId":12, "qty":1}',
		responseExample: '{"cartId":5, "totalPrice":15000}',
	},
	{
		domain: 'cart',
		name: '장바구니 조회',
		method: 'GET',
		endpoint: '/api/v1/cart',
		description: '담은 장바구니 내역 확인',
		requestExample: 'Header: {"Authorization": "Bearer..."}',
		responseExample: '{"items":[...], "totalPrice":15000}',
	},
	{
		domain: 'orders',
		name: '결제하기',
		method: 'POST',
		endpoint: '/api/v1/orders',
		description: '배달지 지정 및 카드 결제',
		requestExample: '{"cartId":5, "address":"Seoul"}',
		responseExample: '{"orderId":999, "status":"PAID"}',
	},
	{
		domain: 'orders',
		name: '주문 완료 내역',
		method: 'GET',
		endpoint: '/api/v1/orders/{orderId}',
		description: '결제 완료 표시 및 투명한 결제 내역',
		requestExample: 'Path: orderId=999',
		responseExample: '{"orderId":999, "paidAmount":15000}',
	},
	{
		domain: 'orders',
		name: '주문 현황 확인',
		method: 'GET',
		endpoint: '/api/v1/orders/{orderId}/status',
		description: '15초마다 갱신되는 주문 현황 (조리/배달)',
		requestExample: 'Path: orderId=999',
		responseExample: '{"status":"COOKING", "gauge":30}',
	},
	{
		domain: 'maps',
		name: '목적지 검색',
		method: 'GET',
		endpoint: '/api/v1/map/search',
		description: '목적지 검색 바를 통한 검색',
		requestExample: 'Query: ?destination=명동',
		responseExample: '[{"placeId":"p1", "name":"명동역"}]',
	},
	{
		domain: 'maps',
		name: '길찾기 경로',
		method: 'GET',
		endpoint: '/api/v1/map/routes',
		description: '현재 위치~목적지 대중교통 루트',
		requestExample: 'Query: ?startLat=...&endLat=...',
		responseExample: '{"routes":[{"type":"BUS"}]}',
	},
	{
		domain: 'exchange',
		name: '실시간 환율',
		method: 'GET',
		endpoint: '/api/v1/exchange/rates',
		description: '사용자의 돈과 한국 돈 실시간 환율',
		requestExample: 'Query: ?from=USD&to=KRW',
		responseExample: '{"rate":1350.50}',
	},
	{
		domain: 'exchange',
		name: '잔액 확인',
		method: 'GET',
		endpoint: '/api/v1/exchange/balance',
		description: '현재 자신의 잔액 확인',
		requestExample: 'Header: {"Authorization": "Bearer..."}',
		responseExample: '{"balanceKRW":50000, "balanceUSD":100}',
	},
	{
		domain: 'exchange',
		name: '환전/충전/환급',
		method: 'POST',
		endpoint: '/api/v1/exchange',
		description: '한국 돈 충전 또는 자국 돈으로 환급',
		requestExample: '{"type":"TO_KRW", "amount":50}',
		responseExample: '{"newBalanceKRW":117525}',
	},
];

export const groupedRoutes = routes.reduce<Record<string, ApiRoute[]>>((groups, route) => {
	if (!groups[route.domain]) {
		groups[route.domain] = [];
	}

	groups[route.domain].push(route);
	return groups;
}, {});
