<template>
  <div class="select-wrapper">
    <button
      v-click-outside="onClickOutside"
      @click="toggle"
      class="select"
    >
      <span>{{ currTitle || title }}</span>
      <i class="material-icons">arrow_drop_down</i>
    </button>

    <ul
      class="list"
      :class="{ 'list--open': isOpen }"
      :style="{
        left: `${pos.x}px`,
        top: `${pos.y}px`
      }"
    >
      <li
        @click="setValue(opt.value)"
        :key="`select-opt-${opt.value}`"
        class="list__item"
        :class="{ 'list__item--active': opt.value === value }"
        v-for="opt of options"
      >
        <img class="list__icon" v-if="opt.icon" :src="opt.icon">
        {{ opt.title }}
      </li>
    </ul>
  </div>
</template>

<script>
/**
 * @example
 * <app-select
 *  :options="[{ title: 'Test', value: 'test' }]"
 *  value="test"
 * />
 */
export default {
  props: {
    options: { type: Array, default: () => [] },
    currTitle: { type: String },
    open: { type: Boolean, default: false },
    value: ''
  },
  data: () => ({
    isOpen: this.open,
    pos: { x: 0, y: 0 }
  }),
  methods: {
    setValue (val) {
      this.$emit('change', val)
      this.isOpen = !this.isOpen
    },
    toggle (event) {
      const { x, y, height } = event.target.getBoundingClientRect()
      this.pos = { x, y: y + height }
      this.isOpen = !this.isOpen
    },
    onClickOutside (event) {
      if (this.isOpen) this.isOpen = false
    }
  },
  computed: {
    title () {
      return this.options
        .find(opt => opt.value === this.value)
        .title
    }
  }
}
</script>

<style lang="scss" scoped>
.select-wrapper, .select {
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
}

.select {
  width: 100%;
  position: relative;
  outline: none;
  padding: 0 .5rem 0 1rem;

  &:hover {
    background: rgba(0,0,0,.1);
  }

  * { pointer-events: none }

  span {
    color: white;
    padding-left: none;
  }

  .material-icons {
    color: hsl(var(--editor-hue), 10%, 30%);
    margin-left: auto;
  }
}

.list {
  position: fixed;
  top: 0; left: 0;
  display: flex;
  flex-direction: column;
  min-width: 8rem;
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

  &__icon {
    width: 1rem;
    max-height: 1rem;
    margin-right: .5rem;
  }

  &__item {
    $r: .25rem;
    padding: .5rem 1rem;
    border-left: .125rem solid transparent;
    transition: all .1s ease;
    display: flex;

    &:hover { background: var(--editor-color) }
    &--active { border-left-color: var(--editor-color-accent) }
  }
}
</style>
