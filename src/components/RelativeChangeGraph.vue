<script lang="ts" setup>
import { Bar } from '@phoobynet/alpaca-services'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { numberDiff } from '@/lib/numberDiff'
import { parseISO } from 'date-fns'
import { useElementSize } from '@vueuse/core'
import Konva from 'konva'
import * as d3 from 'd3'

const props = defineProps<{ bars: Bar[]; price: number }>()
const container = ref<HTMLDivElement>()
const high = ref<number>()
const low = ref<number>()

const { width, height } = useElementSize(container)

const centerLineY = computed(() => height.value / 2)

const changeWidth = computed(() => width.value / props.bars.length)

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

    console.log(numberDiffResult)

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
  <div ref="container" class="w-full h-[10rem]"></div>
</template>

<style lang="scss" scoped></style>
