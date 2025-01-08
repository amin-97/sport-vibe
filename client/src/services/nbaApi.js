// services/nbaApi.js
import api from '@/utils/axios'

export const nbaApi = {
  async getPlayers(params = {}) {
    try {
      const response = await api.get('/api/stats/players', {
        params: {
          limit: 1000,
          ...params,
        },
      })

      return {
        data: response.data,
        error: null,
      }
    } catch (error) {
      console.error('API Error:', error)
      return {
        data: null,
        error: error.response?.data?.message || 'Failed to fetch players',
      }
    }
  },

  async getPlayerStats(playerId) {
    try {
      const response = await api.get(`/api/stats/players/${playerId}`)
      return {
        data: response.data,
        error: null,
      }
    } catch (error) {
      console.error('API Error:', error)
      return {
        data: null,
        error: error.response?.data?.message || 'Failed to fetch player stats',
      }
    }
  },

  async getPlayerGameLog(playerId, params = {}) {
    try {
      const response = await api.get(`/api/stats/players/${playerId}/games`, {
        params,
      })
      return {
        data: response.data,
        error: null,
      }
    } catch (error) {
      console.error('API Error:', error)
      return {
        data: null,
        error: error.response?.data?.message || 'Failed to fetch game log',
      }
    }
  },
}
