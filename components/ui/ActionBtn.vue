<template>
  <button class="action-btn" :class="{ 'action-btn--loading': loading }">
    <loading-indicator v-if="showLoading"/>
    <slot />
  </button>
</template>

<script>
import LoadingIndicator from './LoadingIndicator.vue'

export default {
  components: {
    LoadingIndicator
  },
  props: {
    loading: { type: Boolean, default: false },
    showLoading: { type: Boolean, default: false }
  }
}
</script>

<style lang="scss" scoped>
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  padding: .75rem 1.5rem;
  margin-top: 2rem;

  background: var(--color-accent);
  color: white;
  font-weight: bold;
  font-size: .8rem;
  border-radius: .25rem;

  outline: none;

  &--loading {
    div.loading {
      margin-right: 1rem;
      opacity: 1;
    }
  }

  > *:first-child:not(.loading) {
    margin-right: 1rem;
  }
}

div.loading {
  margin-right: -1rem;
  width: 1rem; height: 1rem;
  opacity: 0;
  transition: all .2s ease;
  --color: white;
}
</style>
