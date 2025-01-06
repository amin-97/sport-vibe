<template>
  <BaseNewsForm
    ref="baseNewsForm"
    title="Create NBA News"
    type="nba"
    :categories="[
      { value: 'news', label: 'News' },
      { value: 'trades', label: 'Trades' },
      { value: 'rumors', label: 'Rumors' },
      { value: 'injuries', label: 'Injuries' },
      { value: 'game-recap', label: 'Game Recap' },
      { value: 'analysis', label: 'Analysis' },
    ]"
    api-endpoint="/api/nba-news"
  >
    <template #additional-fields>
      <!-- Teams -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Teams</label>
        <div class="flex flex-wrap gap-2">
          <input
            v-model="teamInput"
            @keydown.enter.prevent="addTeam"
            type="text"
            class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="Press enter to add team"
          />
          <div
            v-for="(team, index) in baseNewsForm?.newsData.teams"
            :key="index"
            class="bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1"
          >
            <span>{{ team }}</span>
            <button
              @click="removeTeam(index)"
              type="button"
              class="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- Players -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Players</label>
        <div class="flex flex-wrap gap-2">
          <input
            v-model="playerInput"
            @keydown.enter.prevent="addPlayer"
            type="text"
            class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="Press enter to add player"
          />
          <div
            v-for="(player, index) in baseNewsForm?.newsData.players"
            :key="index"
            class="bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1"
          >
            <span>{{ player }}</span>
            <button
              @click="removePlayer(index)"
              type="button"
              class="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </template>
  </BaseNewsForm>
</template>

<script setup>
import { ref } from 'vue'
import BaseNewsForm from '@/components/news/BaseNewsForm.vue'

const baseNewsForm = ref(null)
const teamInput = ref('')
const playerInput = ref('')

const addTeam = () => {
  if (teamInput.value.trim() && baseNewsForm.value) {
    if (!baseNewsForm.value.newsData.teams) {
      baseNewsForm.value.newsData.teams = []
    }
    baseNewsForm.value.newsData.teams.push(teamInput.value.trim())
    teamInput.value = ''
  }
}

const removeTeam = (index) => {
  if (baseNewsForm.value) {
    baseNewsForm.value.newsData.teams.splice(index, 1)
  }
}

const addPlayer = () => {
  if (playerInput.value.trim() && baseNewsForm.value) {
    if (!baseNewsForm.value.newsData.players) {
      baseNewsForm.value.newsData.players = []
    }
    baseNewsForm.value.newsData.players.push(playerInput.value.trim())
    playerInput.value = ''
  }
}

const removePlayer = (index) => {
  if (baseNewsForm.value) {
    baseNewsForm.value.newsData.players.splice(index, 1)
  }
}
</script>
