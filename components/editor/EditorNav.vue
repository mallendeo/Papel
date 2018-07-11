<template>
  <nav
    class="nav"
    :class="ui.layout === 'col'
      ? 'col nav--col'
      : 'row'
    "
  >
    <nuxt-link to="/">
      <h1 class="brand row row--center">
        <papel-logo class="brand__logo" />
        <span>Papel</span>
      </h1>
    </nuxt-link>

    <!-- Nav -->
    <template v-for="tab of ui.tabs">
      <button
        :key="`nav-${tab.component}`"
        :title="tab.title"
        class="btn btn--fade"
        :class="{ 'btn--active': ui.currTab === tab }"
        @click="tab.onclick ? tab.onclick(tab) : navTo(tab)"
      >
        <i
          v-if="tab.icon"
          class="material-icons"
        >{{ tab.icon }}</i>

        <component
          v-else-if="tab.iconComponent"
          :is="tab.iconComponent"
          :class="tab.classes"
        />
      </button>
      <div
        :key="`spacer-${tab.component}`"
        v-if="tab.space"
        class="split"
      />
    </template>
    <!-- /Nav -->

    <!-- Actions -->
    <button
      title="Zen Mode"
      @click="zenMode = !zenMode"
      class="btn btn-ninja"
      :class="{ 'btn--active': zenMode }"
    >
      <ninja-icon class="icon--small" />
    </button>

    <button
      title="More"
      class="btn"
    >
      <i class="material-icons">more_horiz</i>
    </button>
  </nav>
</template>

<script>
import PapelLogo from '../icons/PapelLogo'
import NebulasLogo from '../icons/NebulasLogo'
import UploadIcon from '../icons/UploadIcon'
import NinjaIcon from '../icons/NinjaIcon'

import { mapActions, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  components: {
    PapelLogo,
    NebulasLogo,
    UploadIcon,
    NinjaIcon
  },
  computed: {
    ...mapState('editor', ['ui']),
    ...mapFields('ui', ['zenMode'])
  },
  methods: {
    ...mapActions('editor', ['navTo'])
  }
}
</script>

<style lang="scss" scoped>
.icon--small {
  height: .75rem;
}

.brand {
  font-family: 'Comfortaa', sans-serif;
  font-size: .8rem;
  margin-left: 1rem;
  margin-right: 2rem;
  font-weight: 400;
  color: var(--logo-text);

  &__logo {
    margin-right: .5rem;
    width: 1.25rem;
  }
}

.nav {
  flex: 0 0 3rem;
  background: var(--editor-color-dark);
  color: var(--text-light);
  align-items: center;

  &--col {
    width: 3rem;
    .brand {
      margin-left: auto;
      margin-right: auto;
      svg { margin: .75rem auto .5rem auto; }
      span { display: none; }
    }

    .btn {
      height: 2.5rem;
      width: 100%;
      margin: .5rem 0;
      span { display: none; }
      &:last-of-type { order: 0 }
    }
  }
}

.btn {
  &:nth-of-type(5) { margin-left: auto }
  .material-icons { font-size: .9rem }
  span { padding-left: .5rem }
}

// FIXME:
.btn-ninja.btn--active {
  color: #333;
  background: var(--warning-color);
  box-shadow: none;
}

.split {
  margin-top: auto;
}
</style>
