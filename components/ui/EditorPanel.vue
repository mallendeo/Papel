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
  background: var(--editor-color);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0; left: 0;
  z-index: 10;
  animation: slide-in .2s ease both;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    transform: translateY(0rem);
  }
}
</style>
