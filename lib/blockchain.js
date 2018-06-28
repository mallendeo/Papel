import { callFunction } from './nebpay'

export const saveSheet = (slug, data) =>
  callFunction('saveSheet', [slug, data])

export const getSheet = slug =>
  callFunction('getSheet', [slug], { simulate: true })
