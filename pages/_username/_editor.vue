<template>
  <section class="container row">
    <div id="content" class="content" :class="ui.layout === 'row' ? 'col': 'row'">
      <editor-nav :class="{ 'autohide': zenMode }" />

      <transition-group
        name="slide"
        :class="{
          'slide-next': ui.slideNext,
          'slide-updown': ui.layout !== 'row'
        }"
        tag="div"
        class="content__wrapper"
      >
        <app-editors
          key="tab-1"
          v-show="ui.currTab.component === 'app-editors'" />
        <smart-contract-editor
          key="tab-2"
          v-show="ui.currTab.component === 'smart-contract-editor'" />
        <editor-settings
          key="tab-3"
          v-show="ui.currTab.component === 'editor-settings'" />
      </transition-group>
    </div>

    <div id="preview" class="preview">
      <!-- Disable allow-popups (prevent alerts) when showing the showcase -->
      <iframe
        :src="previewUrl"
        sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts"
        ref="preview"
        frameborder="0"
        class="preview__iframe"
      ></iframe>
      <!--<div v-if="htmlErr || cssErr || jsErr" class="error-box">
        <span v-if="htmlErr">{{ htmlErr }}</span>
        <span v-if="cssErr">{{ cssErr }}</span>
        <span v-if="jsErr">{{ jsErr }}</span>
      </div>-->
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TransformWorker from '~/assets/transform.worker.js'

import shortid from 'shortid'
import Split from 'split.js'

import AppEditors from '@/components/editor/AppEditors'
import SmartContractEditor from '@/components/editor/SmartContractEditor'
import EditorSettings from '@/components/editor/EditorSettings'
import EditorNav from '@/components/editor/EditorNav'

const worker = new TransformWorker()

export default {
  components: {
    AppEditors,
    SmartContractEditor,
    EditorSettings,
    EditorNav
  },

  beforeDestroy () {
    this.unsubscribeStore()
    worker.removeEventListener('message', this.onMessage, false)
  },

  data: () => {
    const previewUrl = process.env.NODE_ENV === 'production'
      ? 'https://a.papel.app/preview/'
      : 'http://localhost:3001/preview.html'

    return {
      previewUrl,
      unsubscribeStore: null
    }
  },

  computed: {
    ...mapState('editor', ['editors', 'code', 'ui']),
    ...mapState('ui', ['zenMode'])
  },

  methods: {
    ...mapActions('neb', ['pay']),
    ...mapActions('editor', ['setOutput', 'setError']),

    updateIframe (event) {
      const remote = this.$refs.preview.contentWindow

      remote.postMessage({
        type: 'papel:codeupdate',
        event
      }, this.previewUrl)
    },

    onMessage (event) {
      const { data } = event
      const { kind, type, output, error } = data

      if (kind !== 'prepros') return

      if (error) {
        this.setError({ type, error: data.error })
        return
      }

      if (!type || typeof output === 'undefined') return

      this.updateIframe(data)
      this.setOutput({ type, output })
    }
  },
  mounted () {
    Split(['#content', '#preview'], {
      snapOffset: 0,
      minSize: 0,
      gutterSize: 4,
      direction: 'horizontal',
      cursor: 'col-resize',
      elementStyle: (dimension, size, gutterSize) => ({
        'flex-basis': `calc(${size}% - ${gutterSize}px)`
      })
    })

    this.unsubscribeStore = this.$store.subscribeAction((action, state) => {
      if (action.type === 'editor/updateCode') {
        worker.postMessage(action.payload)
      }

      if (action.type === 'editor/setLang') {
        worker.postMessage({
          ...action.payload,
          code: this.code[action.payload.type]
        })
      }
    })

    worker.addEventListener('message', this.onMessage, false)

    this.$refs.preview.addEventListener('load', () => {
      Object.keys(this.editors).forEach(type => {
        this.$store.dispatch('editor/updateCode', {
          type,
          code: this.code[type],
          lang: this.editors[type].lang
        })
      })
    })
  }
}
</script>

<style scoped lang="scss">
$dist: 1rem;
.slide-enter-active {
  transition: all .2s ease;
  transform: translateX(0rem);
}

.slide-enter, .slide-leave-to {
  transition: all .2s ease;
  transform: translateX(-$dist);
  opacity: 0;
}

.slide-leave-to { transform: translateX($dist) }
.slide-next {
  .slide-leave-to { transform: translateX(-$dist) }
  .slide-enter { transform: translateX($dist) }
}

.slide-updown {
  .slide-enter-active { transform: translateY(0rem); }
  .slide-enter, .slide-leave-to { transform: translateY($dist); }
  .slide-leave-to { transform: translateY(-$dist) }

  &.slide-next {
    .slide-leave-to { transform: translateY($dist) }
    .slide-enter { transform: translateY(-$dist) }
  }
}

.container {
  height: 100vh;

  /deep/ {
    .gutter.gutter-horizontal {
      transition: background .1s ease;
      cursor: col-resize;
      margin-left: -.25rem;
      z-index: 10;

      &:hover, &:active {
        background: var(--editor-color-accent);
      }
    }
  }
}

.content {
  flex: 2;
  min-width: 24rem;
  background: var(--editor-color);
  overflow: hidden;
  position: relative;

  &__wrapper {
    height: 100%;
    width: 100%;
    position: relative;

    /deep/ .section {
      position: absolute;
      width: 100%; height: 100%;
    }
  }
}

.preview {
  flex: 3;
  position: relative;

  &__iframe {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.nav {
  transition: transform .1s ease;
}
.autohide {
  position: absolute;
  z-index: 9;
  transform: translateY(-95%);
  transition-delay: .1s;
  height: 3rem;
  &:hover {
    transform: translateY(0%);
  }
}
.content.row .autohide {
  height: 100%;
  transform: translateX(-95%);
  &:hover {
    transform: translateX(0%);
  }
}

.error-box {
  position: absolute;
  bottom: 0;
  background: var(--error-color);
  color: white;
  width: 100%;
  transform: translateY(100%);
  animation: slide-in .2s ease forwards;

  span {
    display: block;
    padding: .5rem 1rem;
    &:nth-child(2) {
      background: var(--error-color-light);
      padding-top: 0;
    }
  }
}

@keyframes slide-in {
  to { transform: translateY(0%); }
}
</style>
