import words from 'lodash/words'
import capitalize from 'lodash/capitalize'
import merge from 'lodash/merge'
import { getField, updateField } from 'vuex-map-fields'

import * as types from './mutation-types'
import { PREPROS, THEMES, FONTS } from './constants'

const tabs = [{
  component: 'editor-save',
  title: 'Save',
  iconComponent: 'upload-icon',
  classes: 'icon--small'
}, {
  component: 'app-editors',
  title: 'Editor',
  icon: 'code'
}, {
  component: 'smart-contract-editor',
  title: 'Smart contract editor',
  iconComponent: 'nebulas-logo'
}, {
  component: 'app-comments',
  title: 'Comments',
  icon: 'comment'
}, {
  space: true,
  component: 'file-explorer',
  title: 'My Files',
  icon: 'folder'
}, {
  component: 'editor-settings',
  title: 'Editor settings',
  icon: 'settings'
}]

export const state = () => ({
  opts: {
    tabSize: 2,
    lineNumbers: true,
    line: true,
    indentWithTabs: false,
    lineWrapping: true,
    themes: THEMES,
    theme: THEMES[1],
    markTagPairs: true,
    autoRenameTags: true,
    jsxBracket: true,
    autoCloseTags: true,
    autoCloseBrackets: true,

    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    extraKeys: {
      'Ctrl-Space': 'autocomplete',
      Tab: cm => {
        const { line, ch } = cm.getCursor()
        const word = cm.findWordAt({ line, ch })
        const char = cm.getRange(word.anchor, word.head)

        if (char.trim()) {
          const result = cm.execCommand('emmetExpandAbbreviation')
          if (typeof result === 'boolean' && result) return
        }

        if (cm.somethingSelected()) {
          cm.indentSelection('add')
          return;
        }

        if (cm.options.indentWithTabs) {
          cm.replaceSelection('\t', 'end', '+input')
          return
        }

        cm.execCommand('insertSoftTab')
      },
      'Shift-Tab': cm => cm.indentSelection('subtract'),
      'Ctrl-E': 'emmetExpandAbbreviationAll',
      'Enter': 'emmetInsertLineBreak',
      'Ctrl-W': 'emmetWrapWithAbbreviation',
      'Ctrl-Q': cm => cm.foldCode(cm.getCursor())
    }
  },

  ui: {
    tabs,
    currTab: tabs[1],
    slideNext: false,
    layout: 'col',
    layouts: ['col', 'row'],
    fonts: FONTS,
    font: FONTS[0],
    fontSize: 14,
    refreshDelay: 'instant'
  },

  code: {
    html: '',
    css: '',
    js: ''
  },

  compiled: {
    html: '',
    css: '',
    js: ''
  },

  editors: {
    html: {
      error: null,
      head: '',
      lang: 'html',
      showCompiled: false,
      prepros: PREPROS.html
    },
    css: {
      error: null,
      autoprefix: false,
      libs: [],
      lang: 'css',
      showCompiled: false,
      prepros: PREPROS.css
    },
    js: {
      error: null,
      libs: [],
      lang: 'js',
      showCompiled: false,
      prepros: PREPROS.js
    }
  }
})

export const getters = {
  getField,

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
  updateField,

  [types.EDITOR_PUT_OPTIONS] (state, opts) {
    state.editors = merge(state.editors, opts)
  },

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
    const { tabs } = state.ui
    const index = tabs.indexOf(state.ui.currTab)

    if (typeof tab === 'number' && tabs[tab]) {
      state.ui.slideNext = tab > index
      state.ui.currTab = tabs[tab]
      return
    }

    state.ui.slideNext = tabs.indexOf(tab) > index
    state.ui.currTab = tab
  },

  [types.EDITOR_TOGGLE_COMPILED] (state, type) {
    const { showCompiled } = state.editors[type]
    state.editors[type].showCompiled = !showCompiled
  },

  [types.EDITOR_SET_LANG] (state, { type, lang }) {
    state.editors[type].lang = lang
  },

  [types.EDITOR_SET_LAYOUT] (state, layout) {
    if (state.ui.layouts.indexOf(layout) < 0) return
    state.ui.layout = layout
  },

  [types.EDITOR_SET_LIBS] (state, { type, libs }) {
    state.editors[type].libs = libs
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
  },
  setLayout ({ commit }, layout) {
    commit(types.EDITOR_SET_LAYOUT, layout)
  },
  putOptions ({ commit }, opts) {
    commit(types.EDITOR_PUT_OPTIONS, opts)
  },
  setLibs ({ commit }, { type, libs }) {
    commit(types.EDITOR_SET_LIBS, { type, libs })
  }
}
