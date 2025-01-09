// src/composables/useTradeExceptions.js
import { ref, computed } from 'vue'

export function useTradeExceptions() {
  const tradeExceptions = ref(new Map()) // Map<teamId, Exception[]>

  // Example exception structure:
  // {
  //   id: string,
  //   teamId: number,
  //   amount: number,
  //   expirationDate: Date,
  //   originalPlayer: string,
  //   dateCreated: Date
  // }

  // Get active trade exceptions for a team
  const getActiveExceptions = (teamId) => {
    const exceptions = tradeExceptions.value.get(teamId) || []
    const now = new Date()
    return exceptions.filter((exception) => new Date(exception.expirationDate) > now)
  }

  // Calculate available exception amount
  const getAvailableExceptionAmount = (teamId) => {
    const activeExceptions = getActiveExceptions(teamId)
    return activeExceptions.reduce((total, exception) => total + exception.amount, 0)
  }

  // Create new trade exception
  const createTradeException = (teamId, outgoingSalary, incomingSalary, playerName) => {
    if (outgoingSalary <= incomingSalary) return null

    const exception = {
      id: `te-${teamId}-${Date.now()}`,
      teamId,
      amount: outgoingSalary - incomingSalary,
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      originalPlayer: playerName,
      dateCreated: new Date(),
    }

    const teamExceptions = tradeExceptions.value.get(teamId) || []
    tradeExceptions.value.set(teamId, [...teamExceptions, exception])

    return exception
  }

  // Use trade exception
  const useTradeException = (teamId, amount) => {
    const activeExceptions = getActiveExceptions(teamId)
    let remainingAmount = amount
    const usedExceptions = []

    for (const exception of activeExceptions) {
      if (remainingAmount <= 0) break

      const amountToUse = Math.min(exception.amount, remainingAmount)
      remainingAmount -= amountToUse

      if (amountToUse === exception.amount) {
        // Remove the fully used exception
        const teamExceptions = tradeExceptions.value.get(teamId) || []
        tradeExceptions.value.set(
          teamId,
          teamExceptions.filter((e) => e.id !== exception.id),
        )
      } else {
        // Reduce the exception amount
        exception.amount -= amountToUse
      }

      usedExceptions.push({
        exceptionId: exception.id,
        amountUsed: amountToUse,
      })
    }

    return {
      success: remainingAmount <= 0,
      usedExceptions,
      remainingAmount: Math.max(0, remainingAmount),
    }
  }

  // Check if a salary can be absorbed by trade exceptions
  const canAbsorbSalary = (teamId, salary) => {
    const availableAmount = getAvailableExceptionAmount(teamId)
    return salary <= availableAmount
  }

  // Get all trade exceptions for a team
  const getTeamExceptions = computed(() => (teamId) => {
    return tradeExceptions.value.get(teamId) || []
  })

  return {
    getActiveExceptions,
    getAvailableExceptionAmount,
    createTradeException,
    useTradeException,
    canAbsorbSalary,
    getTeamExceptions,
  }
}
