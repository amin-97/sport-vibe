// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { useAuthStore } from './stores/auth'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:5000'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// Initialize auth state
const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app')
