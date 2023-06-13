<template>
  <div class="search col">
    <div class="search__content">
      <h2 class="title row">
        <button @click="$emit('backclick')" class="btn-back row">
          <i class="material-icons">arrow_back</i>
        </button>
        Search or paste a URL
      </h2>

      <div class="input__wrapper">
        <input
          class="input"
          v-model="search"
          @keydown.enter="addFromUrl(search)"
          type="search"
          placeholder="vue, bootstrap, https://cdn.js..."
        >
        <button
          @click="addFromUrl(search)"
          v-if="showInputBtn"
          class="input__btn"
        >Add</button>
      </div>

      <div
        v-if="!search && allLibs.length"
        :key="`libs-${lang}`"
        v-for="lang of ['js', 'css']"
        class="results__wrapper"
      >
        <h4 class="subtitle">
          <strong>{{ lang.toUpperCase() }}</strong>
          Resources
        </h4>

        <draggable
          element="ul"
          class="results picks"
          v-model="libs[lang]"
          :options="{ handle: '.handle', group: 'libs' }"
        >
          <transition-group class="transition-group">
            <li
              class="results__item row"
              v-for="(lib, index) of libs[lang]"
              :key="`pick-${lang}-${index}`"
            >
              <app-btn-select class="btn-select">
                <strong class="label">
                  {{ lib.name }}
                  <span v-if="lib.name"> / </span>
                  <span>{{ lib.filename }}</span>
                </strong>
                <button
                  class="select-like btn--danger"
                  @click="setLib(lib, true, lang)"
                >
                  <i class="material-icons">remove_circle</i>
                </button>

                <button
                  title="Copy URL"
                  class="select-like"
                  v-clipboard:copy="lib.url"
                >
                  <i class="material-icons">link</i>
                </button>

                <button class="handle">
                  <i class="material-icons">drag_handle</i>
                </button>
              </app-btn-select>
            </li>
          </transition-group>
        </draggable>
      </div>

      <span class="message" v-if="!search && !allLibs.length">
        Nothing here, yet.
      </span>

      <ul
        v-if="search && !showInputBtn"
        class="results"
        :class="{ 'results--loading': isLoading }"
      >
        <li
          class="results__item row"
          v-for="result of filtered"
          :key="result.latest"
        >
          <app-btn-select
            :label="result.name"
            class="btn-select"
          >
            <select data-version :value="result.version">
              <option
                :value="version"
                :key="`${result.name}-${version}`"
                v-for="{ version } of [{ version: result.version }]"
              >{{ version }}</option>
            </select>
            <select data-file :value="result.filename">
              <option
                :value="file || ''"
                :key="`${result.name}-${file || ''}`"
                v-for="file of getFiles(result.name, result.version)"
              >{{ file }}</option>
            </select>

            <button
              @click="e => toggleLibrary(e.target, result.name)"
              class="select-like"
            >
              <i class="material-icons">add</i>
            </button>
          </app-btn-select>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import axios from 'axios'
import draggable from 'vuedraggable'
import ElementQueries from 'css-element-queries/src/ElementQueries'

import AppBtnSelect from '../ui/AppBtnSelect'

const CancelToken = axios.CancelToken
let source // CancelToken.source()

const API_URL = 'https://api.cdnjs.com/libraries'

export default {
  components: {
    draggable,
    AppBtnSelect
  },
  props: {
    delay: { type: Number, default: 500 },
    limit: { type: Number, default: 5 }
  },
  data () {
    return {
      timeout: null,
      results: [],
      loaded: false,
      libs: {
        js: [],
        css: []
      },
      showInputBtn: false,
      isLoading: false,
      search: '',
      libInfo: {}
    }
  },
  mounted () {
    ElementQueries.init()

    const { editors } = this.$store.state.editor

    this.libs = {
      js: editors.js.libs,
      css: editors.css.libs
    }
  },

  // TODO: Do it properly without using watchers
  watch: {
    libs: {
      handler ({ js, css }) {
        this.setLibs({ type: 'js', libs: js })
        this.setLibs({ type: 'css', libs: css })
      },
      deep: true
    },
    search (val) {
      this.onChange(val)
    }
  },
  methods: {
    async fetchInfo (lib) {
      const { data } = await axios(`${API_URL}/${lib.name}?fields=assets`)
      this.libInfo = { ...this.libInfo, [lib.name]: data.assets }
    },
    getVersions (name) {
      return this.libInfo[name] || []
    },
    ...mapActions('editor', ['setLibs']),

    onChange (val) {
      this.results = []

      if (!val) return

      if (/(?:https?:)?\/\//.test(val)) {
        this.showInputBtn = true
        return
      }

      this.showInputBtn = false
      this.isLoading = true

      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      const extra = '&fields=filename,version'

      this.timeout = setTimeout(async () => {
        try {
          if (source) source.cancel()
          source = CancelToken.source()

          const { data } = await axios(`${API_URL}?search=${val}${extra}`, {
            cancelToken: source.token
          })

          this.results = data.results.slice(0, this.limit)
        } catch (err) {
          if (!axios.isCancel(err)) {
            this.$notify({
              group: 'editor',
              title: 'Search error',
              text: err.message
            })
          }
        } finally {
          this.isLoading = false
          for (const result of this.results) {
            await this.fetchInfo(result)
          }
        }
      }, this.delay)
    },

    addFromUrl (url) {
      if (!this.showInputBtn || !url) return

      let filename = ''
      let type = null

      try {
        if (url.includes('fonts.googleapis')) {
          filename = url.match(/family=(.+)/)[1]
            .split('|')
            .map(w => w.replace(/\:.+|\+/, ' ').trim())
            .join(', ')
          type = 'css'
        }
      } catch (e) {
        console.error(e)
      }

      const match = url.match(/[^\/]+$/)
      filename = filename || (match ? match[0] : '')

      this.setLib({ url, filename }, false, type)
      this.search = ''
      this.showInputBtn = false
    },

    setLib (lib, remove, libType) {
      const type = libType || (lib.filename.endsWith('css') ? 'css' : 'js')
      const arr = this.libs[type]

      if (remove) {
        this.libs[type] = arr.filter(curr => curr.url !== lib.url)
        this.$notify({
          group: 'editor',
          title: `${lib.name ? `${lib.name} / ` : ''}${lib.filename} removed`
        })
        return
      }

      if (arr.find(curr => curr.url === lib.url)) {
        this.$notify({
          group: 'editor',
          type: 'warn',
          title: `You've already added this resource`
        })
        return
      }

      this.libs[type] = [...arr, lib]
      this.$notify({
        group: 'editor',
        type: 'success',
        title: `Resource added to ${type.toUpperCase()}`,
        text: `${lib.name} / ${lib.filename}`
      })
    },

    toggleLibrary (elemOrUrl, name, remove) {
      // I could do this the vue way using data binding, but for the
      // sake of performance and since this is done once,
      // I'll get the values directly from the DOM
      const parent = elemOrUrl.closest('.btn-select')
      const { value: version } = parent.querySelector('[data-version]')
      const { value: filename } = parent.querySelector('[data-file]')

      const BASE_URL = 'https://cdnjs.cloudflare.com/ajax/libs'
      const url = `${BASE_URL}/${name}/${version}/${filename}`
      this.setLib({ url, name, filename }, remove)
    },

    isSelected () {
      return url => this.allLibs.indexOf(url) > -1
    },

    getFiles (libName, version) {
      if (!this.libInfo[libName]) return ['']
      const info = this.libInfo[libName].find(lib => lib.version === version)
      return info ? info.files : []
    }
  },
  computed: {
    filtered () {
      return this.results.map(lib => ({ ...lib, assets: [lib] }))
      // DEPRECATED: https://github.com/cdnjs/cdnjs/issues/14140
      // return this.results
      //   .slice(0, this.limit)
      //   .map(lib => ({
      //       ...lib,
      //       assets: lib.assets.map(asset => ({
      //         ...asset,
      //         files: asset.files.filter(file => {
      //           return file.endsWith('js') || file.endsWith('css')
      //         })
      //       }))
      //     })
      //   )
    },
    allLibs () {
      return [...this.libs.js, ...this.libs.css]
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/scss/placeholders';

.title, .subtitle {
  padding: 1rem;
  font-weight: 300;
  font-size: 1.25rem;
}

.subtitle {
  padding: 1rem 0;
}

.message {
  margin: auto;
  display: grid;
  align-items: center;
  justify-content: center;
  height: 9rem;
  opacity: .4;
}

.title {
  font-weight: 400;
  align-items: flex-end;
  padding-left: .5rem;
}

.btn-back {
  height: 100%;
  color: var(--color-text-lighter);
  margin-right: .5rem;
  outline: none;
  &:focus { background: var(--color-editor-dark); }
  i { font-size: 1.25rem; }
}

// https://github.com/SortableJS/Vue.Draggable#gotchas
.transition-group {
  display: block;
  min-height: 1rem;
}

.btn-select {
  width: 100%;

  .material-icons {
    padding: .25rem;
    font-size: 1rem;
  }

  /deep/ {
    .label, select {
      color: var(--color-text-light);
      flex: 1;
      text-align: left;
    }

    .label {
      font-weight: bold;
      color: var(--color-text-lighter);
    }

    select {
      max-width: 25%;
    }

    .select-like {
      max-width: 15%;
      padding: .55rem;
      justify-content: center;
    }

    .btn--danger {
      &:hover {
        background: var(--color-error);
      }
    }
  }
}

button.handle {
  cursor: row-resize;
  color: var(--color-text-light);
}

.picks {
  flex: 1;

  .results__item {
    transition: all .2s ease;
    justify-content: space-between;
    * { color: var(--color-text-light); }
    *:first-child { margin-right: auto; }
  }
}

.search {
  margin: 0;
  overflow-y: auto;

  &, &__content {
    position: relative;
    height: 100%;
  }

  &[min-width~="30rem"] &__content {
    width: 30rem;
    margin: auto;
    padding-top: 2rem;
  }
}

.input {
  padding: .75rem;
  height: 100%;
  border-radius: .5rem;
  padding-left: .5rem;
  appearance: none;
  border: none;
  box-shadow: 0 .5rem 3rem var(--color-editor-dark);
  color: var(--color-text-light);
  font-size: .8rem;
  transition: all .2s ease;
  background: var(--color-editor);
  padding-left: 2rem;
  flex: 1;

  &:focus { outline: none; }

  &::placeholder { color: var(--color-text-lighter); }

  &__wrapper {
    display: flex;
    padding: .5rem 2rem 2rem;
    position: sticky;
    top: 1rem;
    z-index: 9;
  }

  &__btn {
    color: var(--color-text-light);
    font-weight: bold;
    background: var(--color-editor-accent);
    padding: .9rem;
    margin-left: .5rem;
    border-radius: .5rem;
  }
}

.results {
  z-index: 8;
  word-wrap: break-word;
  padding-bottom: 2rem;

  &--loading {
    &:after {
      content: '';
      @extend %abs-center;
      color: white;
      border: .125rem solid var(--color-editor-accent);
      border-radius: 50%;
      border-top-color: transparent;
      border-right-color: transparent;
      width: 2rem; height: 2rem;
      margin: auto;
      animation: spin .75s linear infinite;
    }
  }

  &__wrapper {
    padding: 0 1.5rem;
  }

  &__item {
    font-size: .75rem;
    color: var(--color-text-light);
    position: relative;
    cursor: pointer;

    span { opacity: .5; }

    &:hover {
      background: var(--color-editor);
      span { opacity: 1; }
    }
  }
}
</style>
