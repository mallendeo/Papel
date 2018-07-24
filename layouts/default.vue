<template>
  <section>
    <div class="header">
      <a href="/" class="logo-wrapper">
        <papel-logo class="logo" />
        <h1>Papel</h1>
      </a>

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
            <component
              v-if="list.icon"
              class="tab-icon"
              :is="list.icon"
            />
            {{ list.label }}
          </a>
        </nuxt-link>
      </ul>

      <icon-toggle
        @click.native="toggleTheme"
        :on="theme === 'light'"
        :icons="['brightness_2', 'wb_sunny']"
      />

      <nav-btn
        :shadow="true"
        v-if="loaded && !loggedUser"
        :to="`/getting-started#steps`"
      >
        Create User
      </nav-btn>

      <template v-if="loggedUser">
        <nav-btn :shadow="true" :href="`/${loggedUser.username}/${slug()}`">
          Create Project
        </nav-btn>

        <a :href="`/${loggedUser.username}/`" class="profile-btn">
          <app-avatar :hash="loggedUser.avatar" />
        </a>
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

import AppAvatar from '@/components/ui/AppAvatar'
import PapelLogo from '@/components/icons/PapelLogo'
import NavBtn from '@/components/ui/NavBtn'
import IconToggle from '@/components/ui/IconToggle'

import ConfettiIcon from '@/components/icons/ConfettiIcon'
import OkIcon from '@/components/icons/OkIcon'

export default {
  components: {
    AppAvatar,
    PapelLogo,
    NavBtn,
    IconToggle,
    ConfettiIcon,
    OkIcon
  },

  data: () => ({
    ipfsUrl: IPFS_URL,
    loaded: false,
    lists: [
      { id: 'picks', label: 'Picks', icon: 'ok-icon', href: '/picks' },
      // { id: 'popular', label: 'Popular', icon: 'flame-icon', href: '/popular' },
      { id: 'public', label: 'New', icon: 'confetti-icon', href: '/public' }
    ]
  }),

  async mounted () {
    await this.getLoggedUser().catch(console.error)
    this.loaded = true
  },

  methods: {
    ...mapActions('homepage', ['getLoggedUser']),
    ...mapActions('ui', ['toggleTheme']),
    slug: () => shortid.generate()
  },

  computed: {
    ...mapState('ui', ['theme', 'themeTransition']),
    ...mapState('homepage', ['loggedUser'])
  },

  head () {
    return {
      htmlAttrs: {
        'data-theme': this.theme,
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
  display: flex;
  align-items: center;
  background: var(--color-contrast);
}

.avatar {
  --size: 2rem;
  margin-left: 2rem;
}

.logo {
  width: 1.8rem;

  &-wrapper {
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  + h1 {
    margin-left: .75rem;
    font-family: 'Raleway', sans-serif;
    font-size: 1.25rem;
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

.toggle {
  margin-right: 2rem;
}
</style>
