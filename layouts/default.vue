<template>
  <div>
    <nuxt/>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
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
@import 'assets/scss/themes';
@import 'assets/scss/default';
</style>
