// components/nba/PlayerTable.vue
<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  players: {
    type: Array,
    required: true,
  },
  sortBy: String,
  sortDirection: String,
  getSortIcon: Function,
})

const emit = defineEmits(['sort'])
const router = useRouter()

const navigateToPlayerStats = (player) => {
  const playerUrlName = player.DISPLAY_FIRST_LAST.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')

  router.push({
    name: 'PlayerStats',
    params: { playerName: playerUrlName },
  })
}
</script>

<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full table-auto">
        <thead class="bg-gray-50">
          <tr>
            <th
              @click="$emit('sort', 'name')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Name {{ getSortIcon('name') }}
            </th>
            <th
              @click="$emit('sort', 'team')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Team {{ getSortIcon('team') }}
            </th>
            <th
              @click="$emit('sort', 'age')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Age {{ getSortIcon('age') }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="player in players"
            :key="player.PLAYER_ID"
            @click="navigateToPlayerStats(player)"
            class="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-blue-600 hover:text-blue-800">
                {{ player.DISPLAY_FIRST_LAST }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ player.TEAM_ABBREVIATION }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ player.PLAYER_AGE }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
