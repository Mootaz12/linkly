import { registerAs } from '@nestjs/config';

export const redisConnectionConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
}));
export type RedisConfig = ReturnType<typeof redisConnectionConfig>;
