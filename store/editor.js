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
      showProcessed: false,
      prepros: {
        html: { mime: 'text/html', title: 'HTML' },
        pug: { mime: 'text/x-pug', title: 'Pug' }
      }
    },
    css: {
      code: demo.styl,
      error: null,
      autoprefix: false,
      libs: [],
      lang: 'stylus',
      showProcessed: false,
      prepros: {
        css: { mime: 'text/css', title: 'CSS' },
        stylus: { mime: 'text/x-styl', title: 'Stylus' }
      }
    },
    js: {
      code: demo.babel,
      error: null,
      libs: [],
      lang: 'babel',
      showProcessed: false,
      prepros: {
        js: { mime: 'text/javascript', title: 'JS' },
        babel: { mime: 'text/jsx', title: 'Babel' }
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
  types: state => Object.keys(state.editors),
  preprosList: state => type => Object.keys(state.editors[type].prepros),
  prepros: state => type => state.editors[type].prepros[state.editors[type].lang]
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
  },
  [types.EDITOR_TOGGLE_PROCESSED] (state, type) {
    const { showProcessed } = state.editors[type]
    state.editors[type].showProcessed = !showProcessed
  },
  [types.EDITOR_SET_LANG] (state, { type, lang }) {
    state.editors[type].lang = lang
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
  setLang ({ commit }, lang) {
    commit(types.EDITOR_SET_LANG, lang)
  },
  navTo ({ commit }, tab) {
    commit(types.EDITOR_NAV_TO, tab)
  }
}
