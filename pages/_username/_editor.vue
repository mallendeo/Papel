<template>
  <section
    @keydown.meta.83.exact.prevent="onSave(false)"
    @keydown.shift.meta.83.prevent="onSave(true)"
    class="container row"
  >
    <div
      id="content"
      class="content"
      :class="ui.layout === 'row' ? 'col': 'row'"
    >
      <loading-screen v-if="!isLoaded" />

      <editor-nav v-if="isLoaded" :class="{ 'autohide': zenMode }" />

      <transition-group
        v-if="isLoaded"
        name="slide"
        :class="{
          'slide-next': ui.slideNext,
          'slide-updown': ui.layout !== 'row'
        }"
        tag="div"
        class="content__wrapper"
      >
        <component
          v-for="tab of [
            'editor-save',
            'app-editors',
            'smart-contract-editor',
            'app-comments',
            'file-explorer',
            'editor-settings'
          ]"
          :ref="`tab-${tab}`"
          :is="tab"
          :key="`tab-${tab}`"
          v-show="ui.currTab.component === tab"
        />
      </transition-group>
    </div>

    <div id="preview" class="preview">
      <app-notifications group="editor" />

      <!-- TODO: Disable allow-popups (prevent alerts) when displaying on showcase -->
      <iframe
        :src="isLoaded ? previewUrl : 'about:blank'"
        allow="geolocation; microphone; camera; midi; encrypted-media"
        sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts"
        ref="preview"
        frameborder="0"
        class="preview__iframe"
        :style="{ background: editors.css.iframeBg }"
      ></iframe>
      <div v-if="errors" class="error-box">
        <span v-if="errors.html">{{ errors.html }}</span>
        <span v-if="errors.css">{{ errors.css }}</span>
        <span v-if="errors.js">{{ errors.js }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'

// Polyfill for Safari
import 'intersection-observer'

import Split from 'split.js'

import TransformWorker from '~/assets/transform.worker.js'

import AppEditors from '@/components/editor/AppEditors'
import AppComments from '@/components/editor/AppComments'
import AppNotifications from '@/components/ui/AppNotifications'
import EditorNav from '@/components/editor/EditorNav'
import EditorSettings from '@/components/editor/EditorSettings'
import EditorSave from '@/components/editor/EditorSave'
import FileExplorer from '@/components/editor/FileExplorer'
import LoadingScreen from '@/components/ui/LoadingScreen'
import SmartContractEditor from '@/components/editor/SmartContractEditor'

const worker = new TransformWorker()

export default {
  layout: 'editor',
  head: {
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Source+Code+Pro|Inconsolata' },
      { rel: 'stylesheet', href: 'https://unpkg.com/firacode@1.205.0/distr/fira_code.css' }
    ]
  },

  components: {
    AppEditors,
    AppComments,
    AppNotifications,
    EditorSave,
    EditorSettings,
    EditorNav,
    FileExplorer,
    LoadingScreen,
    SmartContractEditor
  },

  destroyed () {
    this.unsubscribeStore && this.unsubscribeStore()
    worker.removeEventListener('message', this.onWorkerMessage, false)
  },

  async beforeRouteLeave (to, from, next) {
    const hash = await this.calculateHash()

    if (this.codeHash && hash !== this.codeHash) {
      const answer = confirm('You have unsaved changes, are you sure you want to leave?')
      if (answer) window.removeEventListener('beforeunload', this.beforeLeaveHandler)
      return next(answer)
    }

    window.removeEventListener('beforeunload', this.beforeLeaveHandler)
    next()
  },

  data () {
    const { slug } = this.$route.params

    return {
      unsubscribeStore: null,
      saveKey: false,
      saveTimeout: null,
      isLoaded: false,
      slug
    }
  },

  computed: {
    ...mapState('editor', ['editors', 'code', 'ui']),
    ...mapState('ui', ['zenMode']),
    ...mapState('sheet', ['codeHash']),

    errors () {
      const { html, css, js } = this.editors
      if (html.error || css.error || js.error) {
        return {
          html: html.error,
          css: css.error,
          js: js.error
        }
      }

      return null
    },

    previewUrl () {
      const mode = this.refreshAll ? 'preview' : 'livereload'
      return process.env.NODE_ENV === 'production'
        ? `https://a.papel.app/${mode}`
        : `http://localhost:3001/${mode}.html`
    },

    refreshAll () {
      return ['live-reload'].indexOf(this.ui.refreshType) === -1
    }
  },

  methods: {
    ...mapActions('neb', ['pay']),
    ...mapActions('editor', [
      'setOutput',
      'setError',
      'setPreviewIframe',
      'loadSettings'
    ]),
    ...mapActions('sheet', [
      'loadFromLocal',
      'loadFromNebulas',
      'saveLocal',
      'saveIpfs',
      'saveOnNebulas',
      'generateHTML',
      'calculateHash'
    ]),

    async beforeLeaveHandler (event) {
      const hash = await this.calculateHash()
      if (this.codeHash && hash !== this.codeHash) {
        await this.calculateHash(true)
        event.returnValue = true
      }
    },

    updateIframe (data) {
      this.remote.postMessage({
        type: 'papel:codeupdate',
        event: data
      }, this.previewUrl)
    },

    updateMeta () {
      this.remote.postMessage({
        type: 'papel:metaupdate',
        event: {
          libs: {
            css: this.editors.css.libs,
            js: this.editors.js.libs
          }
        }
      }, this.previewUrl)
    },

    onWorkerMessage (event) {
      const { data } = event
      const { kind, type, output, error } = data

      if (kind !== 'prepros') return

      if (error) {
        this.setError({ type, error })
        return
      }

      if (!type || typeof output === 'undefined') return

      this.setOutput({ type, output })
      const manual = this.ui.refreshType === 'manual'
      const live = this.ui.refreshType === 'live-css'

      if (this.refreshAll && !manual && !live) {
        this.remote.postMessage({ type: 'papel:reload' }, '*')
        return
      }

      if (!manual) {
        const delay = this.ui.updateDelay
        if (!delay) {
          this.updateIframe(data)
          return
        }

        if (this.saveTimeout) clearTimeout(this.saveTimeout)
        this.saveTimeout = setTimeout(() => this.updateIframe(data), delay * 1000)
      }
    },

    async onSave (blockchain) {
      if (!this.isLoaded) return

      this.saveLocal(this.slug)
      const mac = navigator.appVersion.indexOf('Mac') > -1

      if (!blockchain) {
        this.$notify({
          group: 'editor',
          title: 'Project saved locally',
          text: `Press <i>Shift + ${mac ? 'Cmd' : 'Ctrl'} + S</i> to save on the blockchain.`
        })
        return
      }

      this.$notify({
        group: 'editor',
        title: 'Saving project on Nebulas',
        text: `You'll be prompted to accept the transaction`
      })

      try {
        await this.saveIpfs(this.slug)
        await this.saveOnNebulas(this.slug)
      } catch (err) {
        this.$notify({
          group: 'editor',
          type: 'error',
          title: 'Error while saving project',
          text: typeof err === 'string' ? err : err.message
        })
      }
    },

    subscribe () {
      return this.$store.subscribeAction((action, state) => {
        switch (action.type) {
          case 'editor/updateCode':
            worker.postMessage(action.payload)
            break

          case 'editor/setLang':
            worker.postMessage({
              ...action.payload,
              code: this.code[action.payload.type]
            })
            break

          case 'editor/setLibs':
            if (this.refreshAll) {
              this.remote.postMessage({ type: 'papel:reload' }, '*')
              return
            }
            this.updateMeta()
            break
        }
      })
    },

    onProjectLoad () {
      if (this.unsubscribeStore) this.unsubscribeStore()
      this.unsubscribeStore = this.subscribe()

      if (this.refreshAll) return

      this.updateMeta()
      Object.keys(this.editors).forEach(type => {
        this.$store.dispatch('editor/updateCode', {
          type,
          code: this.code[type],
          lang: this.editors[type].lang
        })
      })
    },

    async firstLoad () {
      // From localStorage
      this.loadSettings()

      try {
        if (!navigator.onLine) throw Error(`You're offline`)
        await this.loadFromNebulas(this.slug)
      } catch (err) {
        console.log('slug', this.$route)
        if (await this.loadFromLocal(this.slug)) {
          const msg = navigator.onLine
            ? `There was an error trying to load ${this.slug}`
            : err.message

          this.$notify({
            group: 'editor',
            type: 'error',
            title: msg,
            text: 'Loading from local copy'
          })
        }
      } finally {
        this.isLoaded = true
      }
    }
  },

  async mounted () {
    Split(['#content', '#preview'], {
      sizes: [35, 65],
      snapOffset: 0,
      minSize: 0,
      gutterSize: 4,
      direction: 'horizontal',
      cursor: 'col-resize',
      elementStyle: (dimension, size, gutterSize) => ({
        'flex-basis': `calc(${size}% - ${gutterSize}px)`
      }),
      onDragEnd: () => {
        this.$refs['tab-app-editors'][0].refreshEditors()
      }
    })

    this.setPreviewIframe(this.$refs.preview)
    this.remote = this.$refs.preview.contentWindow


    worker.addEventListener('message', this.onWorkerMessage, false)
    this.$refs.preview.addEventListener('load', this.onProjectLoad)

    window.addEventListener('message', async msg => {
      if (msg.data === 'papel:gethtml') {
        this.remote.postMessage({
          type: 'papel:fullhtml',
          html: await this.generateHTML({ preview: true, liveCss: true })
        }, '*')
      }
    }, false)

    await this.firstLoad()
    await this.calculateHash(true)

    // Show dialog on navigation if there are changes
    window.addEventListener('beforeunload', this.beforeLeaveHandler)
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
      border-right: 1px solid var(--color-editor-dark);

      &:hover, &:active {
        border-right: none;
        background: var(--color-editor-accent);
      }
    }
  }
}

.content {
  min-width: 24rem;
  background: var(--color-editor);
  overflow: hidden;
  position: relative;

  &__wrapper {
    height: 100%;
    width: 100%;
    position: relative;

    /deep/ .section {
      position: absolute;
      will-change: opacity;
      width: 100%; height: 100%;
    }
  }
}

.preview {
  position: relative;
  flex: 1;

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
  z-index: 20;
  transform: translateY(-95%);
  height: 3rem;
  width: 100%;
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
  background: var(--color-error);
  color: white;
  width: 100%;
  transform: translateY(100%);
  animation: slide-in .2s ease forwards;

  span {
    display: block;
    padding: .5rem 1rem;
    &:nth-child(2) {
      background: var(--color-error-light);
      padding-top: 0;
    }
  }
}

@keyframes slide-in {
  to { transform: translateY(0%); }
}
</style>
