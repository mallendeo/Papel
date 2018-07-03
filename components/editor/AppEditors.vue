<template>
  <section class="section editors col">
    <editor-panel v-show="showLibPicker">
      <library-picker @backclick="showLibPicker = !showLibPicker" />
    </editor-panel>

    <editor-toolbar
      class="toolbar toolbar--no-drag"
      data-toolbar
      :danger="!!editors.html.error"
      :mini="zenMode"
    >
      <app-select
        class="select-wrapper"
        :currTitle="makeTitle('html', editors.html.lang)"
        :options="makeSelectOptions('html')"
        :value="editors.html.lang"
        @change="lang => setEditorLang('html', lang)"
      />

      <button
        title="Add library"
        @click="showLibPicker = !showLibPicker"
        class="btn btn--colored"
      >
        <i class="material-icons">add</i>
      </button>

      <button
        @click="refreshIframe"
        class="btn"
        :class="{ spin: animateRefresh }"
        @animationend="animateRefresh = false"
      >
        <i class="material-icons">refresh</i>
      </button>

      <app-dropdown icon="settings">
        <lang-settings lang="html" />
      </app-dropdown>

      <i @click="onToggleCompiledClick('html')" class="toolbar-icon material-icons">
        {{ !editors['html'].showCompiled ? 'visibility' : 'visibility_off' }}
      </i>
    </editor-toolbar>

    <div
      v-for="(type, index) of types"
      class="editor__wrapper col"
      :key="`${type}-editor`"
      :id="`${type}-editor-wrapper`"
    >
      <editor-toolbar
        v-if="index"
        data-toolbar
        :class="{ 'no-events': wasDragged }"
        :danger="!!editors[type].error"
        :mini="zenMode"
      >
        <app-select
          class="select-wrapper"
          :currTitle="makeTitle(type, editors[type].lang)"
          :options="makeSelectOptions(type)"
          :value="editors[type].lang"
          @change="lang => setEditorLang(type, lang)"
        />

        <app-dropdown v-if="type !== 'js'" icon="settings">
          <lang-settings :lang="type" />
        </app-dropdown>

        <i @click="onToggleCompiledClick(type)" class="toolbar-icon material-icons">
          {{ !editors[type].showCompiled ? 'visibility' : 'visibility_off' }}
        </i>
      </editor-toolbar>

      <cm-editor
        :update-when-visible="true"
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
import AppSelect from '../ui/AppSelect'
import EditorPanel from '../ui/EditorPanel'
import EditorToolbar from './EditorToolbar'
import CmEditor from './CmEditor'
import LangSettings from './LangSettings'
import LibraryPicker from './LibraryPicker'

export default {
  components: {
    AppToggle,
    AppDropdown,
    AppSelect,
    CmEditor,
    EditorPanel,
    EditorToolbar,
    LangSettings,
    LibraryPicker
  },

  data: () => ({
    split: null,
    showLibPicker: false,
    initCode: {},
    wasDragged: false,
    unsubscribe: null,
    animateRefresh: false
  }),

  computed: {
    ...mapState('editor', ['editors', 'code', 'compiled', 'previewIframe']),
    ...mapGetters('editor', ['types', 'preprosList', 'prepros']),
    ...mapState('ui', ['zenMode'])
  },

  beforeDestroy () {
    this.unsubscribe()
  },

  mounted () {
    this.initCode = { ...this.code } // make a copy of the state
    this.$nextTick(() => this.refreshEditors(true))
    this.initSplit()

    this.unsubscribe = this.$store.subscribeAction((action, state) => {
      if (action.type === 'editor/setOutput' && action.payload.loaded) {
        this.initCode = { ...this.code }
      }
    })
  },

  watch: {
    zenMode () {
      this.initSplit()
    }
  },

  methods: {
    refreshIframe () {
      const { src } = this.previewIframe
      this.previewIframe.src = src
      this.animateRefresh = true
    },
    initSplit () {
      let sizes = null

      const toolbars = this.$el.querySelectorAll('[data-toolbar]')
      const wrappers = this.types.map(l => `#${l}-editor-wrapper`)

      if (this.split) {
        sizes = this.split.getSizes()
        this.split.destroy()
      }

      this.split = Split(wrappers, {
        sizes,
        snapOffset: 0,
        minSize: 0,
        gutterSize: this.zenMode ? 4 : 32,
        direction: 'vertical',
        cursor: 'row-resize',
        gutter: index => toolbars[index],
        elementStyle: (dimension, size, gutterSize) => ({
          'flex-basis': `calc(${size}% - ${gutterSize}px)`
        }),

        onDrag: () => {
          this.wasDragged = true
        },
        onDragEnd: () => {
          if (this.wasDragged) this.refreshEditors()
          this.wasDragged = false
        }
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
.select-wrapper {
  min-width: 4rem;
  margin-right: auto;
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

.toolbar {
  .btn {
    padding: 0 .5rem;
    margin-right: .5rem;
    border-radius: .25rem;
    height: 70%;

    &--colored {
      color: var(--text-light);
      background: var(--editor-color-accent);
    }

    i { font-size: 1rem; }
  }

  &.toolbar--no-drag{
    cursor: default;
    border-top: none;
  }
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
}

.spin {
  animation: spin .5s ease both;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  from { transform: rotate(-360deg); }
}
</style>
