<template>
  <div>
    <nuxt/>
  </div>
</template>

<script>
export default {
  head() {
    return {
      htmlAttrs: {
        'data-theme': 'dark'
      }
    }
  }
}
</script>

<style lang="scss">
@import 'assets/scss/main';
</style>
