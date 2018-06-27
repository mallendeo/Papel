<template>
  <codemirror
    v-observe-visibility="visibilityChanged"
    class="editor row"
    :style="{
      '--editor-font-family': `'${ui.font}'`,
      '--editor-font-size': `${ui.fontSize}px`
    }"
    :options="editorOpts"
    @input="val => loaded && $emit('change', val)"
    @ready="onReady"
    ref="editor"
  ></codemirror>
</template>

<script>
import { mapState } from 'vuex'
import { CodeMirror } from 'vue-codemirror'

export default {
  props: {
    change: { type: Function, default: () => {} },
    code: { type: String, default: '' },
    options: { type: Object },
    updateWhenVisible: { type: Boolean, default: true },
    updateDelay: { type: Number, default: 0 }
  },
  data: () => ({ loaded: false, cm: null }),
  computed: {
    ...mapState('editor', ['cmOpts', 'ui']),
    editorOpts () {
      return { ...this.cmOpts, ...this.options }
    }
  },
  methods: {
    visibilityChanged (isVisible) {
      if (this.updateWhenVisible && isVisible) {
        const ref = this.$refs['editor']
        this.cm = ref.codemirror || ref.$children[0].codemirror
        if (!this.cm) return

        setTimeout(() => this.cm.refresh(), this.updateDelay)
      }
    },

    onReady (cm) {
      this.cm = cm

      // Show hints
      cm.on('keyup', (cm, e) => {
        const isLetter = event.keyCode > 64 && event.keyCode < 91
        if (!cm.state.completionActive && isLetter) {
          CodeMirror.commands.autocomplete(cm, null, { completeSingle: false })
        }
      })

      cm.setValue(this.code)
      this.loaded = true
    },

    updateCode (code) {
      this.cm.setValue(code || this.code)
    }
  }
}
</script>

<style lang="scss" scoped>
.editor {
  flex: 1;
  transition: all .2s ease;
  will-change: flex, height;

  /deep/ .CodeMirror {
    font-family: var(--editor-font-family), monospace;
    font-size: var(--editor-font-size);
    line-height: 1.5;
    -webkit-font-smoothing: initial;
    height: 100%;
    flex: 1;

    &-lines {
      padding-bottom: 4rem;
    }
  }
}
</style>
