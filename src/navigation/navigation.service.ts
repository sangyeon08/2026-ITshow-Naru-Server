import { Injectable } from '@nestjs/common';

const DUMMY_PLACES = [
  { id: '1', name: '명동 칼국수', category: 'KOREAN', address: '서울 중구 명동', latitude: 37.5636, longitude: 126.9856, distance: 0.3 },
  { id: '2', name: '이태원 버거', category: 'WESTERN', address: '서울 용산구 이태원', latitude: 37.5345, longitude: 126.9942, distance: 1.2 },
  { id: '3', name: '홍대 라멘', category: 'JAPANESE', address: '서울 마포구 홍대', latitude: 37.5563, longitude: 126.9241, distance: 2.5 },
  { id: '4', name: '인사동 전', category: 'KOREAN', address: '서울 종로구 인사동', latitude: 37.5745, longitude: 126.9853, distance: 1.8 },
  { id: '5', name: '차이나타운 딤섬', category: 'CHINESE', address: '서울 영등포구', latitude: 37.5172, longitude: 126.9003, distance: 4.2 },
];

const DUMMY_ROUTES = [
  {
    id: 'route1',
    label: '빠른 경로',
    duration: '25분',
    transfers: 1,
    steps: [
      { type: 'walk', description: '도보 5분 → 홍대입구역', duration: '5분' },
      { type: 'subway', description: '2호선 → 명동역 (3정거장)', duration: '12분' },
      { type: 'walk', description: '도보 8분 → 목적지', duration: '8분' },
    ],
  },
  {
    id: 'route2',
    label: '환승 적은 경로',
    duration: '35분',
    transfers: 0,
    steps: [
      { type: 'walk', description: '도보 3분 → 버스 정류장', duration: '3분' },
      { type: 'bus', description: '버스 100번 → 목적지 앞 (10정거장)', duration: '25분' },
      { type: 'walk', description: '도보 7분 → 목적지', duration: '7분' },
    ],
  },
];

@Injectable()
export class NavigationService {
  searchPlaces(keyword: string) {
    if (!keyword) return DUMMY_PLACES;
    return DUMMY_PLACES.filter(p =>
      p.name.includes(keyword) || p.address.includes(keyword) || p.category.toLowerCase().includes(keyword.toLowerCase()),
    );
  }

  getNearbyRecommendations(lat?: number, lng?: number) {
    return [...DUMMY_PLACES].sort((a, b) => a.distance - b.distance);
  }

  getRoutes(destinationId: string, fromLat?: number, fromLng?: number) {
    return {
      from: { description: '현재 위치', latitude: fromLat ?? 37.5563, longitude: fromLng ?? 126.9241 },
      to: DUMMY_PLACES.find(p => p.id === destinationId) ?? { name: '목적지', latitude: 37.5636, longitude: 126.9856 },
      routes: DUMMY_ROUTES,
    };
  }
}
