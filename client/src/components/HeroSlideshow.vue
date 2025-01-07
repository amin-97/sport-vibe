<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const activeTab = ref('news')
const currentNewsIndex = ref(0)
const currentResultIndex = ref(0)
const newsItems = ref([])
const loading = ref(false)
const error = ref(null)

// Fetch latest NBA news
const fetchLatestNBANews = async () => {
  try {
    loading.value = true
    const { data } = await axios.get('http://localhost:5000/api/nba-news')

    // Sort by most recent and take top 4
    const sortedNews = data
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4)
      .map((article) => ({
        id: article._id,
        title: article.title,
        excerpt: article.description,
        image: article.image?.url || '/placeholder-image.png',
        link: `/nba/news/${article.slug}`,
      }))

    newsItems.value = sortedNews
  } catch (err) {
    console.error('Error fetching NBA news:', err)
    error.value = 'Failed to load news'
    // Fallback to default news items if fetch fails
    newsItems.value = [
      {
        id: 1,
        title: 'Lakers Make Blockbuster Trade',
        excerpt: 'The Los Angeles Lakers have made a major move before the trade deadline...',
        image: '/api/placeholder/400/200',
        link: '/nba/news/1',
      },
      {
        id: 2,
        title: 'NBA All-Star Starters Revealed',
        excerpt: "The NBA has announced the starting lineups for this year's All-Star game...",
        image: '/api/placeholder/400/200',
        link: '/nba/news/2',
      },
    ]
  } finally {
    loading.value = false
  }
}

const results = ref([
  {
    id: 1,
    event: 'NBA Regular Season',
    date: 'January 28, 2024',
    venue: 'Crypto.com Arena',
    mainEvent: 'Lakers vs Warriors',
    winner: 'Lakers win 123-111',
    link: '/nba/results/1',
  },
  {
    id: 2,
    event: 'NBA Regular Season',
    date: 'February 1, 2024',
    venue: 'Madison Square Garden',
    mainEvent: 'Knicks vs Heat',
    winner: 'Knicks win 115-109',
    link: '/nba/results/2',
  },
])

// Auto-advance slides
let slideInterval

const startSlideshow = () => {
  slideInterval = setInterval(() => {
    if (activeTab.value === 'news') {
      currentNewsIndex.value = (currentNewsIndex.value + 1) % newsItems.value.length
    } else {
      currentResultIndex.value = (currentResultIndex.value + 1) % results.value.length
    }
  }, 5000) // Change slide every 5 seconds
}

onMounted(() => {
  fetchLatestNBANews()
  startSlideshow()
})

onUnmounted(() => {
  clearInterval(slideInterval)
})
</script>
