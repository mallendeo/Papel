import * as types from './mutation-types'
import { getField, updateField } from 'vuex-map-fields'

const TRANSITION_DURATION = 0.3

export const state = () => ({
  themeTransition: false,
  zenMode: false
})

export const getters = {
  getField
}

export const mutations = {
  updateField,

  [types.SET_THEME_TRANSITION] (state, transition) {
    state.themeTransition = typeof transition !== 'undefined'
      ? Boolean(transition)
      : !state.transition
  }
}

export const actions = {
  setThemeTransition ({ commit }) {
    commit(types.SET_THEME_TRANSITION, true)

    setTimeout(() => {
      commit(types.SET_THEME_TRANSITION, false)
    }, TRANSITION_DURATION * 1000)
  }
}
