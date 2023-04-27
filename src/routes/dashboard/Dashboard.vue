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
    <div
      class="grid lg:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 md:grid-cols-2 mt-4 gap-2"
    >
      <AssetMicroView
        v-for="symbol in Object.keys(snapshots)"
        :key="symbol"
        :snapshot="snapshots[symbol]"
      />
    </div>
  </div>
</template>
