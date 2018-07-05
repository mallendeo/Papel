<template>
  <div class="stepper">
    <ul class="steps-num">
      <li class="num active">1</li>
      <li class="line" :class="{ active: step > 1 }"></li>
      <li class="num" :class="{ active: step > 1 }">2</li>
      <li class="line" :class="{ active: step > 2 }"></li>
      <li class="num" :class="{ active: step > 2 }">3</li>
    </ul>

    <div class="steps">
      <div class="step active" :class="{ current: step === 1 }">
        <nebulas-logo class="icon" />
        <span class="description">Install the Nebulas wallet extension.</span>
        <action-btn @click.native="install">
          <img src="~/assets/icons/chrome.svg" alt="Google Chrome">
          Install
        </action-btn>
      </div>

      <div class="step" :class="{ active: step > 1, current: step === 2 }">
        <wallet-icon class="icon" />
        <span class="description">Create a wallet.</span>
        <small v-if="step === 2" class="hint">
          We will transfer your tokens once the wallet is created.
        </small>
      </div>

      <div class="step" :class="{ active: step > 2, current: step === 3 }">
        <user-icon class="icon" />
        <span class="description">Choose a username.</span>
        <app-input placeholder="Choose a username" button="Create"/>
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
import NebulasLogo from '@/components/icons/NebulasLogo'
import WalletIcon from '@/components/icons/WalletIcon'
import UserIcon from '@/components/icons/UserIcon'

import ActionBtn from '@/components/ui/ActionBtn'
import AppInput from '@/components/ui/AppInput'

export default {
  components: {
    ActionBtn,
    AppInput,
    NebulasLogo,
    UserIcon,
    WalletIcon
  },
  data () {
    return {
      step: 1,
      extLink: process.env.extLink,
      addr: null,
      showHowto: false
    }
  },
  mounted () {
    this.$nextTick(this.init)
  },
  methods: {
    init () {
      const iframe = this.$refs['ext-iframe']
      let timeout = null

      const cb = ({ data }) => {
        if (!data) return
        if (data.type === 'extensionloaded') {
          this.step = 2
          if (timeout) clearTimeout(timeout)
        }

        if (data.type === 'gotuseraddress') {
          this.addr = data.payload
        }
      }

      const onLoad = () => {
        const win = iframe.contentWindow

        if (this.step > 1) return
        timeout = setTimeout(() => win.location.reload(), 1000)
        check()
      }

      const check = () => {
        iframe.contentWindow.removeEventListener('message', cb, false)
        iframe.contentWindow.addEventListener('message', cb, false)

        iframe.removeEventListener('load', onLoad, false)
        iframe.addEventListener('load', onLoad, false)
      }

      check()
    },
    install () {
      if (!window.chrome) {
        window.open(this.extLink, '_blank')
        return
      }

      chrome.webstore.install()
    }
  }
}
</script>

<style lang="scss" scoped>
.hidden {
  width: 0; height: 0;
  border: none;
  position: absolute;
}

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
  opacity: .5;
  pointer-events: none;

  &.current {
    pointer-events: all;

    .action-btn {
      opacity: 1;
    }
  }

  &.active {
    opacity: 1;
    color: var(--color-text, white);
  }

  span {
    margin-top: 2rem;
    width: 10rem;
    text-align: center;
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
}

.hint {
  margin-top: 3rem;
  opacity: .5;
  width: 70%;
  text-align: center;
}

.video {
  height: 18rem;
  transform: translate3d(0, 0, 0);
  border-radius: .25rem;
}

.action-btn {
  margin: 3rem auto 0 auto;
  min-width: 8rem;
  opacity: .5;
  outline: none;

  img {
    height: 1.25rem;
    margin: -1rem 0;
    transform: scale(1);
  }
}

.input-wrapper {
  margin: 3rem auto 0 auto;
}

.steps-num {
  display: flex;
  align-items: center;
  width: 70.5%;
  margin: auto;
  font-weight: bold;

  li.active {
    background: var(--color-accent);
    color: white;
    &.num { box-shadow: none; }
  }

  $b-size: 2px;

  .num {
    width: 2rem;
    height: 2rem;
    text-align: center;
    line-height: 2rem;
    border-radius: 50%;
    background: rgba(0,0,0,.1);
  }

  .line {
    flex: 1;
    border-top: $b-size solid rgba(0,0,0,.1);

    &.active {
      border-color: var(--color-accent);
    }
  }
}
</style>
