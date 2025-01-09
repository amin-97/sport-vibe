// client/src/services/rosterService.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

class RosterService {
  constructor() {
    this.http = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // Get roster for a specific team
  async getTeamRoster(teamId) {
    try {
      const response = await this.http.get(`/teams/${teamId}/roster`)
      return response.data
    } catch (error) {
      console.error('Error fetching team roster:', error)
      throw error
    }
  }

  // Get player details
  async getPlayerDetails(playerId) {
    try {
      const response = await this.http.get(`/players/${playerId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching player details:', error)
      throw error
    }
  }

  // Get active roster count
  async getActiveRosterCount(teamId) {
    try {
      const response = await this.http.get(`/teams/${teamId}/roster/count`)
      return response.data.count
    } catch (error) {
      console.error('Error fetching roster count:', error)
      throw error
    }
  }

  // Get team salary information
  async getTeamSalaryInfo(teamId) {
    try {
      const response = await this.http.get(`/teams/${teamId}/salary`)
      return response.data
    } catch (error) {
      console.error('Error fetching team salary info:', error)
      throw error
    }
  }

  // Get team's draft picks
  async getTeamDraftPicks(teamId) {
    try {
      const response = await this.http.get(`/teams/${teamId}/draft-picks`)
      return response.data
    } catch (error) {
      console.error('Error fetching team draft picks:', error)
      throw error
    }
  }

  // Get team's trade exceptions
  async getTeamTradeExceptions(teamId) {
    try {
      const response = await this.http.get(`/teams/${teamId}/trade-exceptions`)
      return response.data
    } catch (error) {
      console.error('Error fetching trade exceptions:', error)
      throw error
    }
  }

  // Update roster after trade
  async updateRosterAfterTrade(tradeData) {
    try {
      const response = await this.http.post('/trades/execute', tradeData)
      return response.data
    } catch (error) {
      console.error('Error executing trade:', error)
      throw error
    }
  }

  // Get player salary history
  async getPlayerSalaryHistory(playerId) {
    try {
      const response = await this.http.get(`/players/${playerId}/salary-history`)
      return response.data
    } catch (error) {
      console.error('Error fetching player salary history:', error)
      throw error
    }
  }

  // Get team's contract options
  async getTeamContractOptions(teamId) {
    try {
      const response = await this.http.get(`/teams/${teamId}/contract-options`)
      return response.data
    } catch (error) {
      console.error('Error fetching contract options:', error)
      throw error
    }
  }
}

export const rosterService = new RosterService()
