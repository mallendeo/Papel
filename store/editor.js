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
  'solarized',
  'solarized dark',
  'mdn-like'
]

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

  code: {
    html: demo.pug,
    css: demo.styl,
    js: demo.babel
  },

  compiled: {
    html: '',
    css: '',
    js: ''
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
  themeNames (state) {
    return state.opts.themes
      .map(theme =>
        words(theme).map(capitalize).join(' ')
      )
  }
}

export const mutations = {
  [types.EDITOR_SET_COMPILED] (state, { lang, output }) {
    state.compiled[lang] = output
    state.editors[lang].error = null
  },
  [types.EDITOR_SET_ERROR] (state, { lang, error }) {
    state.editors[lang].error = error
  },
  [types.EDITOR_SET_CODE] (state, { lang, code }) {
    state.code[lang] = code
  }
}

export const actions = {
  setOutput ({ commit }, { lang, output }) {
    commit(types.EDITOR_SET_COMPILED, { lang, output })
  },
  setError({ commit }, { lang, error }) {
    commit(types.EDITOR_SET_ERROR, { lang, error })
  },
  updateCode ({ commit }, { lang, code }) {
    commit(types.EDITOR_SET_CODE, { lang, code })
  }
}
