<template>
  <div
    class="toolbar row"
    :class="{
      'toolbar--danger': danger,
      'toolbar--mini': mini
    }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    danger: { type: Boolean },
    mini: { type: Boolean }
  }
}
</script>

<style lang="scss" scoped>
$toolbar-size: 2rem;

.toolbar {
  justify-content: space-between;
  align-items: center;
  flex: 0 0 $toolbar-size;

  position: relative;

  //background: var(--editor-color-dark);
  background: var(--editor-color);

  transition: all .2s ease;
  color: var(--text-lighter);

  font-size: .75rem;

  &:not(:first-of-type) {
    cursor: row-resize;
    border-top: 1px solid var(--editor-color-dark);
  }

  &--danger {
    box-shadow: inset .125rem 0 0 var(--error-color);
  }

  &--mini {
    flex-basis: .25rem;
    > * {
      transition: all .1s ease;
      pointer-events: none;
      opacity: 0
    }
  }
}
</style>
