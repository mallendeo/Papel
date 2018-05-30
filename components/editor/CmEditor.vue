<template>
  <codemirror
    class="editor row"
    :options="editorOpts"
    @input="val => $emit('change', val)"
    @ready="cm => cm.setValue(code)"
  ></codemirror>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    change: { type: Function, default: () => {} },
    code: { type: String },
    options: { type: Object }
  },
  computed: {
    ...mapState('editor', ['opts']),
    editorOpts () {
      return { ...this.opts, ...this.options }
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
  }
}
</style>
