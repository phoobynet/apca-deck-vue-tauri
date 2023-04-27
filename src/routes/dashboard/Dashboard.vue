<script lang="ts" setup>
import AssetAutoComplete from '@/components/AssetAutoComplete.vue'
import { onBeforeUnmount, onMounted } from 'vue'
import { useSnapshots } from '@/composables/useSnapshots'
import AssetMicroView from '@/routes/dashboard/components/AssetMicroView.vue'

const { snapshots, start, addSymbol, trackedSymbols } = useSnapshots()

const onAssetSelected = async (symbol: string | null) => {
  if (!symbol) return

  addSymbol(symbol)
}

let cancel: () => void

onMounted(() => {
  cancel = start()
})

onBeforeUnmount(() => {
  if (cancel) cancel()
})
</script>

<template>
  <div class="mx-3 mt-3">
    <div>
      <AssetAutoComplete @select="onAssetSelected" />
    </div>
    <div class="grid grid-cols-4 mt-4 gap-2">
      <AssetMicroView
        v-for="symbol in trackedSymbols"
        :key="symbol"
        :snapshot="snapshots[symbol]"
      />
    </div>
  </div>
</template>
