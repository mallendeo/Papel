import words from 'lodash/words'
import capitalize from 'lodash/capitalize'

import * as types from './mutation-types'
import * as demo from '../assets/demo'

const themes = [
  'default',
  'material',
  'monokai',
  'oceanic-next',
  'dracula',
  'panda-syntax',
  'solarized light',
  'solarized dark',
  'mdn-like'
]

const tabs = [{
  index: 0,
  component: 'app-editors',
  title: 'Editor',
  icon: 'code'
}, {
  index: 1,
  component: 'smart-contract-editor',
  title: 'Smart contract editor',
  iconComponent: 'nebulas-logo'
}, {
  index: 2,
  component: 'app-info',
  title: 'Details',
  icon: 'info'
}, {
  index: 3,
  component: 'editor-settings',
  title: 'Editor settings',
  icon: 'settings'
}]

export const state = () => ({
  opts: {
    tabSize: 2,
    styleActiveLine: true,
    lineNumbers: true,
    line: true,
    lineWrapping: true,
    themes,
    theme: themes[1],
    extraKeys: {
      Tab (cm) {
        const spaces = Array(cm.getOption('indentUnit') + 1).join(' ')
        cm.replaceSelection(spaces)
      }
    }
  },

  ui: {
    tabs,
    currTab: tabs[0],
    slideRight: false
  },

  code: {
    html: demo.pug,
    css: demo.styl,
    js: demo.babel,
    contract: demo.contract
  },

  compiled: {
    html: '',
    css: '',
    js: '',
    contract: ''
  },

  editors: {
    html: {
      code: demo.pug,
      error: null,
      head: '',
      lang: 'pug',
      prepros: {
        html: { mime: 'text/html', title: 'HTML' },
        pug: { mime: 'text/x-pug', title: 'HTML (Pug)' }
      }
    },
    css: {
      code: demo.styl,
      error: null,
      autoprefix: false,
      libs: [],
      lang: 'stylus',
      prepros: {
        css: { mime: 'text/css', title: 'CSS' },
        stylus: { mime: 'text/x-styl', title: 'CSS (Stylus)' }
      }
    },
    js: {
      code: demo.babel,
      error: null,
      libs: [],
      lang: 'babel',
      prepros: {
        js: { mime: 'text/javascript', title: 'JS' },
        babel: { mime: 'text/jsx', title: 'JS (Babel)' }
      }
    }
  }
})

export const getters = {
  allThemes (state) {
    return state.opts.themes
      .map(theme => ({
        slug: theme,
        name: words(theme).map(capitalize).join(' ')
      }))
  },
  currTheme: state => state.opts.theme,
  types: state => Object.keys(state.editors)
}

export const mutations = {
  [types.EDITOR_SET_COMPILED] (state, { type, output }) {
    state.compiled[type] = output
    state.editors[type].error = null
  },
  [types.EDITOR_SET_ERROR] (state, { type, error }) {
    state.editors[type].error = error
  },
  [types.EDITOR_SET_CODE] (state, { type, code }) {
    state.code[type] = code
  },
  [types.EDITOR_SET_THEME] (state, theme) {
    state.opts.theme = theme
  },
  [types.EDITOR_NAV_TO] (state, tab) {
    state.ui.slideRight = tab.index > state.ui.currTab.index
    state.ui.currTab = tab
  }
}

export const actions = {
  setOutput ({ commit }, { type, output }) {
    commit(types.EDITOR_SET_COMPILED, { type, output })
  },
  setError({ commit }, { type, error }) {
    commit(types.EDITOR_SET_ERROR, { type, error })
  },
  updateCode ({ commit }, { type, code }) {
    commit(types.EDITOR_SET_CODE, { type, code })
  },
  setTheme ({ commit }, theme) {
    commit(types.EDITOR_SET_THEME, theme)
  },
  navTo ({ commit }, tab) {
    commit(types.EDITOR_NAV_TO, tab)
  }
}
