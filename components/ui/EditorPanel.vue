<template>
  <div class="panel">
    <slot />
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.panel {
  background: var(--editor-bg-dark);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0; left: 0;
  z-index: 10;
}
</style>
