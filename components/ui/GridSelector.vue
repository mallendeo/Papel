<template>
  <div class="grid">
    <div class="grid__item"></div>
    <div class="grid__item"></div>
    <div class="grid__item"></div>
    <div class="grid__item"></div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  width: 8rem;
  height: 8rem;
  position: absolute;
  left: 3rem; bottom: 3rem;

  background: var(--editor-color-dark);
  border-radius: .25rem;
  overflow: hidden;
  margin: 2px;

  &__item {
    &:hover {
      border: 1px solid var(--editor-color-accent);
  border-radius: .25rem;
    }
  }
}
</style>
