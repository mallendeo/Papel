<template>
  <section class="section editors col">
    <editor-panel v-if="showSearch">
      <app-search />
    </editor-panel>
    <div
      class="editor__toolbar row"
      :class="{ 'editor__toolbar--danger': editors['html'].error }"
    >
      <span>{{ getPrepros('html').title }}</span>
    </div>

    <div
      v-for="(type, index) of types"
      class="editor__wrapper col"
      :key="`${type}-editor`"
      :id="`${type}-editor`"
    >
      <div
        v-if="index"
        class="editor__toolbar row"
        :class="{ 'editor__toolbar--danger': editors[type].error }"
      >
        <span>{{ getPrepros(type).title }}</span>
      </div>

      <cm-editor
        :updateWhenVisible="true"
        :updateDelay="100"
        :code="editors[type].code"
        :options="{
          mode: getPrepros(type).mime,
          readOnly: editors[type].showProcessed
        }"
        ref="editor"
        @change="code => onCodeChange(code, type)"
      />
    </div>
  </section>
</template>

<script>
import Split from 'split.js'
import { mapState, mapActions, mapGetters } from 'vuex'

import AppToggle from '../ui/AppToggle'
import AppSearch from '../ui/AppSearch'
import EditorPanel from '../ui/EditorPanel'
import CmEditor from './CmEditor'

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
    ...mapState('editor', ['editors', 'code']),
    ...mapGetters('editor', ['types'])
  },

  mounted () {
    const editors = this.types.map(l => `#${l}-editor`)

    this.split = Split(editors, {
      snapOffset: 0,
      minSize: 0,
      gutterSize: 32,
      direction: 'vertical',
      cursor: 'row-resize',
      gutter: index => {
        const elem = this.$el.querySelectorAll('.editor__toolbar')
        return elem[index]
      },

      onDragEnd: () => {
        const editors = this.$refs['editor']
        editors.forEach(editor => {
          const cm = editor.codemirror || editor.$children[0].codemirror
          cm.refresh()
        })
      }
    })
  },
  methods: {
    ...mapActions('editor', ['updateCode']),

    // FIXME: Find some way to trigger the update
    // event only once after the editor is ready
    onCodeChange (code, type) {
      this.updateCode({
        lang: this.editors[type].lang,
        code,
        type
      })
    },

    getPrepros (type) {
      const editor = this.editors[type]
      return editor.prepros[editor.lang]
    }
  }
}
</script>

<style lang="scss" scoped>
.editors {
  height: 100%;
  position: relative;
  background: var(--editor-color);
}

.editor {
  &__btn {
    height: 2rem;
    padding: 0 .75rem;
    color: rgb(26, 21, 21);

    i { font-size: .8rem; }
  }

  &__wrapper {
    z-index: 4;
    overflow: auto;
  }

  &__toolbar {
    justify-content: space-between;
    align-items: center;
    flex: 0 1 2rem;

    position: relative;
    padding: 0 1rem;

    background: var(--editor-color-dark);
    transition: all .2s ease;
    color: var(--text-lighter);

    font-size: .75rem;
    z-index: 4;

    &:not(:first-of-type) {
      cursor: row-resize;
    }

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
