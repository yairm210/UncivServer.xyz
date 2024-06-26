import { format } from 'bytes';
import { LRUCache } from 'lru-cache';
import { FILES_CACHE_MAX_ITEMS, FILES_CACHE_MAX_SIZE } from '@constants';

const lruCache = new LRUCache<string, string>({
  max: FILES_CACHE_MAX_ITEMS,
  maxSize: FILES_CACHE_MAX_SIZE,
  // according to stackoverflow, any character is stored as utf-16
  // utf-16 is 2 bytes per character
  sizeCalculation: (val, key) => 2 * (key.length + val.length),
});

setInterval(
  () => {
    console.info('[Cache] Stats:', {
      size: lruCache.size,
      maxSize: format(lruCache.maxSize),
      calculatedSize: format(lruCache.calculatedSize),
    });
  },
  1000 * 60 * 5
);

class LRUCacheService implements CacheService {
  ready(): Promise<void> {
    return Promise.resolve();
  }

  get(key: string): Promise<string | undefined> {
    return Promise.resolve(lruCache.get(key));
  }

  set(key: string, value: string): Promise<void> {
    lruCache.set(key, value);
    return Promise.resolve();
  }

  del(key: string): Promise<boolean> {
    return Promise.resolve(lruCache.delete(key));
  }
}

export default new LRUCacheService();
