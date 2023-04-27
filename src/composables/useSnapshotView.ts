import { Asset, Bar, getAsset, Snapshot } from '@phoobynet/alpaca-services'
import { format } from 'date-fns'
import { computed, ref } from 'vue'
import { numberDiff, NumberDiffResult } from '@/lib/numberDiff'
import numeral from 'numeral'

const money = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const pct = (value: number) => numeral(value).format('0.00%')

export const useSnapshotView = () => {
  const snapshot = ref<Snapshot>()
  const asset = ref<Asset>()

  const applySnapshot = async (newSnapshot: Snapshot) => {
    snapshot.value = newSnapshot
    asset.value = await getAsset(newSnapshot.symbol)
  }

  const rawPrice = computed<number>(() => snapshot.value?.latestTrade.p ?? 0)

  const price = computed<string>(() =>
    money.format(snapshot.value?.latestTrade.p ?? 0),
  )

  const assetName = computed<string>(() => asset?.value?.name || '')
  const cleanAssetName = computed<string>(() =>
    assetName.value.replace('Common Stock', ''),
  )
  const assetSymbol = computed<string>(() => asset?.value?.symbol || '')
  const prevDailyBar = computed<Bar | undefined>(() => {
    if (!snapshot.value) {
      return undefined
    }

    const today = format(new Date(), 'yyyy-MM-dd')

    if ((snapshot.value?.dailyBar?.t ?? '').substring(0, 10) === today) {
      return snapshot.value?.prevDailyBar
    }

    return snapshot.value?.dailyBar
  })

  const change = computed<NumberDiffResult | undefined>(() => {
    if (prevDailyBar.value) {
      return numberDiff(
        snapshot.value?.latestTrade.p ?? 0,
        prevDailyBar.value?.c ?? 0,
      )
    }

    return undefined
  })

  const priceChange = computed<string>(() =>
    money.format(change.value?.change ?? 0),
  )

  const pctChange = computed<string>(() =>
    pct(Math.abs(change.value?.changePercent ?? 0)),
  )

  const up = computed<boolean>(() => (change.value?.sign ?? 0) > 0)
  const down = computed<boolean>(() => (change.value?.sign ?? 0) < 0)

  return {
    applySnapshot,
    rawPrice,
    price,
    assetName,
    cleanAssetName,
    assetSymbol,
    change,
    priceChange,
    pctChange,
    up,
    down,
  }
}
