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
      error: null,
      head: '',
      lang: 'pug',
      showCompiled: false,
      prepros: {
        html: { icon: 'html', mime: 'text/html', title: 'HTML', enabled: true },
        pug: { icon: 'pug', mime: 'text/x-pug', title: 'Pug', enabled: true },
        md: { icon: 'markdown', mime: 'text/x-markdown', title: 'Markdown' }
      }
    },
    css: {
      error: null,
      autoprefix: false,
      libs: [],
      lang: 'stylus',
      showCompiled: false,
      prepros: {
        css: { icon: 'css', mime: 'text/css', title: 'CSS', enabled: true },
        stylus: { icon: 'stylus', mime: 'text/x-styl', title: 'Stylus', enabled: true },
        sass: { icon: 'sass', mime: 'text/x-sass', title: 'SASS' },
        scss: { icon: 'sass', mime: 'text/x-scss', title: 'SCSS' }
      }
    },
    js: {
      error: null,
      libs: [],
      lang: 'babel',
      showCompiled: false,
      prepros: {
        js: { icon: 'javascript', mime: 'text/javascript', title: 'JS', enabled: true },
        babel: { icon: 'babel', mime: 'text/jsx', title: 'Babel', enabled: true },
        ts: { icon: 'typescript', mime: 'text/typescript', title: 'TypeScript' },
        coffee: { icon: 'coffeescript', mime: 'text/coffeescript', title: 'CoffeeScript' }
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
  [types.EDITOR_TOGGLE_COMPILED] (state, type) {
    const { showCompiled } = state.editors[type]
    state.editors[type].showCompiled = !showCompiled
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
  },
  toggleCompiled ({ commit }, type) {
    commit(types.EDITOR_TOGGLE_COMPILED, type)
  }
}
