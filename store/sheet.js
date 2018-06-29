import pick from 'lodash/pick'

import * as types from './mutation-types'
import * as ipfs from '../lib/ipfs'
import * as blockchain from '../lib/blockchain'
import * as db from '../lib/db'
import { generateHTML} from '../lib/helpers'

export const state = () => ({
  title: 'A Papel Project',
  description: '',
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
    const { editors, cmOpts } = editor

    return {
      cmOpts: pick(cmOpts, 'tabSize', 'indentWithTabs'),
      ui: pick(editor.ui, 'refreshType', 'updateDelay'),
      editors: pick(editors,
        'html.headContent', 'html.htmlClasses', 'html.lang', 'html.contentLength',
        'css.autoprefix', 'css.libs', 'css.iframeBg', 'css.lang', 'css.contentLength',
        'js.libs', 'js.lang', 'js.isModule', 'js.contentLength'
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

export const actions = {
  updateFromSave ({ dispatch }, { code, compiled, opts = {} }) {
    if (!code) return false
    console.log({opts})
    dispatch('editor/putOptions', opts, { root: true })

    Object.keys(code).forEach(type => {
      const srcCode = { type, code: code[type] }
      dispatch('editor/updateCode', srcCode, { root: true })

      const compiledCode = { type, output: compiled[type] }
      dispatch('editor/setOutput', { ...compiledCode, loaded: true }, { root: true })
    })

    return true
  },

  saveLocal ({ rootState, getters }, slug) {
    const { code, compiled } = rootState.editor
    db.set(`sheet:${slug}`, {
      code,
      compiled,
      ...getters.sheetConfig
    })
  },

  loadFromLocal ({ dispatch }, slug) {
    const saved = db.get(`sheet:${slug}`)
    if (!saved) return false

    const { code, compiled, ...opts } = saved
    return saved && dispatch('updateFromSave', { code, compiled, opts })
  },

  async loadFromNebulas ({ dispatch }, slug) {
    const { rootHash } = await blockchain.getSheet(slug)
    const opts = await ipfs.getContent(`${rootHash}/config.json`, { parse: true })
    const allCode = await ipfs.getContent(`${rootHash}/code.json`, {
      parse: true
    })

    dispatch('updateFromSave', {
      code: allCode.code,
      compiled: allCode.compiled,
      opts
    })
  },

  async saveOnNebulas ({ state, getters, dispatch }, slug) {
    dispatch('saveLocal', slug)

    const { latestHash } = getters
    const data = {
      isPublic: state.isPublic,

      rootHash: latestHash.root,
      distHash: latestHash.dist
    }

    return await blockchain.saveSheet(slug, data)
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
    const { code, compiled } = editor
    const fileTypes = ['html', 'css', 'js'].filter(type => code[type])

    const staticHTML = await dispatch('generateHTML')

    const files = fileTypes.map(type => {
      const filename = type === 'html' ? 'index' : 'main'
      return {
        path: `/dist/${filename}.${type}`,
        content: new Buffer(type === 'html' ? staticHTML : compiled[type])
      }
    })

    const config = JSON.stringify(getters.sheetConfig)
    const allCode = JSON.stringify({ code, compiled })

    const ipfsOpts = { wrapWithDirectory: true, pin: true }
    commit(types.SHEET_SET_SAVING, true)

    const hashes = await ipfs.saveFiles([
      files,
      { path: '/config.json', content: new Buffer(config) },
      { path: '/code.json', content: new Buffer(allCode) }
    ], ipfsOpts)

    commit(types.SHEET_SET_HASHES, hashes)
    commit(types.SHEET_SET_SAVING, false)
  }
}


