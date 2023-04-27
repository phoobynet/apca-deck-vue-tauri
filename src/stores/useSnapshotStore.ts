import { defineStore } from 'pinia'
import { getMultiSnapshot, Snapshot, Trade } from '@phoobynet/alpaca-services'

export interface SnapshotsState {
  snapshots: Record<string, Snapshot>
}

export const useSnapshotStore = defineStore('snapshots', {
  state: (): SnapshotsState => ({
    snapshots: {},
  }),

  actions: {
    async updateSnapshots(symbols: string[] = []): Promise<void> {
      console.log('symbols', symbols)
      await getMultiSnapshot({ symbols }).then(snapshots => {
        console.log('snapshots', snapshots)
        this.snapshots = snapshots
      })
    },
  },
  getters: {
    symbols(state): string[] {
      return Object.keys(state.snapshots)
    },

    latestTrades(state): Trade[] {
      const result = Object.keys(state.snapshots).map(symbol => {
        return state.snapshots[symbol].latestTrade
      })

      console.log(result)

      return result
    },
  },
})
