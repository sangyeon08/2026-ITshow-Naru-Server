export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10) || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'naru_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'naru-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  exchangeApi: {
    url: process.env.EXCHANGE_API_URL || 'https://api.exchangerate-api.com/v4/latest',
    key: process.env.EXCHANGE_API_KEY || '',
  },
});
