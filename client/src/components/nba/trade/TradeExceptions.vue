<!-- src/components/nba/trade/TradeExceptions.vue -->
<script setup>
import { computed } from 'vue'
import { useTradeExceptions } from '@/composables/useTradeExceptions'

const props = defineProps({
  team: {
    type: Object,
    required: true,
  },
  incomingSalary: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['use-exception'])

const { getActiveExceptions, getAvailableExceptionAmount, canAbsorbSalary } = useTradeExceptions()

// Get active exceptions for the team
const activeExceptions = computed(() => {
  return getActiveExceptions(props.team.id)
})

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

// Check if exception can be used
const canUseException = computed(() => {
  return canAbsorbSalary(props.team.id, props.incomingSalary)
})

// Handle using an exception
const handleUseException = () => {
  if (!canUseException.value) return
  emit('use-exception', props.team.id, props.incomingSalary)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="font-semibold text-gray-700">Trade Exceptions</h3>
      <span class="text-sm text-gray-500">
        Total Available: {{ formatCurrency(getAvailableExceptionAmount(team.id)) }}
      </span>
    </div>

    <!-- Active Exceptions List -->
    <div class="space-y-2">
      <div
        v-for="exception in activeExceptions"
        :key="exception.id"
        class="border rounded-lg p-3 space-y-2"
      >
        <div class="flex justify-between items-start">
          <div>
            <div class="font-medium">{{ formatCurrency(exception.amount) }}</div>
            <div class="text-sm text-gray-500">From {{ exception.originalPlayer }}</div>
          </div>
          <div class="text-sm text-gray-500">
            Expires: {{ formatDate(exception.expirationDate) }}
          </div>
        </div>
      </div>

      <div v-if="!activeExceptions.length" class="text-sm text-gray-500 text-center py-2">
        No active trade exceptions
      </div>
    </div>

    <!-- Use Exception Button -->
    <button
      v-if="incomingSalary > 0"
      @click="handleUseException"
      :disabled="!canUseException"
      class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ canUseException ? 'Use Trade Exception' : 'Insufficient Exception Amount' }}
    </button>
  </div>
</template>
