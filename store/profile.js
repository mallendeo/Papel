import * as types from './mutation-types'
import * as blockchain from '../lib/blockchain'

export const state = () => ({
  userProfile: {},
  sheets: [],
  totalSheets: 0
})

export const mutations = {
  [types.SET_USER_PROFILE] (state, profile) {
    state.userProfile = profile
  },

  [types.SET_SHEET_LIST] (state, { results, total }) {
    state.sheets = results
    state.totalSheets = total
  }
}

export const actions = {
  async getProfile ({ dispatch, commit }, username) {
    try {
      const profile = await blockchain.getProfile(username)
      commit(types.SET_USER_PROFILE, profile)
      return profile
    } catch (err) {
    }
  },

  async getUserSheets ({ commit }, { username, page = 1 }) {
    const sheets = await blockchain.getUserSheets(username, page)
    commit(types.SET_SHEET_LIST, sheets)
  },

  async saveProfile ({}, user) {
    const saved = await blockchain.saveUser(user)
    return saved
  }
}
