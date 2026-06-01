import express from 'express';

const router = express.Router();

// GET /api/v1/map/search?destination=...
router.get('/search', (req, res) => {
  const keyword = String(req.query.destination || 'Seoul').trim();

  res.json({
    success: true,
    message: '장소 검색 성공',
    data: [
      { id: 'place-1', name: `${keyword} Station`, address: 'Seoul, Korea' },
      { id: 'place-2', name: `${keyword} Food Street`, address: 'Seoul Jung-gu' },
    ],
  });
});

// GET /api/v1/map/routes?startLat=...&startLng=...&endLat=...&endLng=...
router.get('/routes', (req, res) => {
  res.json({
    success: true,
    message: '경로 조회 성공',
    data: [
      { type: 'WALK', duration: '12min', summary: 'Walk straight and turn right near the station.' },
      { type: 'BUS', duration: '18min', summary: 'Take bus 501 and get off after 3 stops.' },
    ],
  });
});

export default router;
