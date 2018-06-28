import omit from 'lodash/omit'
import pick from 'lodash/pick'
import flatMap from 'lodash/flatMap'

import * as types from './mutation-types'
import * as ipfs from '../lib/ipfs'
import * as blockchain from '../lib/blockchain'
import * as db from '../lib/db'
import { generateHTML} from '../lib/helpers'

import { PREPROS } from './constants'

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

const pickConfig = editors => Object.keys(editors)
  .reduce((obj, type) => {
    obj[type] = omit(editors[type], 'showCompiled', 'error', 'prepros')
    return obj
  }, {})

export const actions = {
  updateFromSave ({ dispatch }, { code, compiled, opts = {} }) {
    if (!code) return

    dispatch('editor/putOptions', opts, { root: true })

    Object.keys(code).forEach(type => {
      const srcCode = { type, code: code[type] }
      dispatch('editor/updateCode', srcCode, { root: true })

      if (!compiled) return
      const compiledCode = { type, output: compiled[type] }
      dispatch('editor/setOutput', { ...compiledCode, loaded: true }, { root: true })
    })
  },

  loadFromLocal ({ dispatch }, slug) {
    const saved = db.get(`sheet:${slug}`)
    return saved && dispatch('updateFromSave', saved)
  },

  async loadFromNebulas ({ dispatch }, slug) {
    const { rootHash } = await blockchain.getSheet(slug)
    const opts = await ipfs.getContent(`${rootHash}/config.json`, { parse: true })

    const types = Object.keys(opts.editors).map(type => {
      const editor = opts.editors[type]
      return { type, ...PREPROS[type][editor.lang] }
    })

    const [html, css, js] = await Promise.all(types.map(async type => {
      const filename = type.type === 'html' ? 'index' : 'main'
      const empty = !opts.editors[type.type].contentLength
      console.log(`${rootHash}/src/${filename}.${type.ext}`)
      return empty ? '' : await ipfs.getContent(`${rootHash}/src/${filename}.${type.ext}`)
    }))

    console.log({ html, css, js, opts, rootHash, slug })

    dispatch('updateFromSave', { code: { html, css, js }, opts })
    // console.log('sheet config', { code, types, config })

    //dispatch('updateFromSave', )
    //ipfs.getContent()
    // get hashes from nebulas
    //
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

  saveLocal ({ rootState }, slug) {
    const { code, compiled, editors } = rootState.editor
    db.set(`sheet:${slug}`, {
      code, compiled, editors: pickConfig(editors)
    })
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

  async saveOnNebulas ({ getters, dispatch }, slug) {
    dispatch('saveLocal', slug)

    const { latestHash } = getters
    const data = {
      rootHash: latestHash.root,
      distHash: latestHash.dist
    }

    return await blockchain.saveSheet(slug, data)
  }
}


