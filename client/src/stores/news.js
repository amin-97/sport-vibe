// src/stores/news.js
import { defineStore } from 'pinia'
import api from '@/utils/axios'

export const useNewsStore = defineStore('news', {
  state: () => ({
    featuredItems: [],
  }),

  actions: {
    async fetchFeaturedItems() {
      try {
        const [nbaNews, wrestlingNews] = await Promise.all([
          api.get('/api/nba-news'),
          api.get('/api/wrestling-news'),
        ])

        this.featuredItems = [...nbaNews.data.slice(0, 2), ...wrestlingNews.data.slice(0, 2)].map(
          (item) => ({
            id: item._id,
            title: item.title,
            excerpt: item.description,
            image: item.image?.url || '/placeholder-image.png',
            link: `/${item.category}/news/${item.slug}`,
          }),
        )
      } catch (error) {
        console.error('Error fetching featured items:', error)
        this.featuredItems = []
      }
    },
  },
})
