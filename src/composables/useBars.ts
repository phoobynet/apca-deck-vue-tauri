import { Bar, BarTimeframe, getBarsBetween } from '@phoobynet/alpaca-services'
import { ref } from 'vue'

export const useBars = () => {
  const bars = ref<Bar[]>([])

  const fetch = async (
    symbol: string,
    start: Date,
    end: Date,
    timeframe: string,
  ): Promise<void> => {
    let tempBars: Bar[] = []
    for await (const bar of await getBarsBetween({
      symbol,
      start,
      end,
      timeframe: BarTimeframe.parse(timeframe),
    })) {
      tempBars.push(bar)
    }

    bars.value = tempBars
  }
  return {
    bars,
    fetch,
  }
}
