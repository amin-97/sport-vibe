import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import axios from 'axios'
import ToastPlugin from 'vue-toast-notification'
import App from './App.vue'
import { useAuthStore } from './stores/auth'
import './assets/main.css'
import 'vue-toast-notification/dist/theme-sugar.css'

const setupAxios = () => {
  axios.defaults.baseURL = import.meta.env.PROD ? '' : import.meta.env.VITE_API_URL
  axios.defaults.withCredentials = true

  const cache = new Map()

  axios.interceptors.request.use((config) => {
    const cacheKey = `${config.method}:${config.url}`
    const cachedResponse = cache.get(cacheKey)

    if (cachedResponse && Date.now() - cachedResponse.timestamp < 300000) {
      return Promise.resolve(cachedResponse.data)
    }
    return config
  })

  axios.interceptors.response.use((response) => {
    const cacheKey = `${response.config.method}:${response.config.url}`
    cache.set(cacheKey, {
      timestamp: Date.now(),
      data: response,
    })
    return response
  })
}

async function initializeApp() {
  setupAxios()
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)
  app.use(ToastPlugin)

  // Initialize auth before mounting
  const authStore = useAuthStore()
  await authStore.initializeAuth()

  app.mount('#app')
}

initializeApp()
