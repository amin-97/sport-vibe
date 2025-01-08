import { ref } from 'vue'

export function useCache(expirationTime = 5 * 60 * 1000) {
  // 5 minutes default
  const cache = new Map()

  const set = (key, value) => {
    cache.set(key, {
      value,
      timestamp: Date.now(),
    })
  }

  const get = (key) => {
    const item = cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > expirationTime) {
      cache.delete(key)
      return null
    }

    return item.value
  }

  const cleanup = () => {
    const now = Date.now()
    for (const [key, value] of cache.entries()) {
      if (now - value.timestamp > expirationTime) {
        cache.delete(key)
      }
    }
  }

  return {
    set,
    get,
    cleanup,
  }
}
