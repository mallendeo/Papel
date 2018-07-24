import pick from 'lodash/pick'
import { sha256 } from 'js-sha256'
import { getField, updateField } from 'vuex-map-fields'

import * as types from './mutation-types'
import * as ipfs from '../lib/ipfs'
import * as blockchain from '../lib/blockchain'
import * as db from '../lib/db'
import { generateHTML } from '../lib/helpers'

export const state = () => ({
  title: '',
  description: '',
  currTxHash: null,
  isSaving: false,
  isPublic: true,

  // codeHash: sha-256 used for check code changes
  codeHash: '',

  // IPFS files hashes
  hashes: [],
  rootIpfsHash: null
})

export const getters = {
  getField,

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
  updateField,

  [types.SHEET_SET_TXHASH] (state, hash) {
    state.currTxHash = hash
  },

  [types.SHEET_SET_SAVING] (state, saving) {
    state.isSaving = saving
  },

  [types.SHEET_SET_IPFS_HASHES] (state, hashes) {
    state.hashes = hashes
  },

  [types.SHEET_SET_ROOT_IPFS_HASH] (state, rootHash) {
    state.rootIpfsHash = rootHash
  },

  [types.SHEET_SET_HASH] (state, hash) {
    state.codeHash = hash
  },

  [types.SHEET_SET_META] (state, meta) {
    state.title = meta.title
    state.description = meta.description
    state.isPublic = meta.isPublic
  }
}

export const actions = {
  calculateHash ({ rootState, getters, commit }, save = false) {
    const { code, compiled } = rootState.editor
    const config = { code, compiled, ...getters.sheetConfig }

    const hash = sha256(JSON.stringify(config))

    if (save) commit(types.SHEET_SET_HASH, hash)

    return hash
  },

  updateFromSave ({ dispatch }, { code, compiled, opts = {} }) {
    if (!code) return false
    dispatch('editor/putOptions', opts, { root: true })

    Object.keys(code).forEach(type => {
      const srcCode = { type, code: code[type] }
      dispatch('editor/updateCode', srcCode, { root: true })

      const compiledCode = { type, output: compiled[type] }
      dispatch('editor/setOutput', { ...compiledCode, loaded: true }, { root: true })
    })

    return true
  },

  async saveLocal ({ rootState, getters, dispatch }, slug) {
    const { code, compiled } = rootState.editor
    db.set(`sheet:${slug}`, { code, compiled, ...getters.sheetConfig })

    dispatch('calculateHash', true)
  },

  loadFromLocal ({ dispatch }, slug) {
    const saved = db.get(`sheet:${slug}`)
    if (!saved) return false

    const { code, compiled, ...opts } = saved
    return saved && dispatch('updateFromSave', { code, compiled, opts })
  },

  async loadFromNebulas ({ dispatch, commit }, slug) {
    const {
      rootHash,
      title,
      description,
      isPublic
    } = await blockchain.getSheet(slug)

    commit(types.SHEET_SET_META, { title, description, isPublic })
    commit(types.SHEET_SET_ROOT_IPFS_HASH, rootHash)

    const opts = await ipfs.getContent(`${rootHash}/config.json`, { parse: true })
    const allCode = await ipfs.getContent(`${rootHash}/code.json`, {
      parse: true
    })

    await dispatch('updateFromSave', {
      code: allCode.code,
      compiled: allCode.compiled,
      opts
    })
  },

  async saveOnNebulas ({ state, getters, dispatch, commit }, slug) {
    dispatch('saveLocal', slug)
    commit(types.SHEET_SET_SAVING, true)

    const { latestHash } = getters
    const data = {
      isPublic: state.isPublic,
      title: state.title,
      description: state.description,
      rootHash: latestHash.root,
      distHash: latestHash.dist
    }

    const saved = await blockchain.saveSheet(slug, data)
    commit(types.SHEET_SET_SAVING, false)
    return saved
  },

  async removeSheet ({ commit }, slug) {
    commit(types.SHEET_SET_SAVING, true)
    return blockchain.saveSheet(slug, { isRemoved: true })
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
    const fileTypes = ['html', 'css', 'js']
      .filter(type => type === 'html' || code[type])

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

    commit(types.SHEET_SET_IPFS_HASHES, hashes)
    commit(types.SHEET_SET_SAVING, false)
  }
}


