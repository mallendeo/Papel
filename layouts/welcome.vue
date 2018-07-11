<template>
  <div class="wrapper">
    <nuxt/>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('ui', ['themeTransition', 'theme'])
  },
  head () {
    return {
      htmlAttrs: {
        'data-theme': this.theme,
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

.wrapper {
  max-width: 68rem;
  margin: auto;
  padding: 0 4rem;
}
</style>
