<template>
  <button v-on="$listeners" class="btn row row--ai-center nav-btn">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.nav-btn {
  padding: 0 1rem;
  height: 3rem;
  border-radius: .25rem;
  background: var(--color);
  color: var(--color-light);

  &:hover {
    background: var(--color-accent);
  }

  &:disabled {
    pointer-events: none;
    opacity: .25;
  }
}
</style>
