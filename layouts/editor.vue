<template>
  <div>
    <nuxt/>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters('editor', ['currTheme']),
    ...mapState('ui', ['themeTransition'])
  },
  head () {
    return {
      htmlAttrs: {
        'data-theme': this.currTheme,
        class: this.themeTransition ? 'theme-transition' : ''
      }
    }
  }
}
</script>

<style lang="scss">
@import 'assets/scss/base';
@import 'assets/scss/editor-themes';

html { overflow: hidden; }
body { overflow-x: hidden; }
.section { color: var(--color-text-light); }
</style>
