<template>
  <div class="search col">
    <div class="input__wrapper row">
      <button @click="$emit('backclick')" class="input__back row">
        <i class="material-icons">arrow_back</i>
      </button>
      <input
        class="input"
        @input="onChange"
        type="search"
        :placeholder="placeholder"
      >
    </div>

    <v-draggable
      element="ul"
      v-if="!search"
      class="results col"
      v-model="picked"
      :options="{ handle: '.handle' }"
    >
      <transition-group>
        <li
          class="results__item row"
          v-for="result of picked"
          :key="`pick-${result}`"
        >
          <strong>{{ result }}</strong>

          <button @click="toggleLibrary(result)">
            <i class="material-icons">delete</i>
          </button>

          <i class="material-icons handle">drag_handle</i>
        </li>
      </transition-group>
    </v-draggable>

    <ul
      v-if="search"
      class="results col"
      :class="{ 'results--loading': isLoading }"
    >
      <li
        class="results__item col"
        :class="{
          'results__item--active': picked.indexOf(result.latest) > -1
        }"
        v-for="result of filtered"
        @click="toggleLibrary(result.latest)"
        :key="result.latest"
      >
        <strong>{{ result.name }}</strong>
        <span>{{ result.latest }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
import draggable from 'vuedraggable'

export default {
  components: {
    'v-draggable': draggable
  },
  props: {
    filter: { type: Function, default: item => item },
    placeholder: { default: 'Search' },
    delay: { type: Number, default: 500 },
    limit: { type: Number, default: 10 },
    url: { type: String, default: 'https://api.cdnjs.com/libraries' },
    param: { type: String, default: 'search' },
    arrName: { type: String, default: 'results' },
    extraParams: { type: String, default: 'fields=assets,keywords' }
  },
  data: () => ({
    timeout: null,
    results: [],
    picked: [],
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

    toggleLibrary (url) {
      const index = this.picked.indexOf(url)

      if (index > -1) {
        this.picked.splice(index, 1)
        return
      }

      this.picked.push(url)
    }
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
  padding-left: .5rem;
  width: 100%;
  background: none;
  appearance: none;
  border: none;
  color: var(--text-light);
  font-size: 1rem;
  transition: all .2s ease;

  &::placeholder {
    color: var(--text-lighter);
  }

  &__wrapper {
    background: var(--editor-color);
    position: relative;
    align-items: center;
    padding-left: .5rem;
  }

  &__back {
    height: 100%;
    align-items: center;
    color: var(--text-lighter);
    i { font-size: 1.25rem; }
  }

  &:focus { outline: none; }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.results {
  width: 100%;
  flex: 1;
  z-index: 10;
  word-wrap: break-word;
  overflow-y: auto;

  &--loading {
    &:after {
      content: '';
      color: white;
      border: .125rem solid var(--editor-color-accent);
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
    position: relative;
    cursor: pointer;

    span { opacity: .5; }

    &:hover {
      background: var(--editor-color);
      span { opacity: 1; }
    }

    &--active:after {
      content: '';
      display: block;
      position: absolute;
      top: 0; bottom: 0;
      width: .5rem; height: .5rem;
      right: 2rem;
      margin: auto;
      border-radius: 50%;
      background: var(--editor-color-accent);
    }
  }
}
</style>
