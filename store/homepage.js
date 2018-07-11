import * as types from './mutation-types'
import * as blockchain from '../lib/blockchain'

export const state = () => ({
  sheets: [],
  sheetsType: 'public',
  totalSheets: 0,
  nextPage: false,
  page: 1
})

export const mutations = {
  [types.HOME_SET_SHEETS] (state, response) {
    state.sheets = response
    state.sheets = response.sheets
    state.totalSheets = response.totalSheets
    state.nextPage = response.next
  }
}

export const actions = {
  async getSheets ({ state, commit }, {
    type = state.sheetsType,
    page = state.page
  } = {}) {
    const response = await blockchain.listSheets(type, page)
    commit(types.HOME_SET_SHEETS, response)
    return response
  }
}
