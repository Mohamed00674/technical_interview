import Redis from 'ioredis';

import { EnvConfig } from './env';

const redis = new Redis({
    host: EnvConfig.redisHost,
    port: EnvConfig.redisPort,
});

redis.on('connect', () => console.log(' Redis connected.'));
redis.on('error', (err) => console.error(' Redis error:', err));

export default redis;
