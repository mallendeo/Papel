<template>
  <section
    @keydown.meta.83.exact.prevent="onSave(false)"
    @keydown.shift.meta.83.prevent="onSave(true)"
    class="container row"
  >
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
        :src="previewUrl"
        allow="geolocation; microphone; camera; midi; encrypted-media"
        sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts"
        ref="preview"
        frameborder="0"
        class="preview__iframe"
        :style="{ background: editors.css.iframeBg }"
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
import AppComments from '@/components/editor/AppComments'
import AppNotifications from '@/components/ui/AppNotifications'
import EditorNav from '@/components/editor/EditorNav'
import EditorSettings from '@/components/editor/EditorSettings'
import EditorSave from '@/components/editor/EditorSave'
import FileExplorer from '@/components/editor/FileExplorer'
import SmartContractEditor from '@/components/editor/SmartContractEditor'

const worker = new TransformWorker()

export default {
  components: {
    AppEditors,
    AppComments,
    AppNotifications,
    EditorSave,
    EditorSettings,
    EditorNav,
    SmartContractEditor,
    FileExplorer
  },

  beforeDestroy () {
    this.unsubscribeStore && this.unsubscribeStore()
    worker.removeEventListener('message', this.onWorkerMessage, false)
  },

  data () {
    return {
      unsubscribeStore: null,
      saveKey: false,
      saveTimeout: null,
      slug: this.$route.params.editor
    }
  },

  computed: {
    ...mapState('editor', ['editors', 'code', 'ui']),
    ...mapState('ui', ['zenMode']),
    previewUrl () {
      const file = this.refreshAll ? 'preview.html' : 'livereload.html'
      return process.env.NODE_ENV === 'production'
        ? `https://a.papel.app/preview/${file}`
        : `http://localhost:3001/${file}`
    },
    refreshAll () {
      return ['live-reload'].indexOf(this.ui.refreshType) === -1
    }
  },

  methods: {
    ...mapActions('neb', ['pay']),
    ...mapActions('editor', ['setOutput', 'setError', 'setPreviewIframe']),
    ...mapActions('sheet', ['loadFromLocal', 'saveLocal', 'saveIpfs', 'generateHTML']),

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

    onSave (blockchain) {
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

      console.log('ipfs')
      this.saveIpfs(this.slug)
    },

    subscribe () {
      return this.$store.subscribeAction(async (action, state) => {
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
    }
  },

  mounted () {
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

    // Get saved state from localStorage
    this.loadFromLocal(this.slug)

    this.setPreviewIframe(this.$refs.preview)
    this.remote = this.$refs.preview.contentWindow

    worker.addEventListener('message', this.onWorkerMessage, false)

    window.addEventListener('message', async msg => {
      if (msg.data === 'papel:gethtml') {
        this.remote.postMessage({
          type: 'papel:fullhtml',
          html: await this.generateHTML({ preview: true, liveCss: true })
        }, '*')
      }
    }, false)

    this.$refs.preview.addEventListener('load', () => {
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
      border-right: 1px solid var(--editor-color-dark);

      &:hover, &:active {
        border-right: none;
        background: var(--editor-color-accent);
      }
    }
  }
}

.content {
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
