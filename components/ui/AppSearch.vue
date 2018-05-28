<template>
  <div class="search col">
    <div class="input__wrapper">
      <button class="input__back row">
        <i class="material-icons">arrow_back</i>
      </button>
      <input
        class="input"
        @input="onChange"
        type="search"
        :placeholder="placeholder"
      >
    </div>
    <ul
      v-if="search"
      class="results col"
      :class="{ 'results--loading': isLoading }"
    >
      <li
        class="results__item col"
        @click="$emit('itemclick', result)"
        v-for="result of filtered"
        :key="result[itemKeys[0]] + result[itemKeys[1]]"
      >
        <strong>{{ result[itemKeys[0]] }}</strong>
        <span>{{ result[itemKeys[1]] }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    filter: { type: Function, default: item => item },
    placeholder: { default: 'Search' },
    delay: { type: Number, default: 500 },
    limit: { type: Number, default: 10 },
    url: { type: String, default: 'https://api.cdnjs.com/libraries' },
    param: { type: String, default: 'search' },
    itemKeys: { type: Array, default: () => ['name', 'latest'] },
    arrName: { type: String, default: 'results' },
    extraParams: { type: String, default: 'fields=assets,keywords' }
  },
  data: () => ({
    timeout: null,
    results: [],
    isLoading: false,
    search: ''
  }),
  methods: {
    onChange (event) {
      const val = event.target.value
      this.search = val
      this.results = []

      if (!val) return

      this.isLoading = true

      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      const extra = this.extraParams ? `&${this.extraParams}` : ''

      this.timeout = setTimeout(async () => {
        const { data } = await axios(`${this.url}?${this.param}=${val}${extra}`)
        this.results = data[this.arrName]
        this.isLoading = false
      }, this.delay)
    },
  },
  computed: {
    filtered () {
      return this.results
        .filter(this.filter)
        .slice(0, this.limit)
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  position: relative;
  height: 100%;

}
.input {
  padding: 1rem;
  padding-left: 2.5rem;
  width: 100%;
  appearance: none;
  border: none;
  color: var(--text-light);
  background: var(--editor-bg);
  font-size: 1rem;
  transition: all .2s ease;

  &::placeholder {
    color: var(--text-lighter);
  }

  &__wrapper {
    position: relative;
  }

  &__back {
    position: absolute;
    height: 100%;
    align-items: center;
    color: var(--text-lighter);
  }

  &:focus {
    outline: none;
    box-shadow: 0 2px 0 hsl(var(--blue-hue), 50%, 40%);
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.results {
  background: var(--color-header);
  width: 100%;
  flex: 1;
  z-index: 10;
  word-wrap: break-word;
  overflow-y: auto;

  &--loading {
    &:after {
      content: '';
      color: white;
      border: .125rem solid var(--btn-bg);
      border-radius: 50%;
      border-top-color: transparent;
      border-right-color: transparent;
      width: 2rem; height: 2rem;
      margin: auto;
      animation: rotate .75s linear infinite;
    }
  }

  &__item {
    padding: 1rem;
    font-size: .75rem;
    color: var(--text-light);
    cursor: pointer;

    span { opacity: .5; }

    &:hover {
      background: var(--btn-bg);
      span { opacity: 1; }
    }
  }
}
</style>
