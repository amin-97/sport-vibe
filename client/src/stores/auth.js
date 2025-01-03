// src/stores/auth.js
import axios from 'axios'

// Configure axios
axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json'

// // src/stores/auth.js
import { defineStore } from 'pinia'
import { auth, googleProvider } from '@/config/firebase'
import { signInWithPopup, signOut } from 'firebase/auth'
// import axios from 'axios'

// // Add this at the top of the file
// axios.defaults.baseURL = 'http://localhost:5000' // or your backend URL

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.isAdmin || false,
  },

  actions: {
    async signInWithGoogle() {
      this.loading = true
      this.error = null
      try {
        const result = await signInWithPopup(auth, googleProvider)

        // Send user data to your backend to create/update user
        const { data } = await axios.post('/api/auth/google', {
          googleId: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        })

        this.user = data.user
      } catch (error) {
        this.error = error.message
        console.error('Sign in error:', error)
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      try {
        await signOut(auth)
        this.user = null
      } catch (error) {
        console.error('Sign out error:', error)
      }
    },

    setUser(user) {
      this.user = user
    },
  },
})
