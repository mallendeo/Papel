<template>
  <div @click="toggle" class="select">
    <span>{{ currTitle || title }}</span>

    <i class="material-icons">arrow_drop_down</i>

    <ul
      class="list"
      :class="{ 'list--open': isOpen }"
    >
      <li
        @click="setValue(opt.value)"
        :key="`select-opt-${opt.value}`"
        class="list__item"
        :class="{ 'list__item--active': opt.value === value }"
        v-for="opt of options"
      >{{ opt.title }}</li>
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
  data: () => ({ isOpen: this.open }),
  methods: {
    setValue (val) {
      this.$emit('change', val)
    },
    toggle () {
      this.isOpen = !this.isOpen
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
.select {
  min-width: 5rem;
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;

  span {
    display: block;
    padding: 0 1rem;
    color: white;
  }
}

.list {
  position: absolute;
  top: 100%;
  width: 100%;
  background: var(--editor-color-dark);
  color: white;
  display: none;

  &--open {
    display: flex;
    flex-direction: column;
  }

  &__item {
    padding: .5rem 1rem;

    &:hover {
      background: var(--editor-color-accent);
    }

    &--active {
      background: rgba(255,255,255,.2);
    }
  }
}
</style>
