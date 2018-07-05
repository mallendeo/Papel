<template>
  <button class="action-btn">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  padding: .75rem 1.5rem;
  align-self: flex-start;
  margin-top: 2rem;

  background: var(--color-accent);
  color: white;
  font-weight: bold;
  font-size: .8rem;
  border-radius: .25rem;

  > *:first-child {
    margin-right: 1rem;
  }
}
</style>
