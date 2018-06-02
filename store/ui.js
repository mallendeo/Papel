import * as types from './mutation-types'

const TRANSITION_DURATION = 0.4

export const state = () => ({
  themeTransition: false
})

export const mutations = {
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
