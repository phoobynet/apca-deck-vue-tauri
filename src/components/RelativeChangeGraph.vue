<script lang="ts" setup>
import { Bar } from '@phoobynet/alpaca-services'
import { computed, onMounted, ref, watch } from 'vue'
import { numberDiff } from '@/lib/numberDiff'
import { parseISO } from 'date-fns'
import { useElementSize } from '@vueuse/core'
import Konva from 'konva'

const props = defineProps<{ bars: Bar[]; price: number }>()
const container = ref<HTMLDivElement>()
const canvas = ref<HTMLCanvasElement>()
const high = ref<number>()
const low = ref<number>()

const { width, height } = useElementSize(container)

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

let stage: Konva.Stage
let layer: Konva.Layer

watch([width, height], newValues => {
  const [w, h] = newValues

  stage.width(w)
  stage.height(h)

  render()
})

const render = () => {
  layer.destroyChildren()

  const rect = new Konva.Rect({
    x: 0,
    y: 0,
    width: 10,
    height: 20,
    fill: '#fff',
  })

  layer.add(rect)

  stage.draw()
}

onMounted(() => {
  stage = new Konva.Stage({
    container: container.value as HTMLDivElement,
    width: width.value,
    height: height.value,
  })

  layer = new Konva.Layer()
  stage.add(layer)

  render()
})
</script>

<template>
  <div ref="container" id="container" class="w-full h-[10rem]"></div>
</template>

<style lang="scss" scoped></style>
