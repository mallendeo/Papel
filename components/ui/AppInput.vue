<template>
  <div class="input-wrapper">
    <div
      :class="{ shake, error: showErrorMsg }"
      @animationend="shake = false"
      class="input-group"
    >
      <input
        :type="type"
        :placeholder="placeholder"
        class="input"
        :value="value"
        :disabled="disabled"
        @input="event => $emit('input', event.target.value)"
      >
      <button
        @click="$emit('btnclick')"
        v-if="button"
        class="input-btn"
        :disabled="disabled"
      >
        {{ button }}
      </button>
    </div>

    <transition name="slide">
      <small v-if="showErrorMsg && error" class="error-msg">
        {{ error }}
      </small>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    type: { default: 'text' },
    value: {},
    disabled: { type: Boolean },
    placeholder: { type: String },
    button: { type: String },
    errorMsg: { type: String },
    msgDuration: { type: Number, default: 4000 }
  },

  data: () => ({
    error: null,
    shake: false,
    showErrorMsg: false
  }),

  methods: {
    showError (msg, shake = true) {
      this.error = msg || this.errorMsg
      this.showErrorMsg = true
      this.shake = shake

      setTimeout(() => (this.showErrorMsg = false), this.msgDuration)
    }
  }
}
</script>

<style lang="scss" scoped>
.slide-enter-active, .slide-leave-active {
  transition: opacity .2s, transform .2s;
}

.slide-enter, .slide-leave-to {
  opacity: 0;
  transform: translateY(-.5rem);
}

.error-msg {
  margin-top: .5rem;
  margin-left: .4rem;
  display: block;
  font-size: .8rem;
  color: var(--color-error);
}

.input-group {
  width: 100%;
  height: 2.5rem;
  background: var(--color-darker);
  display: flex;
  border-radius: .4rem;
}

.input-wrapper {
  min-width: 5rem;
}

.shake {
  will-change: transform;
  --shake-amount: .4rem;
  animation: shake .5s linear both;
}

[data-theme=light] {
  .input-group {
    background: var(--color-bg);
    border: 1px solid var(--color-accent);
    &.error {
      border-color: var(--color-error);
    }
  }

  .input, .input-btn {
    &:focus { background: var(--color-lighter); }
  }

  .input-btn:hover { background: var(--color-lighter); }
}

.input, .input-btn {
  color: var(--color-text, white);
  outline: none;

  &:focus { background: var(--color-darkest); }
}

.input {
  padding: 1rem;
  background: none;
  border: none;
  border-radius: .4rem 0 0 .4rem;

  &::placeholder {
    color: var(--color-text-lighter);
  }
}

.input-btn {
  padding: 0 1rem;
  border-radius: 0 .4rem .4rem 0;
  transition: all .1s ease;
  font-weight: bold;

  &:hover {
    background: var(--color-accent);
  }

  &:disabled {
    background: transparent;
    cursor: not-allowed;
  }
}
</style>
