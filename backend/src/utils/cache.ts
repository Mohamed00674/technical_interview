import redis from '../config/redis';
export type CacheExpiresIn =
    | 'ONE_MINUTES'
    | 'FIVE_MINUTES'
    | 'TEN_MINUTES'
    | 'THIRTY_MINUTES'
    | 'ONE_HOUR';

const CacheExpiresInMap = {
    ONE_MINUTES: 60,
    FIVE_MINUTES: 60 * 5,
    TEN_MINUTES: 60 * 10,
    THIRTY_MINUTES: 60 * 30,
    ONE_HOUR: 60 * 60,
};

const cacheGet = async <T>(key: string): Promise<T | null> => {
    const data = await redis.get(key);
    return data ? (JSON.parse(data) as T) : null;
};

const cacheSet = async (
    key: string,
    value: any,
    expiresIn: CacheExpiresIn = 'ONE_MINUTES',
) => {
    const ttlSeconds = CacheExpiresInMap[expiresIn];

    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
};

const cacheClear = async (key: string) => {
    await redis.del(key);
};

export const CacheService = {
    get: cacheGet,
    set: cacheSet,
    clear: cacheClear,
};
