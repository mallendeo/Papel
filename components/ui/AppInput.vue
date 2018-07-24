<template>
  <div class="input-wrapper">
    <div
      :class="{
        shake,
        error: showErrorMsg,
        'input-group--textarea': textarea
      }"
      @animationend="shake = false"
      class="input-group"
    >
      <input
        v-if="!textarea"
        :type="type"
        :placeholder="placeholder"
        :value="value"
        :disabled="disabled"
        :pattern="pattern"
        class="input"
        @input="onInput"
      >
      <textarea
        v-else
        :placeholder="placeholder"
        :value="value"
        :disabled="disabled"
        :pattern="pattern"
        class="input textarea"
        @input="onInput"
      ></textarea>

      <label v-if="floatPlaceholder">{{ placeholder }}</label>

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
    pattern: {},
    textarea: { type: Boolean, default: false },
    disabled: { type: Boolean },
    floatPlaceholder: { type: Boolean, default: false },
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
    },

    onInput (event) {
      this.$emit('input', event.target.value)
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

.input:placeholder-shown + label {
  opacity: 0;
  transform: translateY(1rem);
}

label {
  position: absolute;
  top: 0;
  font-size: .8rem;
  opacity: 1;
  z-index: -1;
  color: var(--color-text);
  transform: translateY(0);
  transition: all .2s ease;
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

.input-group--textarea,
.textarea {
  height: auto;
  min-height: 2.5rem;
  max-height: 15rem;
}

.input-wrapper {
  padding-top: 1.5rem;
  min-width: 5rem;
  position: relative;
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
  flex: 1;
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
