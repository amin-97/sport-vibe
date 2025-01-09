// src/stores/teamStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/axios'

export const useTeamStore = defineStore('team', () => {
  const teams = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchTeams = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await api.get('/api/teams')
      teams.value = response.data.teams
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    teams,
    loading,
    error,
    fetchTeams,
  }
})
