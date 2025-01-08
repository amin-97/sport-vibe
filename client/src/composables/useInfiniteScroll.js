import { ref, onMounted, onUnmounted } from 'vue'

export function useInfiniteScroll(callback, options = {}) {
  const bottomRef = ref(null)

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      callback()
    }
  }, options)

  onMounted(() => {
    if (bottomRef.value) {
      observer.observe(bottomRef.value)
    }
  })

  onUnmounted(() => {
    observer.disconnect()
  })

  return { bottomRef }
}
