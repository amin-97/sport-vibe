<template>
  <BaseEditorialForm
    ref="baseEditorialForm"
    type="nba"
    title="Create NBA Editorial"
    api-endpoint="/api/nba-editorials"
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
            v-for="(team, index) in baseEditorialForm?.editorialData.teams"
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
            v-for="(player, index) in baseEditorialForm?.editorialData.players"
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
  </BaseEditorialForm>
</template>

<script setup>
import { ref } from 'vue'
import BaseEditorialForm from '@/components/editorial/BaseEditorialForm.vue'

const baseEditorialForm = ref(null)
const teamInput = ref('')
const playerInput = ref('')

const addTeam = () => {
  if (teamInput.value.trim() && baseEditorialForm.value) {
    if (!baseEditorialForm.value.editorialData.teams) {
      baseEditorialForm.value.editorialData.teams = []
    }
    baseEditorialForm.value.editorialData.teams.push(teamInput.value.trim())
    teamInput.value = ''
  }
}

const removeTeam = (index) => {
  if (baseEditorialForm.value) {
    baseEditorialForm.value.editorialData.teams.splice(index, 1)
  }
}

const addPlayer = () => {
  if (playerInput.value.trim() && baseEditorialForm.value) {
    if (!baseEditorialForm.value.editorialData.players) {
      baseEditorialForm.value.editorialData.players = []
    }
    baseEditorialForm.value.editorialData.players.push(playerInput.value.trim())
    playerInput.value = ''
  }
}

const removePlayer = (index) => {
  if (baseEditorialForm.value) {
    baseEditorialForm.value.editorialData.players.splice(index, 1)
  }
}
</script>
