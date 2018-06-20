<template>
  <div class="dropdown-wrapper">
    <button
      v-click-outside="onClickOutside"
      @click="toggle"
      class="dropdown__btn"
    >
      <i v-if="icon" class="material-icons">{{ icon }}</i>
      <span>{{ title }}</span>
      <i class="material-icons">arrow_drop_down</i>
    </button>

    <div
      class="dropdown"
      ref="dropdown"
      :class="{ 'dropdown--open': isOpen }"
      :style="{
        left: `${pos.x}px`,
        top: `${pos.y}px`
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script>
/**
 * @example
 * <app-dropdown title="test">
 *   <!-- content -->
 * </app-dropdown>
 */
export default {
  props: {
    title: { type: String },
    icon: { type: String },
    open: { type: Boolean, default: false }
  },
  data: () => ({
    isOpen: this.open,
    pos: { x: 0, y: 0 }
  }),
  methods: {
    toggle (event) {
      const closest = event.target.closest('.dropdown-wrapper')
      const { width: ddw } = this.$refs['dropdown'].getBoundingClientRect()
      const { x, y, height, width } = closest.getBoundingClientRect()
      this.pos = { x: x - ddw + width, y: y + height }
      this.isOpen = !this.isOpen
    },
    onClickOutside (event) {
      const closest = event.target.closest('.dropdown-wrapper')
      if (closest) return

      if (this.isOpen) this.isOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-wrapper {
  height: 100%;
}

.dropdown {
  min-height: 10rem;
  width: 18rem;
  cursor: default;
  border-radius: .25rem;

  &__btn {
    width: 100%; height: 100%;
    position: relative;
    outline: none;
    padding: 0 .5rem;
    color: white;
    display: flex;
    align-items: center;
    cursor: pointer;

    .material-icons {
      color: hsl(var(--editor-hue), 10%, 50%);
      margin-left: auto;
      font-size: .9rem;
    }

    &:hover {
      background: rgba(0,0,0,.1);
    }
  }
}

.dropdown {
  position: fixed;
  top: 0; left: 0;
  display: flex;
  flex-direction: column;
  background: var(--editor-color-dark);
  color: white;
  z-index: 10;

  pointer-events: none;
  opacity: 0;
  transition: opacity .2s ease, transform .2s ease;
  transform: translateY(-.5rem);

  &--open {
    opacity: 1;
    transform: translateY(0rem);
    pointer-events: all;
  }
}
</style>
