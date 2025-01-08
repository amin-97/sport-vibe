import api from '@/utils/axios'

export const wrestlingApi = {
  async getResults(params) {
    const { data } = await api.get('/api/wrestling-results', { params })
    return data
  },
}
