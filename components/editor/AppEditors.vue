<template>
  <section class="section editors col">
    <editor-panel v-if="showSearch">
      <app-search />
    </editor-panel>
    <div
      class="editor__toolbar row"
      :class="{ 'editor__toolbar--danger': editors['html'].error }"
    >
      <app-select
        class="select-wrapper"
        :currTitle="makeTitle('html', editors['html'].lang)"
        :options="makeSelectOptions('html')"
        :value="editors['html'].lang"
        @change="lang => setEditorLang('html', lang)"
      />

      <i @click="onToggleCompiledClick('html')" class="toolbar-icon material-icons">
        {{ !editors['html'].showCompiled ? 'visibility' : 'visibility_off' }}
      </i>
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
        <app-select
          :currTitle="makeTitle(type, editors[type].lang)"
          :options="makeSelectOptions(type)"
          :value="editors[type].lang"
          @change="lang => setEditorLang(type, lang)"
        />

        <i @click="onToggleCompiledClick(type)" class="toolbar-icon material-icons">
          {{ !editors[type].showCompiled ? 'visibility' : 'visibility_off' }}
        </i>
      </div>

      <cm-editor
        :updateWhenVisible="true"
        :updateDelay="100"
        :code="editorCode(type)"
        :options="makeEditorOptions(type)"
        ref="editor"
        :class="{ 'cm-editor--opaque': editors[type].showCompiled }"
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

import AppSelect from '../ui/AppSelect'

export default {
  components: {
    AppToggle,
    AppSearch,
    AppSelect,
    CmEditor,
    EditorPanel
  },

  data: () => ({
    split: null,
    showSearch: false
  }),

  computed: {
    ...mapState('editor', ['editors', 'code', 'compiled']),
    ...mapGetters('editor', ['types', 'preprosList', 'prepros']),

    editorCode () {
      return type => this.editors[type].showCompiled
        ? this.compiled[type]
        : this.editors[type].code
    }
  },

  mounted () {
    const editors = this.types.map(l => `#${l}-editor`)

    this.split = Split(editors, {
      snapOffset: 0,
      minSize: -1, // FIXME: Workaround for zero gap gutter
      gutterSize: 32,
      direction: 'vertical',
      cursor: 'row-resize',
      gutter: index => {
        const elem = this.$el.querySelectorAll('.editor__toolbar')
        return elem[index]
      },

      elementStyle: (dimension, size, gutterSize) => ({
        'flex-basis': `calc(${size}% - ${gutterSize}px)`
      }),

      onDragEnd: () => this.refreshEditors()
    })
  },
  methods: {
    ...mapActions('editor', ['updateCode', 'setLang', 'toggleCompiled']),

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
    },

    makeSelectOptions (type) {
      return this.preprosList(type).map(lang => ({
        value: lang,
        icon: require(`~/assets/icons/${lang}.svg`),
        title: this.editors[type].prepros[lang].title
      }))
    },

    makeTitle (type, lang) {
      const prepros = this.prepros(type)
      return type === lang
        ? prepros.title
        : `${type.toUpperCase()} (${prepros.title})`
    },

    makeEditorOptions (type) {
      const compiled = this.editors[type].showCompiled
      const mode = compiled
        ? this.editors[type].prepros[type].mime // the first element is the main lang
        : this.getPrepros(type).mime
      const readOnly = this.editors[type].showCompiled

      return { mode, readOnly }
    },

    refreshEditors (updateCode) {
      const editors = this.$refs['editor']
      if (!editors) return

      editors.forEach(editor => {
        if (updateCode) editor.updateCode()

        const cm = editor.codemirror || editor.$children[0].codemirror
        cm.refresh()
      })
    },

    onToggleCompiledClick (type) {
      this.toggleCompiled(type)
      this.$nextTick(() => this.refreshEditors(true))
    },

    setEditorLang (type, lang) {
      this.setLang({ type, lang })
    }
  }
}
</script>

<style lang="scss" scoped>
$toolbar-size: 2rem;

.select-wrapper {
  min-width: 8rem;
}

.editors {
  height: 100%;
  position: relative;
  background: var(--editor-color);
}

.cm-editor--opaque { opacity: .5 }
.toolbar-icon {
  font-size: 1rem;
  padding: .5rem;
  cursor: pointer;
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
    position: relative;
  }

  &__toolbar {
    justify-content: space-between;
    align-items: center;
    flex: 0 0 $toolbar-size;

    position: relative;

    background: var(--editor-color-dark);
    transition: all .2s ease;
    color: var(--text-lighter);

    font-size: .75rem;

    &:not(:first-of-type) {
      cursor: row-resize;
    }

    &--danger {
      box-shadow: inset .125rem 0 0 var(--error-color);
    }
  }
}

.on-top {
  margin-top: -2rem;
  position: absolute;
  z-index: 999;
}
</style>
