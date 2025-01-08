import { ref, reactive } from 'vue'

export function useImageLoader() {
  const imageLoaded = reactive({})

  const handleImageLoad = (id) => {
    imageLoaded[id] = true
  }

  return {
    imageLoaded,
    handleImageLoad,
  }
}
