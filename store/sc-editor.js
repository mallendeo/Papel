import { getField, updateField } from 'vuex-map-fields'
import { PREPROS } from './constants'
import * as demo from '../assets/demo'

// import * as types from './mutation-types'

const tabs = [{
  name: 'sc-editor',
  title: 'Editor',
  icon: 'code'
}, {
  name: 'sc-storage',
  title: 'Storage',
  iconComponent: 'database-icon'
}, {
  name: 'sc-console',
  title: 'Console',
  iconComponent: 'terminal-icon'
}]

export const state = () => ({
  ui: {
    tabs,
    currTab: tabs[0],
    slideNext: false
  },
  code: {
    src: demo.contract,
    compiled: ''
  },
  prepros: PREPROS.js,
  opts: {
    lang: 'js'
  }
})

export const getters = {
  getField
}

export const mutations = {
  updateField
}

export const actions = {
}
