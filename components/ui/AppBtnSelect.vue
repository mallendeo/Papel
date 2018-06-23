<template>
  <button :disabled="disabled" class="btn-select">
    <span v-if="label" class="label">{{ label }}</span>
    <div v-if="value" class="select-like" :class="{ caret }">
      <strong class="value">{{ value }}</strong>
    </div>
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    label: { type: String },
    value: { type: String },
    caret: { type: Boolean, default: true },
    disabled: { type: Boolean }
  }
}
</script>

<style lang="scss" scoped>
.btn-select {
  display: flex;
  align-items: center;
  border: 1px solid var(--editor-color-dark);
  background: var(--editor-color-dark);
  position: relative;
  cursor: default;
  outline: none;
  padding: 0;

  transition: all .1s ease;

  &, * { outline: none; }

  &:disabled {
    cursor: not-allowed;
    opacity: .4;
    * { pointer-events: none; }
  }

  input {
    height: 100%;
    background: none;
    color: var(--text-light);
    border: none;
  }

  select {
    padding: .9rem;
  }

  select, .select-like {
    display: flex;
    align-items: center;
    height: 100%;

    font-weight: bold;
    text-align: center;
    height: 100%;
    border-radius: 0;
    background: var(--editor-color);
    color: var(--text-light);
    border: none;
    border-left: 1px solid var(--editor-color-dark);
    margin: 0;
    transition: all .1s ease;

    -webkit-appearance: none;
    cursor: pointer;

    --text-color: var(--text-contrast, white);

    &:hover, &:focus {
      background: var(--editor-color-accent);
      &, * { color: var(--text-color); }
    }
  }
}

.label {
  color: var(--text-lighter);
  margin: auto;
  margin-left: 1rem;
  padding: .9rem 0;
}

.value {
  margin-left: auto;
  padding: .9rem 1rem;
  margin-right: 1rem;
  color: var(--text-light);
  position: relative;
}

.caret {
  &:after {
    $size: .25rem;

    content: '';
    display: block;
    position: relative;
    top: $size / 2;

    width: 0; height: 0;
    margin-right: 1rem;

    border: $size solid transparent;
    border-top-color: var(--text-color);
    opacity: .5;
  }
}
</style>
