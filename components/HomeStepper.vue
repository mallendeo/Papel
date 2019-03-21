<template>
  <div class="stepper">
    <ul class="steps-num">
      <li class="num active">1</li>
      <li
        class="line"
        :class="{ active: step > 1 }"
      ></li>
      <li
        class="num"
        :class="{ active: step > 1 }"
      >2</li>
      <li
        class="line"
        :class="{ active: step > 2 }"
      ></li>
      <li
        class="num"
        :class="{ active: step > 2 }"
      >3</li>
    </ul>

    <div class="steps">
      <div
        class="transition step"
        :class="{ current: step === 1 }"
      >
        <nebulas-logo class="icon" />
        <span class="description">Install the Nebulas wallet extension.</span>
        <action-btn
          v-if="step === 1"
          @click.native="install"
        >
          <img
            src="~/assets/icons/chrome.svg"
            alt="Google Chrome"
          >
          Install
        </action-btn>
      </div>

      <div
        class="transition step"
        :class="{ current: step === 2 }"
      >
        <wallet-icon class="icon" />
        <span class="description">Create a wallet.</span>
        <small
          :class="{ hide: step !== 2 }"
          class="transition hint"
        >
          <loading-indicator
            class="transition"
            :class="{ hide: !nasTransfer }"
            :style="{ '--size': '1.25rem' }"
          />

          <transition
            mode="out-in"
            name="fade"
          >
            <span v-if="!addr">Create your wallet with the Nebulas extension on the upper-right corner.</span>
            <span v-if="addr && nasTransfer">
              We are now transferring you some tokens.
              It shouldn't take more than 20 seconds.
            </span>
          </transition>
        </small>
      </div>

      <div
        class="transition step"
        :class="{ current: step === 3 }"
      >
        <user-icon class="icon" />

        <transition
          name="fade"
          mode="out-in"
        >
          <span
            :key="user && user.username"
            class="description"
          >
            {{ user ? `Hi ${user.username}!` : 'Choose a username.' }}
          </span>
        </transition>

        <action-btn
          class="home-btn"
          v-if="user"
          @click.native="$router.push('/')"
        >
          Go to the app
        </action-btn>

        <transition name="fade">
          <div v-if="showInput">
            <app-input
              v-model="username"
              :class="{ hide: step !== 3 }"
              class="transition"
              placeholder="Choose a username"
              button="Create"
              :disabled="fetching"
              ref="usernameInput"
              @btnclick="createUser()"
              @enter="createUser()"
            />
          </div>
        </transition>
      </div>
    </div>

    <iframe
      src="/check-extension.html"
      frameborder="0"
      class="hidden"
      ref="ext-iframe"
    ></iframe>
  </div>
</template>

<script>
import axios from 'axios'
import { getAccount, getAddress } from '@/lib/nebulas'
import { mapActions } from 'vuex'
import { contract, useMainnet, callback as nebCallback } from '../lib/nebConfig'
import { asyncUntil } from '../lib/helpers'

import NebulasLogo from '@/components/icons/NebulasLogo'
import WalletIcon from '@/components/icons/WalletIcon'
import UserIcon from '@/components/icons/UserIcon'

import ActionBtn from '@/components/ui/ActionBtn'
import AppInput from '@/components/ui/AppInput'
import LoadingIndicator from '@/components/ui/LoadingIndicator'

export default {
  components: {
    ActionBtn,
    AppInput,
    LoadingIndicator,
    NebulasLogo,
    UserIcon,
    WalletIcon
  },

  data () {
    return {
      step: 3,
      extLink: process.env.extLink,
      addr: null,
      fetching: false,
      showHowto: false,
      showInput: false,
      nasTransfer: false,
      username: '',
      user: null,
      iframeWin: null,
      isExtInstalled: true
    }
  },

  mounted () {
    this.$nextTick(this.init)
    const { hash } = this.$route
    const id = hash.includes('steps') && hash
    id && document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  },

  methods: {
    ...mapActions('profile', ['saveProfile', 'getProfile', 'getUserByAddress']),

    async init () {
      this.step = this.isExtInstalled ? 2 : 1
      if (!this.isExtInstalled) return this.checkExt()
      await this.checkAddr()
      this.checkUsername()
    },

    checkExt () {
      const iframe = this.$refs['ext-iframe']
      let timeout = null

      const cb = async ({ data }) => {
        if (!data) return

        if (data.type === 'extensionloaded' && !this.isExtInstalled) {
          if (timeout) clearTimeout(timeout)
          location.reload()
        }
      }

      const checkExt = () => {
        iframe.contentWindow.removeEventListener('message', cb, false)
        iframe.contentWindow.addEventListener('message', cb, false)

        iframe.removeEventListener('load', onLoad, false)
        iframe.addEventListener('load', onLoad, false)
      }

      const onLoad = () => {
        const win = iframe.contentWindow
        this.iframeWin = win

        if (this.step > 1) return
        timeout = setTimeout(() => win && win.location.reload(), 1000)

        checkExt()
      }

      checkExt()
    },

    async checkAddr () {
      this.addr = await getAddress(true)

      if (await this.getBalance() === 0) {
        const host = 'https://claim.papel.app'

        this.nasTransfer = true
        await axios.post(`${host}/${useMainnet ? 'mainnet' : 'testnet'}/claim/${this.addr}`)

        await asyncUntil(async retry => ({
          delay: retry > 0 ? 3000 : 15000,
          done: await this.getBalance() > 0
        }), 10)
      }

      this.step = 3
    },

    async checkUsername () {
      try {
        const user = await this.getUserByAddress(this.addr)
        this.user = user
        if (!user.username) this.showInput = true
      } catch (err) {
        this.showInput = true
      }
    },

    async getBalance () {
      const { address } = await getAccount(this.addr)
      return address.currentBalance
    },

    async createUser (username = this.username) {
      const input = this.$refs.usernameInput
      if (!username) return input.showError()

      this.fetching = true
      if (await this.getProfile(username)) {
        input.showError('Username is taken.')
        this.fetching = false
        return
      }

      await this.saveProfile({ username })
      this.user = { username }
      this.showInput = false
    },

    install () {
      this.$router.push('/getting-started#steps')
      window.open(this.extLink, '_blank')

      // FIXME: Inline installs can only be initiated for
      // Chrome Web Store items that have one or more verified sites.

      /* if (!window.chrome) {
        window.open(this.extLink, '_blank')
        return
      }

      chrome.webstore.install(this.extLink) */
    }
  }
}
</script>

<style lang="scss" scoped>
.stepper {
  --color: var(--color-text-light, #ffffff80);
  width: 100%;
  min-height: 40rem;
  color: var(--color);
}

.steps {
  display: flex;
}

.step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4rem;
  opacity: 0.5;
  pointer-events: none;

  &.current {
    pointer-events: all;
    opacity: 1;
    color: var(--color-text, white);

    .action-btn {
      opacity: 1;
    }
  }
}

[data-theme='light'] .icon {
  --fill-color: transparent;
  --stroke-color: var(--color-text);
}

.icon {
  width: 3rem;
  --fill-color: var(--color-text);
}

.description {
  min-height: 2.5rem;
  margin-top: 2rem;
  width: 10rem;
  text-align: center;
}

.hint {
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;

  font-size: 0.9rem;
  text-align: center;
  opacity: 0.7;

  .loading {
    margin-bottom: 2rem;
    flex: 0 0 1.25rem;
  }
}

.video {
  height: 18rem;
  transform: translate3d(0, 0, 0);
  border-radius: 0.25rem;
}

.action-btn {
  margin: 3rem auto 0 auto;
  min-width: 8rem;
  opacity: 0.5;
  outline: none;

  img {
    height: 1.25rem;
    margin: -1rem 0;
    transform: scale(1);
  }
}

.input-wrapper {
  margin: 2rem auto 0 auto;
}

.steps-num {
  display: flex;
  align-items: center;
  width: 70.5%;
  margin: auto;
  font-weight: bold;

  li.active {
    transition: all 0.4s ease;
    color: white;

    &.num {
      background: var(--color-accent);
      box-shadow: none;
      transition-delay: 0.2s;
    }
  }

  $b-size: 2px;

  .num {
    width: 2rem;
    height: 2rem;
    text-align: center;
    line-height: 2rem;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.1);
  }

  .line {
    flex: 1;
    background: rgba(0, 0, 0, 0.1);
    height: $b-size;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 0%;
      transition: all 0.4s ease;
      background: var(--color-accent);
    }

    &.active:after {
      width: 100%;
    }
  }
}

.hidden {
  width: 0;
  height: 0;
  border: none;
  position: absolute;
}

.transition {
  transition: opacity 0.4s ease;
}

.hide {
  opacity: 0;
  pointer-events: none;
}

.home-btn {
  margin-top: 1rem;
  animation: fade-in 0.4s 0.4s ease both;
}
</style>
