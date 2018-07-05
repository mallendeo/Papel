<template>
  <section class="section">
    <header class="header">
      <a
        href="https://github.com/mallendeo/papel"
        class="header__link"
        target="_blank"
      >
        <span>GitHub</span>
        <github-icon />
      </a>

      <icon-toggle
        @click.native="toggleTheme"
        :on="theme === 'light'"
        :icons="['brightness_2', 'wb_sunny']"
      />
    </header>

    <div class="hero">
      <div class="hero__left col">
        <div class="brand">
          <papel-logo class="logo" />
          <h1 class="brand__name">Papel</h1>
        </div>

        <h2 class="hero__subtitle">A Code Playground on <br>the Blockchain.</h2>

        <action-btn>Start Coding!</action-btn>

        <p v-if="!extInstalled" class="hero__description">
          You'll need the
          <a
            :href="extLink"
            target="_blank"
          >web extension for Nebulas</a> to use the platform.
        </p>

        <p :class="{ show: !hasBalance }" class="hero__description fade">
          <span v-if="extInstalled">You'll need some NAS for creating projects, you can </span>
          <span v-else>You'll also need some NAS. Once you have your wallet, </span>
          <a @click.prevent="claimNas" href="#">claim your free NAS here.</a>
        </p>
      </div>

      <div class="hero__right col">
        <video class="video" loop autoplay muted>
          <source src="/videos/demo.webm" type="video/webm">
          <source src="/videos/demo.mp4" type="video/mp4">
        </video>
      </div>
    </div>

    <h2 class="subtitle">Getting Started</h2>
    <home-stepper class="stepper" />
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { getAccount } from '@/lib/nebulas'

import NebulasLogo from '@/components/icons/NebulasLogo'
import PapelLogo from '@/components/icons/PapelLogo'
import GithubIcon from '@/components/icons/GithubIcon'

import IconToggle from '@/components/ui/IconToggle'
import ActionBtn from '@/components/ui/ActionBtn'

import HomeStepper from '@/components/HomeStepper'

export default {
  layout: 'welcome',
  components: {
    ActionBtn,
    GithubIcon,
    HomeStepper,
    IconToggle,
    NebulasLogo,
    PapelLogo
  },
  head: {
    link: [
      {
        rel: 'chrome-webstore-item',
        href: process.env.extLink
      }
    ]
  },
  data: () => ({
    hasBalance: true,
    extLink: process.env.extLink
  }),
  computed: {
    ...mapState('ui', ['theme']),
    extInstalled: () => window.NasExtWallet
  },
  methods: {
    ...mapActions('ui', ['toggleTheme'])

  },
  async mounted () {
    try {
      const { address } = await getAccount()
      this.hasBalance = address.currentBalance > 10 ** 14
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/scss/variables';

.section {
  font-family: 'Helvetica Neue', sans-serif;
}

.subtitle {
  margin-bottom: 5rem;
  text-align: center;
  color: var(--color-text, white);
  font-weight: 200;
  font-size: 2rem;
}

.header {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;

  > * {
    margin-left: 2rem;
  }

  &__link {
    display: flex;
    align-items: center;
    color: var(--color-text, white);
    font-size: .8rem;
    text-decoration: none;

    svg {
      width: 1rem;
      margin-left: .5rem;
    }
  }
}

.hero {
  min-height: 100vh;
  margin-top: -2.5rem;
  display: flex;
  align-items: center;
  color: var(--color-text);

  &__right {
    flex: 2;
  }

  &__left {
    flex: 1;
  }

  &__description {
    margin-top: 1rem;
    font-size: .8rem;
    width: 70%;
    line-height: 1.4;

    &:first-of-type { margin-top: 2rem; }
    &, a { color: var(--color-text-light, #ffffff80); }
    a { font-weight: bold; }
    a:hover { color: var(--color-accent); }
  }

  &__subtitle {
    font-weight: 300;
    margin-top: 2rem;
    -webkit-font-smoothing: initial;

    font-size: 1.25rem;
    letter-spacing: 2px;
    line-height: 1.5;
  }
}

.logo {
  width: 3.5rem;
}

.brand {
  display: flex;
  align-items: center;
  margin-top: 1.5rem;

  &__name {
    font-family: 'Comfortaa', sans-serif;
    font-size: 2rem;
    padding-left: 1.75rem;
    font-weight: normal;
  }
}

.video {
  width: 100%;
  margin-left: auto;
  border-radius: .25rem;
  box-shadow: 0 1rem 4rem -.5rem rgba(0,0,0,.2);
}

.fade {
  opacity: 0;
  transition: opacity .4s ease;

  &.show {
    opacity: 1;
  }
}
</style>
