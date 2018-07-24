import { getField, updateField } from 'vuex-map-fields'

import * as types from './mutation-types'
import * as blockchain from '../lib/blockchain'
import { getAddress } from '../lib/nebulas'

export const state = () => ({
  sheets: [],
  sheetsType: 'public',
  totalSheets: 0,
  nextPage: false,
  page: 1,
  loggedUser: null
})

export const getters = {
  getField
}

export const mutations = {
  updateField,

  [types.HOME_SET_SHEETS] (state, response) {
    state.sheets = response.sheets
    state.totalSheets = response.totalSheets
    state.nextPage = response.next
  },

  [types.SET_LOGGED_USER] (state, user) {
    const data = { name: '', bio: '', avatar: '' }
    state.loggedUser = { ...data, ...user }
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
  },

  async getLoggedUser({ commit }) {
    const address = await getAddress()
    const user = await blockchain.getUserByAddress(address)
    commit(types.SET_LOGGED_USER, user)
    return user
  }
}
