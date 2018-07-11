<template>
  <div
    class="loading-wrapper"
    :class="{ 'loading-wrapper--fixed': fixed }"
  >
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fixed: { type: Boolean, default: false }
  }
}
</script>

<style lang="scss" scoped>
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;

  width: 100%;
  height: 100%;
  top: 0; left: 0;
  background: var(--color, var(--editor-color));
  color: white;
  z-index: 20;

  &--fixed {
    position: fixed;
  }
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 100px auto;
  background-color: var(--color-accent, var(--editor-color-accent));
  border-radius: 100%;
  animation: sk-scaleout 1.0s infinite ease-in-out;
}

@keyframes sk-scaleout {
  0% {
    transform: scale(0);
  } 100% {
    transform: scale(1.0);
    opacity: 0;
  }
}
</style>
