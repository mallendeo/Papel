<template>
  <section>
    <div class="header">
      <div class="logo-wrapper">
        <papel-logo class="logo" />
        <h1>Papel</h1>
      </div>

      <ul class="tabs">
        <nuxt-link
          v-for="list of lists"
          :key="`list-${list.id}`"
          class="tabs__item"
          tag="li"
          @click="currList = list"
          active-class="active"
          :to="list.href"
        >
          <a>
            <img
              v-if="list.icon"
              :src="require(`~/assets/icons/${list.icon}`)"
              class="tab-icon"
            >
            {{ list.label }}
          </a>
        </nuxt-link>
      </ul>

      <template v-if="loggedUser">
        <nav-btn class="header-btn" :to="`/u/${loggedUser.username}/${slug()}`">
          <i class="material-icons">add</i>
          New project
        </nav-btn>

        <nuxt-link :to="`/u/${loggedUser.username}/`" class="profile-btn">
          <img
            class="avatar"
            :src="loggedUser.avatar
              ? `${ipfsUrl}/${loggedUser.avatar}`
              : require('~/assets/icons/user.svg')"
          >
        </nuxt-link>
      </template>
    </div>

    <!-- Content -->
    <nuxt/>

    <div class="footer">

    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import shortid from 'shortid'

import { IPFS_URL } from '@/lib/ipfs'

import PapelLogo from '@/components/icons/PapelLogo'
import NavBtn from '@/components/ui/NavBtn'

export default {
  components: {
    PapelLogo,
    NavBtn
  },

  data: () => ({
    ipfsUrl: IPFS_URL,
    lists: [
      { id: 'picks', label: 'Picks', icon: 'ok.svg', href: '/picks' },
      { id: 'popular', label: 'Popular', icon: 'flame.svg', href: '/popular' },
      { id: 'public', label: 'New', icon: 'confetti.svg', href: '/public' }
    ]
  }),

  mounted () {
    this.getLoggedUser().catch(console.error)
  },

  methods: {
    ...mapActions('homepage', ['getLoggedUser']),
    slug: () => shortid.generate()
  },

  computed: {
    ...mapState('ui', ['themeTransition']),
    ...mapState('homepage', ['loggedUser'])
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
  margin-bottom: 3rem;
  height: 4rem;
  display: flex;
  align-items: center;
}

.avatar {
  width: 2rem;
  height: 2rem;
  margin-left: 2rem;
}

.logo {
  width: 1.5rem;

  &-wrapper {
    display: flex;
    align-items: center;
  }

  + h1 {
    margin-left: .75rem;
    font-family: 'Comfortaa', sans-serif;
    font-size: 1rem;
    color: var(--color-text);
    font-weight: 400;
  }
}

.tabs {
  display: flex;
  font-size: 1rem;
  margin-left: 4rem;
  margin-right: auto;

  &__item {
    margin-right: 1rem;
    text-transform: capitalize;

    a {
      text-decoration: none;
      color: var(--color-text-light);
      padding: 0 .25rem;
      padding-bottom: .5rem;
    }
  }
}

.tab-icon {
  width: .75rem;
  margin-right: .25rem;
}

.active a {
  font-weight: bold;
  color: var(--color-text);
}

.header-btn {
  font-weight: bold;
  [class*=icon] {
    font-size: 1rem;
    margin-right: .5rem;
  }
}
</style>
