import omit from 'lodash/omit'
import pick from 'lodash/pick'
import flatMap from 'lodash/flatMap'

import * as types from './mutation-types'
import * as ipfs from '../lib/ipfs'
import * as blockchain from '../lib/blockchain'
import * as db from '../lib/db'
import { generateHTML} from '../lib/helpers'

export const state = () => ({
  currTxHash: null,
  isSaving: false,
  hashes: []
})

export const getters = {
  latestHash (state) {
    const root = state.hashes.find(h => !h.path)
    const dist = state.hashes.find(h => h.path === 'dist')

    return {
      root: root && root.hash,
      dist: dist && dist.hash
    }
  },

  sheetConfig (state, getters, rootState) {
    const { editor } = rootState
    const { editors, code, compiled, cmOpts } = editor

    return {
      cmOpts: pick(cmOpts, 'tabSize', 'indentWithTabs'),
      ui: pick(editor.ui, 'refreshType', 'updateDelay'),
      editors: pick(editors,
        'html.headContent', 'html.htmlClasses', 'html.lang',
        'css.autoprefix', 'css.libs', 'css.iframeBg', 'css.lang',
        'js.libs', 'js.lang', 'js.isModule'
      )
    }
  }
}

export const mutations = {
  [types.SHEET_SET_TXHASH] (state, hash) {
    state.currTxHash = hash
  },

  [types.SHEET_SET_SAVING] (state, saving) {
    state.isSaving = saving
  },

  [types.SHEET_SET_HASHES] (state, hashes) {
    state.hashes = hashes
  }
}

const pickConfig = editors => Object.keys(editors)
  .reduce((obj, type) => {
    obj[type] = omit(editors[type], 'showCompiled', 'error', 'prepros')
    return obj
  }, {})

export const actions = {
  async loadCode (slug) {
    // get hashes from nebulas
    //
  },

  saveLocal ({ rootState }, slug) {
    const { code, compiled, editors } = rootState.editor
    db.set(`sheet:${slug}`, {
      code, compiled, editors: pickConfig(editors)
    })
  },

  generateHTML ({ rootState }, conf) {
    const { editors, compiled } = rootState.editor

    const cssLibs = editors.css.libs.map(lib => lib.url)
    const jsLibs = editors.js.libs.map(lib => lib.url)

    return generateHTML({
      code: compiled,
      styles: cssLibs,
      scripts: jsLibs,
      htmlClasses: editors.html.htmlClasses,
      headContent: editors.html.headContent
    }, conf)
  },

  async saveIpfs ({ getters, rootState, state, commit, dispatch }) {
    if (state.isSaving) return

    const { editor } = rootState
    const { editors, code, compiled, cmOpts } = editor
    const fileTypes = ['html', 'css', 'js'].filter(type => code[type])

    const staticHTML = await dispatch('generateHTML')

    const files = fileTypes.map(type => {
      const filename = type === 'html' ? 'index' : 'main'

      const { lang, prepros } = editors[type]
      const { ext } = prepros[lang]

      return [
        { path: `/src/${filename}.${ext}`, content: new Buffer(code[type]) },
        {
          path: `/dist/${filename}.${type}`,
          content: new Buffer(type === 'html' ? staticHTML : compiled[type])
        }
      ]
    })

    const config = JSON.stringify(getters.sheetConfig)
    const ipfsOpts = { wrapWithDirectory: true, pin: true }
    commit(types.SHEET_SET_SAVING, true)

    const hashes = await ipfs.saveFiles([
      ...flatMap(files),
      { path: '/config.json', content: new Buffer(config) }
    ], ipfsOpts)

    commit(types.SHEET_SET_HASHES, hashes)
    commit(types.SHEET_SET_SAVING, false)
  },

  async saveOnNebulas ({ getters }, slug) {
    const { latestHash } = getters
    const data = {
      rootHash: latestHash.root,
      distHash: latestHash.dist
    }

    try {
      await blockchain.saveSheet(slug, data)
      console.log('saved')
    } catch (err) {
      console.error(err)
    }
  },

  loadFromLocal ({ dispatch }, slug) {
    const saved = db.get(`sheet:${slug}`)
    if (!saved) return

    const { compiled, code, editors } = saved
    if (!code) return

    Object.keys(code).forEach(type => {
      const srcCode = { type, code: code[type] }
      const compiledCode = { type, output: compiled[type] }
      dispatch('editor/updateCode', srcCode, { root: true })
      dispatch('editor/setOutput', { ...compiledCode, loaded: true }, { root: true })
      dispatch('editor/putOptions', editors, { root: true })
    })
  },

  async saveCode ({ rootState }, compiled) {
    const { editor } = rootState
    const { html, css, js } = compiled
      ? editor.compiled
      : editor.code

    console.log(html, css, js)
    // upload to ipfs

    // save on nebulas
    const args = [null, {
      title: 'Example dapp',
      description: 'Some example dapp',
      src: {
        html: {
          code: '<h1>test</h1>'
        },
        css: {
          type: 'stylus',
          code: 'h1 { color: red; }'
        }
      }
    }]

    try {
      const tx = nebpay.callFunction({ fn: 'saveSheet', args })
      console.info({ tx })
      const saved = await tx
      console.info({ saved })
    } catch (e) {
      console.error('ERROR', e)
    }

  }
}


