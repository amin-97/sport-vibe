export function useStorage() {
  const getItem = (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (err) {
      console.error('Storage error:', err)
      return null
    }
  }

  const setItem = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error('Storage error:', err)
    }
  }

  return {
    getItem,
    setItem,
  }
}
