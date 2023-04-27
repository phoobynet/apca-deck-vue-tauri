<script lang="ts" setup>
import { Bar } from '@phoobynet/alpaca-services'
import { computed, ref } from 'vue'
import { numberDiff } from '@/lib/numberDiff'
import { parseISO } from 'date-fns'

const props = defineProps<{ bars: Bar[]; price: number }>()
const graphRef = ref<HTMLDivElement>()
const high = ref<number>()
const low = ref<number>()

type Change = {
  pct: number
  amount: number
  date: Date
}

const changes = computed<Change[]>(() => {
  let newHigh = 0
  let newLow = 0
  const result = props.bars.map(bar => {
    const numberDiffResult = numberDiff(bar.c, props.price)

    const x: Change = {
      pct: numberDiffResult.changePercent,
      amount: numberDiffResult.change,
      date: parseISO(bar.t),
    }

    if (x.pct > newHigh) {
      newHigh = x.pct
    }

    if (x.pct < newLow) {
      newLow = x.pct
    }

    return x
  })

  high.value = newHigh
  low.value = newLow

  return result
})
</script>

<template>
  <div ref="graphRef"></div>
</template>

<style lang="scss" scoped></style>
