<script lang='ts' setup>
import { Bar } from '@phoobynet/alpaca-services'
import { computed, onMounted, ref, watch } from 'vue'
import { numberDiff } from '@/lib/numberDiff'
import { parseISO } from 'date-fns'
import { useElementSize } from '@vueuse/core'
import Konva from 'konva'

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

const drawCenterLine = () => {
  return new Konva.Line({
    points: [0, centerLineY.value, width.value, centerLineY.value],
    stroke: 'rgba(255,255,255,0.06)',
    strokeWidth: 1,
  })
}

const drawChangeLine = (change: Change, i: number) => {
  // set the thickness of the line

  // Start
  // calculate the x
  const x1 = i * changeWidth.value
  // start y is the starting position around the center line
  const y1 = centerLineY.value

  // End
  const x2 = 0
  const y2 = centerLineY.value - 20


  /**                           */
  /** ------------|------------ */

  let stroke = 'white'
  if (change.pct > 0) {
    const y2 = change.pct / (height.value / 2)
    stroke = 'green'
  } else if (change.pct < 0) {
    stroke = 'red'
  }

  return new Konva.Line({
    points: [x1, y1, x2, y2],
    stroke: stroke,
    strokeWidth: changeWidth.value,
  })
}

const render = () => {
  layer.destroyChildren()

  // draw a center line representing the current price
  layer.add(drawCenterLine())
  layer.add(drawChangeLine(changes.value[0], 0))

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
  <div ref='container' id='container' class='w-full h-[10rem]'></div>
</template>

<style lang='scss' scoped></style>
