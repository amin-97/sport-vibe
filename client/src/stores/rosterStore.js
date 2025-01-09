// src/stores/rosterStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/axios'

export const useRosterStore = defineStore('roster', () => {
  const teamRoster = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchTeamRoster = async (teamId, season = '2024') => {
    try {
      loading.value = true
      error.value = null

      const response = await api.get('/api/common-team-roster', {
        params: {
          teamId,
          season,
        },
      })

      teamRoster.value = response.data.rosterEntries || []
    } catch (err) {
      console.error('Error fetching team roster:', err)
      error.value = 'Failed to load team roster'
      teamRoster.value = []
    } finally {
      loading.value = false
    }
  }

  const searchRoster = async (query, season = '2024') => {
    try {
      loading.value = true
      error.value = null

      const response = await api.get('/api/common-team-roster/search', {
        params: {
          query,
          season,
        },
      })

      return response.data
    } catch (err) {
      console.error('Error searching roster:', err)
      error.value = 'Failed to search roster'
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    teamRoster,
    loading,
    error,
    fetchTeamRoster,
    searchRoster,
  }
})
