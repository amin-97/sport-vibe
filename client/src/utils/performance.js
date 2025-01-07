// utils/performance.js
import { defineAsyncComponent } from 'vue'
export const debounce = (fn, wait) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), wait)
  }
}

export const lazyLoadComponent = (importFn) => {
  return defineAsyncComponent({
    loader: importFn,
    loadingComponent: null,
    delay: 200,
    timeout: 5000,
  })
}

export const memoize = (fn) => {
  const cache = new Map()
  return (...args) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}
