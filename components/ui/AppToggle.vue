<template>
  <input
    class="form-toggle row"
    type="checkbox"
    :checked="checked"
  >
</template>

<script>
export default {
  props: {
    checked: { type: Boolean, default: false }
  }
}
</script>

<style lang="scss" scoped>
/*
 * Available variables:
 *  --badge-color: #fbc531;
 *  --badge-text-color: #2F3640;
 *  --color: #00a8ff;
 *  --color-disabled: #7f8fa6;
 *  --color-focus: #9c88ff;
 *  --color-thumb-checked: white;
 *  --width: 4rem;
 *
 * @example
 *   <input
 *     class="form-toggle" type="checkbox"
 *     data-badge="PRO" style="--width: 3rem;"
 *   >
 **/
.form-toggle {
  --c-color: var(--color, hsl(200, 100%, 50%));
  --c-color-focus: var(--color-focus, hsl(200, 100%, 70%));

  --w: var(--width, 2.5em);
  --p: calc(var(--w) / 20);
  --s: calc(var(--w) * .4);

  width: var(--w);
  position: relative;
  padding: 0 var(--p);
  align-items: center;

  appearance: none;
  border-radius: calc(var(--w) / 2);
  border: 1px solid var(--c-color);
  cursor: pointer;

  outline: none;

  &:disabled, &:disabled:after {
    border-color: var(--color-disabled, #7f8fa6);
  }

  &:checked:before { opacity: 0; }

  &, &:after, &:before {
    transition: all .2s ease;
  }

  &:after {
    content: '';
    border: inherit;
    border-color: var(--c-color);
    border-radius: inherit;
    width: var(--s); height: var(--s);
    will-change: transform;

    transform: translateX(0rem);
  }

  &:checked { background-color: var(--c-color); }
  &:checked:after {
    border: none;
    transform: translateX(calc(var(--w) - var(--s) - var(--p) * 2 - 1.5px));
    background-color: var(--color-thumb-checked, white);
  }

  &:focus {
    border-color: var(--c-color-focus);
    box-shadow: 0 0 2rem -.5rem var(--c-color-focus);
    &:after {
      border-color: var(--c-color-focus);
    }
  }
  &:focus:checked {
    background: var(--c-color-focus);
  }
}
</style>
