// usePagination.js
import { ref, computed, watch } from 'vue'

export function usePagination(items, itemsPerPage) {
  const currentPage = ref(1)

  const totalPages = computed(() => Math.ceil(items.value.length / itemsPerPage))

  const paginatedPlayers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return items.value.slice(start, end)
  })

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  // Reset to first page when items change
  watch(items, () => {
    currentPage.value = 1
  })

  return {
    currentPage,
    totalPages,
    paginatedPlayers,
    handlePageChange,
  }
}
