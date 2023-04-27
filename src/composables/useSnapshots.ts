import { getMultiSnapshot, Snapshot } from '@phoobynet/alpaca-services'
import { reactive, readonly, ref } from 'vue'
import { debouncedWatch } from '@vueuse/core'

export const useSnapshots = () => {
  const snapshots = ref<Record<string, Snapshot>>({})
  const trackedSymbols = reactive<string[]>([])

  let interval: ReturnType<typeof setInterval>

  const updateSnapshots = async () => {
    if (!trackedSymbols.length) {
      return
    }

    snapshots.value = await getMultiSnapshot({
      symbols: trackedSymbols,
    })
  }

  const addSymbol = (symbol: string): void => {
    trackedSymbols.push(symbol)
  }

  const removeSymbol = (symbol: string): void => {
    trackedSymbols.splice(trackedSymbols.indexOf(symbol), 1)
  }

  debouncedWatch(
    trackedSymbols,
    async () => {
      await updateSnapshots()
    },
    { debounce: 500 },
  )

  const start = () => {
    interval = setInterval(async () => {
      await updateSnapshots()
    }, 1_000)

    return () => {
      clearInterval(interval)
    }
  }

  return {
    snapshots,
    start,
    addSymbol,
    removeSymbol,
    trackedSymbols,
  }
}
