import Dexie from 'dexie'
import type { Asset, AssetRepository } from '@phoobynet/alpaca-services'
import { getAssets } from '@phoobynet/alpaca-services'

class AlpacaServicesAssetsDatabase extends Dexie {
  public assets!: Dexie.Table<Asset>

  constructor () {
    super('AlpacaServicesAssetsDatabase')

    this.version(1).stores({
      assets: 'id,class,status,symbol,exchange,name,tradable,shortable,marginable,easy_to_borrow',
    })
  }
}

const database = new AlpacaServicesAssetsDatabase()

let assetsReady = false

const isEmpty = async (): Promise<void> => {
  if (!assetsReady) {
    const c = await database.assets.count()
    if (c === 0) {
      // set forceHTTP to true to ensure data is retrieved from the API (not from cache (which will be empty (which is loop badness)))
      const assets = await getAssets(true)
      await database.assets.bulkPut(assets)
    }
    assetsReady = true
  }
}

export const assetRepository: AssetRepository = {
  async find (symbol: string): Promise<Asset | undefined> {
    await isEmpty()
    return database.assets.where('symbol').equalsIgnoreCase(symbol).first()
  },
  async findAll (): Promise<Asset[]> {
    await isEmpty()
    return database.assets.toArray()
  },
}