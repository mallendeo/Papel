<template>
  <notifications :group="group" />
</template>

<script>
export default {
  props: {
    group: { type: String }
  }
}
</script>

<style lang="scss" scoped>
.notifications /deep/ {
  .notification {
    border-radius: .25rem;
    border-left: none;
    margin: .5rem .5rem 0;
  }
}
</style>
