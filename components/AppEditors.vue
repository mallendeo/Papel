<template>
  <div class="editors col">
    <editor-panel v-if="showSearch">
      <app-search />
    </editor-panel>

    <div
      v-for="lang of langs"
      class="editor__wrapper col"
      :key="`${lang}-editor`"
      :id="`${lang}-editor`"
    >
      <div
        class="editor__toolbar row"
        :class="{ 'editor__toolbar--danger': editors[lang].error }"
      >
        <span>{{ editors[lang].prepros[editors[lang].lang].title }}</span>
      </div>

      <button class="on-top btn editor__btn">
        <i class="material-icons">settings</i>
      </button>

      <cm-editor
        :code="editors[lang].code"
        :options="{ mode: editors[lang].prepros[editors[lang].lang].mime }"
        @change="code => update(editors[lang].lang, code, lang)"
      />
    </div>
  </div>
</template>

<script>
import Split from 'split.js'
import { mapState, mapActions } from 'vuex'

import AppToggle from './ui/AppToggle'
import AppSearch from './ui/AppSearch'
import EditorPanel from './ui/EditorPanel'
import CmEditor from './CmEditor'

const worker = new Worker('transform-worker.js')

export default {
  components: {
    AppToggle,
    AppSearch,
    CmEditor,
    EditorPanel
  },
  data: () => ({
    split: null,
    showSearch: false
  }),
  computed: {
    ...mapState('editor', ['editors']),
    langs () {
      return Object.keys(this.editors)
    }
  },
  mounted () {
    const editors = this.langs.map(l => `#${l}-editor`)
    this.split = Split(editors, {
      snapOffset: 0,
      minSize: 0,
      gutterSize: 32,
      direction: 'vertical',
      cursor: 'row-resize',
      gutter: index => {
        const elem = this.$el.querySelectorAll('.editor__toolbar')
        return elem[index]
      }
    })

    worker.addEventListener('message', event => {
      const { data } = event

      if (data.error) {
        this.setError({ lang: data.lang, error: data.error })
        console.log('ERROR', data)
        return
      }
      this.setOutput({ lang: data.lang, output: data.output })
      console.log(data)
    }, false)
  },
  methods: {
    ...mapActions('editor', ['updateCode', 'setError', 'setOutput']),
    update (type, code, lang) {
      this.updateCode({ type: lang, code })
      worker.postMessage({ code, type, lang })
    }
  }
}
</script>

<style lang="scss" scoped>
.editors {
  flex: 1;
  position: relative;
  padding-top: 2rem;
  background: #273238;
}

.editor {
  &__btn {
    height: 2rem;
    opacity: .5;
    padding: 0 .75rem;
    color: white;

    i { font-size: .8rem; }
    &:hover { opacity: 1; }
  }

  &__wrapper:first-of-type .editor__toolbar {
    margin-top: -2rem;
    height: 2rem;
    cursor: default;
  }

  &__toolbar {
    justify-content: space-between;
    align-items: center;

    position: relative;
    padding: 0 1rem;

    background: darken(#263238, 2);
    transition: all .2s ease;
    color: white;

    font-size: .75rem;
    z-index: 4;
    cursor: row-resize;

    &--danger {
      box-shadow: inset .125rem 0 0 var(--error-color);
    }
  }
}

.on-top {
  position: relative;
  z-index: 9;
  align-self: flex-end;
  margin-top: -2rem;
}
</style>
