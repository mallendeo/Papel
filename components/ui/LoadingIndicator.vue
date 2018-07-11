<template>
  <div class="loading"></div>
</template>

<style lang="scss" scoped>
.loading {
  --s: var(--size, 2rem);
  border: .125rem solid var(--color, white);
  border-radius: 50%;
  border-top-color: transparent;
  border-right-color: transparent;
  width: var(--s); height: var(--s);
  margin: auto;
  transform-origin: 50% 50%;
  animation: spin var(--dur, .75s) linear infinite;
}
</style>
