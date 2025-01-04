// src/stores/auth.js
import { defineStore } from 'pinia'
import { auth, googleProvider } from '@/config/firebase'
import { signInWithPopup } from 'firebase/auth'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.isAdmin || false,
  },

  actions: {
    async signInWithGoogle() {
      try {
        const result = await signInWithPopup(auth, googleProvider)

        // Send user data to backend
        const { data } = await axios.post('/api/auth/google', {
          googleId: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        })

        // Save user and token
        this.user = data.user
        this.token = data.token

        // Set token for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      } catch (error) {
        console.error('Sign in error:', error)
        this.error = error.message
      }
    },

    async signOut() {
      try {
        await auth.signOut()
        this.user = null
        this.token = null
        delete axios.defaults.headers.common['Authorization']
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } catch (error) {
        console.error('Sign out error:', error)
      }
    },

    // Initialize auth state from localStorage
    initializeAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
    },
  },
})
