<template>
  <codemirror
    v-observe-visibility="visibilityChanged"
    class="editor row"
    :options="editorOpts"
    @input="val => loaded && $emit('change', val)"
    @ready="onReady"
    ref="editor"
  ></codemirror>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    change: { type: Function, default: () => {} },
    code: { type: String },
    options: { type: Object },
    updateWhenVisible: { type: Boolean, default: true },
    updateDelay: { type: Number, default: 0 }
  },
  data: () => ({ loaded: false }),
  computed: {
    ...mapState('editor', ['opts']),
    editorOpts () {
      return { ...this.opts, ...this.options }
    }
  },
  methods: {
    visibilityChanged (isVisible) {
      if (this.updateWhenVisible && isVisible) {
        const ref = this.$refs['editor']
        const cm = ref.codemirror || ref.$children[0].codemirror
        if (!cm) return

        setTimeout(() => cm.refresh(), this.updateDelay)
      }
    },

    onReady (cm) {
      cm.setValue(this.code)
      this.loaded = true
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
    height: 100%;
    flex: 1;
    font-size: 14px; // FIXME: make it a setting
  }
}
</style>
