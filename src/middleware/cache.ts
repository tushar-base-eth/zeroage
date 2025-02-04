import { NextRequest, NextResponse } from 'next/server';

// Cache configuration
const CACHE_REVALIDATION_TIME = 60; // seconds
const CACHED_PATHS = [
  '/api/exercises',
  '/api/workouts'
];

type Handler = (request: NextRequest) => Promise<NextResponse>;

export function withCache(handler: Handler): Handler {
  return async (request: NextRequest) => {
    const pathname = new URL(request.url).pathname;
    
    // Only cache GET requests for specific paths
    if (request.method !== 'GET' || !CACHED_PATHS.includes(pathname)) {
      return handler(request);
    }

    // Generate cache key based on URL and auth token
    const token = request.headers.get('authorization') || '';
    const cacheKey = `${pathname}-${token}`;

    // Try to get cached response
    const cache = await caches.open('zeroage-api-cache');
    const cachedResponse = await cache.match(cacheKey);

    if (cachedResponse) {
      const cachedData = await cachedResponse.json();
      const age = Date.now() - cachedData.timestamp;

      // Return cached data if it's still fresh
      if (age < CACHE_REVALIDATION_TIME * 1000) {
        return NextResponse.json(cachedData.data);
      }
    }

    // Get fresh data
    const response = await handler(request);
    const data = await response.clone().json();

    // Cache the new response
    const cacheData = {
      data,
      timestamp: Date.now()
    };

    await cache.put(
      cacheKey,
      new Response(JSON.stringify(cacheData), {
        headers: { 'Content-Type': 'application/json' }
      })
    );

    return response;
  };
}
