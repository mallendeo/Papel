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

        <div class="p-wrapper">
          <p v-if="!extInstalled" class="hero__description">
            You'll need the
            <a @click.prevent="scrollTo('#steps')" href="#steps">web extension for Nebulas</a> to use the platform.
          </p>

          <p class="hero__description" v-if="extInstalled && !hasBalance && addr">
            You'll need some NAS for creating projects.
            <a @click.prevent="claimNas" href="#">Claim your free NAS here.</a>
          </p>

          <p class="hero__description" v-if="extInstalled && !addr">
            Create a wallet using the Nebulas extension to use the platform.
          </p>
        </div>
      </div>

      <div class="hero__right col">
        <video class="video" loop autoplay muted>
          <source src="/videos/demo.webm" type="video/webm">
          <source src="/videos/demo.mp4" type="video/mp4">
        </video>
      </div>
    </div>

    <!--template v-if="!extInstalled"-->
    <template>
      <h2 id="steps" class="subtitle">Getting Started</h2>
      <home-stepper class="stepper" />
    </template>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { getAccount, getAddress } from '@/lib/nebulas'

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
    addr: null,
    extLink: process.env.extLink
  }),
  computed: {
    ...mapState('ui', ['theme']),
    extInstalled: () => window.NasExtWallet
  },
  methods: {
    ...mapActions('ui', ['toggleTheme']),
    scrollTo (selector) {
      document.querySelector(selector).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })

      this.$router.push('getting-started#steps')
    }
  },
  async mounted () {
    try {
      this.addr = await getAddress()

      const { address } = await getAccount()
      this.hasBalance = address.currentBalance >= 10 ** 12
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/scss/themes';

.action-btn {
  font-size: 1rem;
}

.p-wrapper {
  min-height: 5rem;
}

.subtitle {
  padding: 5rem 0;
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
    font-size: 1rem;
    width: 90%;
    line-height: 1.4;
    animation: fade-in .8s .4s ease both;

    &:first-of-type { margin-top: 2rem; }
    &, a { color: var(--color-text-light, #ffffff80); }
    a { font-weight: bold; }
    a:hover { color: var(--color-accent); }
  }

  &__subtitle {
    font-weight: 300;
    margin-top: 2rem;
    -webkit-font-smoothing: initial;

    font-size: 1.65rem;
    letter-spacing: 1px;
    line-height: 1.5;
  }
}

.logo {
  width: 3.5rem;
}

.brand {
  display: flex;
  align-items: center;
  margin-top: .5rem;

  &__name {
    font-family: 'Raleway', sans-serif;
    font-size: 2.4rem;
    padding-left: 1.75rem;
    font-weight: normal;
  }
}

.video {
  width: 125%;
  margin-left: 5.5rem;
  margin-top: 2.5rem;
  border-radius: .25rem;
  box-shadow: 0 1rem 4rem -.5rem rgba(0,0,0,.2);
}
</style>
