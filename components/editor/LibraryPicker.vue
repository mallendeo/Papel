<template>
  <div class="search col">
    <h2 class="title row">
      <button @click="$emit('backclick')" class="btn-back row">
        <i class="material-icons">arrow_back</i>
      </button>
      Search or paste a URL
    </h2>

    <div class="input__wrapper">
      <input
        class="input"
        @input="onChange"
        type="search"
        placeholder="vue, bootstrap, https://cdn.js..."
      >
      <button v-if="showInputBtn" class="input__btn">Add</button>
    </div>

    <div
      v-if="!search"
      :key="`libs-${lang}`"
      v-for="lang of ['js', 'css']"
      class="results__wrapper"
    >
      <h4 class="subtitle">
        <strong>{{ lang.toUpperCase() }}</strong>
        Resources
      </h4>
      <span v-if="!libs[lang].length">Nothing here yet</span>
      <draggable
        element="ul"
        class="results picks"
        v-model="libs[lang]"
        :options="{ handle: '.handle', group: 'libs' }"
      >
        <transition-group class="transition-group">
          <li
            class="results__item row"
            v-for="lib of libs[lang]"
            :key="`pick-${lib.name}`"
          >
            <app-btn-select class="btn-select">
              <strong class="label">
                {{ lib.name }}
                <span>&nbsp;/ {{ lib.filename }}</span>
              </strong>
              <button
                class="select-like btn--danger"
                @click="setLib(lib, true)"
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
              v-for="{ version } of result.assets"
            >{{ version }}</option>
          </select>
          <select data-file :value="result.filename">
            <option
              :value="file"
              :key="`${result.name}-${file}`"
              v-for="file of getFiles(result.assets, result.version)"
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
</template>

<script>
import axios from 'axios'
import draggable from 'vuedraggable'
import ElementQueries from 'css-element-queries/src/ElementQueries'

import AppBtnSelect from '../ui/AppBtnSelect'

export default {
  components: {
    draggable,
    AppBtnSelect
  },
  props: {
    delay: { type: Number, default: 500 },
    limit: { type: Number, default: 20 }
  },
  data: () => ({
    timeout: null,
    results: [],
    libs: {
      js: [],
      css: []
    },
    isLoading: false,
    search: ''
  }),
  mounted () {
    ElementQueries.init()
  },
  methods: {
    onChange (event) {
      const val = event.target.value

      this.results = []
      this.search = val

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

      const extra = '&fields=assets,filename,version'

      this.timeout = setTimeout(async () => {
        const API_URL = 'https://api.cdnjs.com/libraries'
        const { data } = await axios(`${API_URL}?search=${val}${extra}`)
        this.results = data.results
        this.isLoading = false
      }, this.delay)
    },

    addCustomLib (url) {
      const match = url.match(/[^\/]+$/)
      const filename = match ? match[0] : ''

      return { url, filename }
    },

    setLib (lib, remove) {
      const type = lib.filename.endsWith('css') ? 'css' : 'js'
      const arr = this.libs[type]

      if (remove) {
        this.libs[type] = arr.filter(curr => curr.url !== lib.url)
        this.$notify({
          group: 'editor',
          title: `${lib.name} / ${lib.filename} removed`
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

    getFiles (assets, version) {
      const found = assets.find(a => a.version === version)
      return found ? found.files : []
    }
  },
  computed: {
    filtered () {
      return this.results
        .slice(0, this.limit)
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

.title {
  font-weight: 400;
  align-items: center;
  padding-left: .5rem;
}

.btn-back {
  height: 100%;
  color: var(--text-lighter);
  padding-right: 1rem;
  i { font-size: 1.25rem; }
}

// https://github.com/SortableJS/Vue.Draggable#gotchas
.transition-group {
  display: block;
  min-height: 10rem;
}

.btn-select {
  width: 100%;

  .material-icons {
    padding: .25rem;
    font-size: 1rem;
  }

  /deep/ {
    .label, select {
      color: var(--text-light);
      flex: 1;
      text-align: left;
    }

    .label {
      font-weight: bold;
      color: var(--text-lighter);
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
        background: var(--error-color);
      }
    }
  }
}

button.handle {
  cursor: row-resize;
  color: var(--text-light);
}

.picks {
  flex: 1;

  .results__item {
    transition: all .2s ease;
    justify-content: space-between;
    * { color: var(--text-light); }
    *:first-child { margin-right: auto; }
  }
}

.search {
  position: relative;
  height: 100%;
  overflow-y: auto;
  margin: 0;

  &[min-width~="30rem"] {
    width: 30rem;
    margin: auto;
    margin-top: 2rem;
  }
}

.input {
  padding: .75rem;
  height: 100%;
  border-radius: .5rem;
  padding-left: .5rem;
  appearance: none;
  border: none;
  color: var(--text-light);
  font-size: 1rem;
  transition: all .2s ease;
  background: var(--editor-color);
  padding-left: 2rem;
  flex: 1;

  &::placeholder {
    color: var(--text-lighter);
  }

  &__wrapper {
    display: flex;
    padding: .5rem 2rem 2rem;
    position: sticky;
    top: 0;
    z-index: 9;
  }

  &__btn {
    color: var(--text-light);
    background: var(--editor-color);
    padding: .9rem;
    margin-left: .5rem;
    border-radius: .5rem;
  }

  &:focus { outline: none; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.results {
  width: 100%;
  z-index: 10;
  word-wrap: break-word;
  overflow-y: auto;

  &--loading {
    &:after {
      content: '';
      @extend %abs-center;
      color: white;
      border: .125rem solid var(--editor-color-accent);
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
    color: var(--text-light);
    position: relative;
    cursor: pointer;

    span { opacity: .5; }

    &:hover {
      background: var(--editor-color);
      span { opacity: 1; }
    }
  }
}
</style>
