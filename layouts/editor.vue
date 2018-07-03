<template>
  <div>
    <nuxt/>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters('editor', ['currTheme', 'themeTransition']),
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
@import 'assets/scss/main';
@import 'assets/scss/editor';
</style>
