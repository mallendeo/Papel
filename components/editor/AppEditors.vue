<template>
  <section class="section editors col">
    <editor-panel v-if="showSearch">
      <app-search />
    </editor-panel>
    <div
      class="editor__toolbar row"
      :class="{
        'editor__toolbar--danger': editors['html'].error,
        'editor__toolbar--mini': zenMode
      }"
    >
      <app-select
        class="select-wrapper"
        :currTitle="makeTitle('html', editors['html'].lang)"
        :options="makeSelectOptions('html')"
        :value="editors['html'].lang"
        @change="lang => setEditorLang('html', lang)"
      />

      <app-dropdown icon="settings">
        <lang-settings lang="html" />
      </app-dropdown>

      <i @click="onToggleCompiledClick('html')" class="toolbar-icon material-icons">
        {{ !editors['html'].showCompiled ? 'visibility' : 'visibility_off' }}
      </i>
    </div>

    <div
      v-for="(type, index) of types"
      class="editor__wrapper col"
      :key="`${type}-editor`"
      :id="`${type}-editor-wrapper`"
    >
      <div
        v-if="index"
        class="editor__toolbar row"
        :class="{
          'editor__toolbar--danger': editors[type].error,
          'editor__toolbar--mini': zenMode
        }"
      >
        <app-select
          :currTitle="makeTitle(type, editors[type].lang)"
          :options="makeSelectOptions(type)"
          :value="editors[type].lang"
          @change="lang => setEditorLang(type, lang)"
        />

        <app-dropdown icon="settings">
          <lang-settings :lang="type" />
        </app-dropdown>

        <i @click="onToggleCompiledClick(type)" class="toolbar-icon material-icons">
          {{ !editors[type].showCompiled ? 'visibility' : 'visibility_off' }}
        </i>
      </div>

      <cm-editor
        :updateWhenVisible="true"
        :updateDelay="100"
        :code="initCode[type]"
        :options="makeEditorOptions(type)"
        ref="editor"
        :id="`${type}-editor`"
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
import AppDropdown from '../ui/AppDropdown'
import AppSearch from '../ui/AppSearch'
import AppSelect from '../ui/AppSelect'
import EditorPanel from '../ui/EditorPanel'
import CmEditor from './CmEditor'
import LangSettings from './LangSettings'

export default {
  components: {
    AppToggle,
    AppDropdown,
    AppSearch,
    AppSelect,
    CmEditor,
    EditorPanel,
    LangSettings
  },

  data: () => ({
    split: null,
    showSearch: false,
    initCode: {}
  }),

  computed: {
    ...mapState('editor', ['editors', 'code', 'compiled']),
    ...mapGetters('editor', ['types', 'preprosList', 'prepros']),
    ...mapState('ui', ['zenMode'])
  },

  mounted () {
    this.initCode = { ...this.code } // make a copy of the state
    this.$nextTick(() => this.refreshEditors(true))
    this.initSplit()
  },
  methods: {
    initSplit () {
      let sizes = null

      if (this.split) {
        sizes = this.split.getSizes()
        this.split.destroy()
      }

      const wrappers = this.types.map(l => `#${l}-editor-wrapper`)

      this.split = Split(wrappers, {
        sizes,
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

    ...mapActions('editor', ['updateCode', 'setLang', 'toggleCompiled']),

    // FIXME: Find some way to trigger the update
    // event only once after the editor is ready
    onCodeChange (code, type) {
      // Don't update when showing the compiled output
      if (this.editors[type].showCompiled) return

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
      const { prepros } = this.editors[type]
      return this.preprosList(type).map(lang => ({
        value: lang,
        icon: require(`~/assets/icons/${prepros[lang].icon}.svg`),
        title: `${prepros[lang].title}${!prepros[lang].enabled ? ' (Soon)' : ''}`,
        disabled: !prepros[lang].enabled
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
      const editor = this.$refs['editor'].find(editor => editor.$el.id === `${type}-editor`)
      const code = this.editors[type].showCompiled
        ? this.compiled[type]
        : this.code[type]
      editor.updateCode(code)
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
  padding-right: 1rem;
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

    //background: var(--editor-color-dark);
    background: var(--editor-color);

    transition: all .2s ease;
    color: var(--text-lighter);

    font-size: .75rem;

    &:not(:first-of-type) {
      cursor: row-resize;
      border-top: 1px solid rgba(0,0,0,.3);
    }

    &--danger {
      box-shadow: inset .125rem 0 0 var(--error-color);
    }

    &--mini {
      flex-basis: .25rem;
      > * {
        transition: all .1s ease;
        opacity: 0
      }
      &:hover, &:active {
        flex-basis: 2rem;
        > * { opacity: 1; }
      }
    }
  }
}

.on-top {
  margin-top: -2rem;
  position: absolute;
  z-index: 999;
}
</style>
