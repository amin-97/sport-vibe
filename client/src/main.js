import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import axios from 'axios'
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.PROD ? '' : import.meta.env.VITE_API_URL
axios.defaults.withCredentials = true

// Initialize app
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(ToastPlugin)

app.mount('#app')
