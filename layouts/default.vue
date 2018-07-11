<template>
  <section>
    <div class="header">
      <div class="logo-wrapper">
        <papel-logo class="logo" />
        <h1>Papel</h1>
      </div>

      <ul class="tabs">
        <nuxt-link
          v-for="(list, index) of ['picks', 'popular', 'public']"
          :key="`list-${list}`"
          class="tabs__item"
          tag="li"
          exact
          exact-active-class="active"
          :to="`/${index ? list : ''}`"
        >
          <a>{{ list }}</a>
        </nuxt-link>
      </ul>

      <nav-btn>
        <i class="material-icons">add</i>
        New project
      </nav-btn>
    </div>

    <!-- Content -->
    <nuxt/>

    <div class="footer">

    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'

import PapelLogo from '@/components/icons/PapelLogo'
import NavBtn from '@/components/ui/NavBtn'

export default {
  components: {
    PapelLogo,
    NavBtn
  },

  computed: {
    ...mapState('ui', ['themeTransition'])
  },

  head () {
    return {
      htmlAttrs: {
        'data-theme': this.currTheme,
        class: this.themeTransition ? 'theme-transition' : ''
      }
    }
  }
}
</script>

<style lang="scss">
@import 'assets/scss/base';
@import 'assets/scss/themes';
@import 'assets/scss/default';
</style>

<style lang="scss" scoped>
.header {
  padding: .8rem 2rem;
  height: 4rem;
  background: var(--color-darker);
  display: flex;
  align-items: center;
}

.logo {
  width: 2rem;

  &-wrapper {
    display: flex;
    align-items: center;
  }

  + h1 {
    margin-left: .75rem;
    font-family: 'Comfortaa', sans-serif;
    font-size: 1.25rem;
    color: var(--color-text);
    font-weight: 400;
  }
}

.tabs {
  display: flex;
  font-size: 1rem;
  margin-left: 2rem;

  &__item {
    margin-right: 1rem;
    text-transform: capitalize;

    a {
      text-decoration: none;
      color: var(--color-text-light);
    }
  }
}

.active a {
  font-weight: bold;
  color: var(--color-text);
}

button.nav-btn {
  width: auto;
  margin-left: auto;
  height: 2.5rem;
  font-weight: bold;

  [class*=icon] {
    margin-right: .5rem;
  }
}
</style>
