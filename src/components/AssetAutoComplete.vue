<script lang="ts" setup>
import { ref } from 'vue'
import { AutoCompleteOption, NAutoComplete } from 'naive-ui'
import { watchDebounced } from '@vueuse/core'
import { assetSearch } from '@/lib/alpaca/assetSearch'

const value = ref('')
const loading = ref(false)
const options = ref<AutoCompleteOption[]>([])

const emit = defineEmits({
  select: (value: string | null) => true,
})

watchDebounced(
  value,
  async newQuery => {
    loading.value = true
    try {
      if (newQuery) {
        const matches = await assetSearch(newQuery)

        options.value = matches.map(match => ({
          label: `${match.symbol} - ${match.name}`,
          value: match.symbol,
        }))
      } else {
        options.value = []
      }
    } catch (e) {
      console.error('Oh shit!')
      console.error(e)
    } finally {
      loading.value = false
    }
  },
  {
    debounce: 500,
  },
)

const onSelect = (value: string | null) => {
  emit('select', value)
}
</script>

<template>
  <NAutoComplete
    v-model:value="value"
    placeholder="Search for an asset"
    :loading="loading"
    :options="options"
    clearable
    clear-after-select
    @select="onSelect"
    autocorrect="off"
  />
</template>

<style lang="scss" scoped></style>
