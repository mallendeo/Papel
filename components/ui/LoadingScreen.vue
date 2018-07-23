<template>
  <div
    class="loading-wrapper"
    :class="{ 'loading-wrapper--fixed': fixed }"
  >
    <loading-indicator />
  </div>
</template>

<script>
import LoadingIndicator from './LoadingIndicator'

export default {
  components: {
    LoadingIndicator
  },
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
  background: var(--color, var(--color-editor));
  color: white;
  z-index: 20;

  &--fixed {
    position: fixed;
  }
}

.loading {
  --color: var(--color-editor-accent);
}
</style>
