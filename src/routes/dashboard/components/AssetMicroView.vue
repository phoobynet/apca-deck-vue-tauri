<script lang="ts" setup>
import { Snapshot } from '@phoobynet/alpaca-services'
import { useSnapshotView } from '@/composables/useSnapshotView'
import { onMounted, watch } from 'vue'
import { useBars } from '@/composables/useBars'
import RelativeChangeGraph from '@/components/RelativeChangeGraph.vue'
import { subBusinessDays, subMonths } from 'date-fns'

const props = defineProps<{ snapshot: Snapshot }>()

const {
  applySnapshot,
  price,
  cleanAssetName,
  assetSymbol,
  rawPrice,
  pctChange,
  priceChange,
  up,
  down,
} = useSnapshotView()

const { fetch: fetchBars, bars } = useBars()

watch(() => props.snapshot, applySnapshot)

onMounted(async () => {
  const start = subMonths(new Date(), 6)
  const end = subBusinessDays(new Date(), 1)
  await fetchBars(props.snapshot.symbol, start, end, '1Day')
})
</script>

<template>
  <div v-if="snapshot" class="asset-micro-view" :data-up="up" :data-down="down">
    <div class="company-info-layout">
      <div class="company-info">
        <div class="asset-symbol">
          {{ assetSymbol }}
        </div>
        <div class="asset-name">{{ cleanAssetName }}</div>
      </div>
      <div class="pricing-info-layout">
        <div class="asset-price">
          {{ price }}
        </div>
        <div class="asset-price-change-layout">
          <div class="asset-price-change">{{ priceChange }}</div>
          <div class="asset-pct-change">({{ pctChange }})</div>
        </div>
      </div>
    </div>
    <div class="graph">
      <RelativeChangeGraph :price="rawPrice" :bars="bars" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$down-color: #f06d6d;
$up-color: #6df06d;
$leading-font-size: 1.5rem;

@mixin tabular-nums {
  font-variant-numeric: tabular-nums;
}

.asset-micro-view {
  min-width: 25rem;
  border: 1px solid white;
  border-radius: 0.3rem;
  padding: 0.1rem 0.5rem;

  .company-info-layout {
    display: flex;
    justify-content: space-between;

    .company-info {
      .asset-symbol {
        grid-area: symbol;
        font-size: $leading-font-size;
        font-weight: bold;
        letter-spacing: 0.2rem;
        color: orange;
      }

      .asset-name {
        grid-area: name;
      }
    }

    .pricing-info-layout {
      display: flex;
      flex-direction: column;

      .asset-price {
        @include tabular-nums;
        grid-area: price;
        align-self: end;
        font-size: $leading-font-size;
      }

      .asset-price-change-layout {
        display: flex;
        justify-content: end;
        gap: 1rem;

        > * {
          font-size: 1rem;
          @include tabular-nums;
        }

        .asset-price-change {
          grid-area: price-change;
        }

        .asset-pct-change {
          grid-area: pct-change;
        }
      }
    }
  }

  .graph {
  }

  .asset-price-change,
  .asset-pct-change {
    font-size: 0.9rem;
    font-weight: bold;
    font-variant-numeric: tabular-nums;
    align-self: end;
    justify-self: center;
  }

  &[data-up='true'] {
    border-color: $up-color;

    .asset-pct-change,
    .asset-price-change {
      color: $up-color;
    }
  }

  &[data-down='true'] {
    border-color: $down-color;

    .asset-pct-change,
    .asset-price-change {
      color: $down-color;
    }
  }
}
</style>
