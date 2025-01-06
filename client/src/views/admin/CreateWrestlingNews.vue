<!-- src/views/admin/CreateWrestlingNews.vue -->
<template>
  <BaseNewsForm
    title="Create Wrestling News Article"
    type="wrestling"
    :categories="wrestlingCategories"
    api-endpoint="/api/wrestling-news"
  />
</template>

<script setup>
import BaseNewsForm from '@/components/news/BaseNewsForm.vue'

const wrestlingCategories = [
  { value: 'wwe', label: 'WWE' },
  { value: 'aew', label: 'AEW' },
]
</script>
