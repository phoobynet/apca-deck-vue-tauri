import { type Asset, getAssets } from '@phoobynet/alpaca-services'
import Fuse from 'fuse.js'

let fuse: Fuse<Asset>

export const assetSearch = async (query: string = ''): Promise<Asset[]> => {
  if (!fuse) {
    console.log('loading assets')
    const assets = await getAssets()

    fuse = new Fuse<Asset>(assets, {
      keys: ['symbol', 'name'],
    })
  }

  if (!query) {
    return []
  }

  return fuse
    .search(query, {
      limit: 20,
    })
    .flatMap(({ item }) => item)
}
