import { Redis } from '@upstash/redis';

/**
 * ==============================================================================
 * VEXORA SALON — UPSTASH REDIS QUEUE LOCK & CACHING ENGINE
 * ==============================================================================
 * 
 * Configured via environment variables:
 * - VITE_UPSTASH_REDIS_REST_URL
 * - VITE_UPSTASH_REDIS_REST_TOKEN
 */

const REDIS_URL = import.meta.env.VITE_UPSTASH_REDIS_REST_URL || 'https://demo-redis.upstash.io';
const REDIS_TOKEN = import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN || 'demo-token';

export const isRedisConfigured = () => {
  return (
    import.meta.env.VITE_UPSTASH_REDIS_REST_URL &&
    import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN &&
    !import.meta.env.VITE_UPSTASH_REDIS_REST_URL.includes('demo-redis')
  );
};

export const redis = new Redis({
  url: REDIS_URL,
  token: REDIS_TOKEN,
});

/**
 * Cache active live queue in Redis for fast (<2ms) queue lookups
 */
export async function cacheLiveQueueInRedis(waitingQueueList) {
  if (!isRedisConfigured()) {
    return;
  }

  try {
    const key = 'vexora:live_queue';
    await redis.set(key, JSON.stringify(waitingQueueList), { ex: 3600 }); // 1 hr TTL
  } catch (err) {
    console.error('[Vexora Redis] Error caching live queue:', err);
  }
}

/**
 * Atomic queue position lock to prevent race conditions during simultaneous walk-in check-ins
 */
export async function acquireQueueLock(bookingId) {
  if (!isRedisConfigured()) {
    return true; // fallback to client-side lock
  }

  try {
    const lockKey = `vexora:lock:${bookingId}`;
    const acquired = await redis.set(lockKey, 'locked', { nx: true, ex: 10 }); // 10s mutex lock
    return !!acquired;
  } catch (err) {
    console.error('[Vexora Redis] Lock acquisition error:', err);
    return true;
  }
}

/**
 * Release atomic queue lock
 */
export async function releaseQueueLock(bookingId) {
  if (!isRedisConfigured()) return;

  try {
    const lockKey = `vexora:lock:${bookingId}`;
    await redis.del(lockKey);
  } catch (err) {
    console.error('[Vexora Redis] Lock release error:', err);
  }
}
