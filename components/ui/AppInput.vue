<template>
  <div class="input-wrapper">
    <input
      :type="type"
      :placeholder="placeholder"
      class="input"
      @keyup="e => $emit('keyup', e)"
      @keydown="e => $emit('keydown', e)"
      @keypress="e => $emit('keypress', e)"
      @input="e => $emit('input', e)"
      @change="e => $emit('change', e)"
    >
    <button @click="$emit('btnclick')" v-if="button" class="input-btn">
      {{ button }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    type: { default: 'text' },
    placeholder: { type: String },
    button: { type: String }
  }
}
</script>

<style lang="scss" scoped>
.input-wrapper {
  min-width: 5rem;
  height: 2.5rem;
  background: var(--color-darker);
  display: flex;
}

.input, .input-btn {
  color: var(--color-text, white);
}

.input {
  padding: 1rem;
  background: none;
  border: none;

  &::placeholder {
    color: var(--color-text-light, #eee);
  }
}

.input-btn {

}
</style>
