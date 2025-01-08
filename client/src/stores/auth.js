// src/stores/auth.js
import { defineStore } from 'pinia'
import { auth, googleProvider } from '@/config/firebase'
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth'
import axios from 'axios'
import api from '@/utils/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: true,
    error: null,
    signOutLoading: false,
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
        const { data } = await api.post('/api/auth/google', {
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
        this.signOutLoading = true
        await auth.signOut()

        // Wait for 2 seconds
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Clear auth state
        this.user = null
        this.token = null
        delete axios.defaults.headers.common['Authorization']
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        return true // Return success status
      } catch (error) {
        console.error('Sign out error:', error)
        return false // Return failure status
      } finally {
        this.signOutLoading = false
      }
    },

    initializeAuth() {
      return new Promise((resolve) => {
        // Listen for Firebase auth state changes
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              // Get token and user data from localStorage first
              const token = localStorage.getItem('token')
              const userData = localStorage.getItem('user')

              if (token && userData) {
                this.token = token
                this.user = JSON.parse(userData)
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
              } else {
                // If no local data, re-authenticate with backend
                const { data } = await api.post('/api/auth/google', {
                  googleId: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                })

                this.user = data.user
                this.token = data.token
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
              }
            } catch (error) {
              console.error('Auth initialization error:', error)
              this.error = error.message
            }
          }
          this.loading = false
          resolve()
        })
      })
    },
  },
})
