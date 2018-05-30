<template>
  <section class="container row">
    <div id="content" class="content col">
      <header class="header row">
        <h1 class="brand row row--center">
          <paper-logo class="brand__logo"></paper-logo> Papel
        </h1>

        <button
          v-for="tab of tabs"
          :key="`nav-${tab.component}`"
          :title="tab.title"
          class="btn btn--fade"
          :class="{ 'btn--active': currTab === tab }"
          @click="showTab(tab)"
        >
          <i
            v-if="tab.icon"
            class="material-icons"
          >{{ tab.icon }}</i>

          <component
            v-else-if="tab.iconComponent"
            :is="tab.iconComponent"
          />
        </button>

        <button
          title="Save"
          @click="() => pay()"
          class="btn btn--fade"
        >
          <i class="material-icons">save</i>
        </button>
      </header>

      <transition-group
        name="slide"
        :class="{ 'slide-right': slideRight }"
        tag="div"
        class="content__wrapper"
      >
        <app-editors
          key="tab-1"
          v-show="currTab.component === 'app-editors'" />
        <smart-contract-editor
          key="tab-2"
          v-show="currTab.component === 'smart-contract-editor'" />
        <editor-settings
          key="tab-3"
          v-show="currTab.component === 'editor-settings'" />
      </transition-group>
    </div>

    <div id="preview" class="preview">
      <!-- Disable allow-popups (prevent alerts) when showing the showcase -->
      <iframe
        sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin"
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
import shortid from 'shortid'

import Split from 'split.js'
import { mapState, mapActions } from 'vuex'

import PaperLogo from '@/components/icons/PaperLogo'
import NebulasLogo from '@/components/icons/NebulasLogo'

import AppEditors from '@/components/editor/AppEditors'
import SmartContractEditor from '@/components/editor/SmartContractEditor'
import EditorSettings from '@/components/editor/EditorSettings'

export default {
  components: {
    PaperLogo,
    AppEditors,
    NebulasLogo,
    SmartContractEditor,
    EditorSettings
  },
  data: () => {
    const tabs = [{
      index: 0,
      component: 'app-editors',
      title: 'Editor',
      icon: 'code'
    }, {
      index: 1,
      component: 'smart-contract-editor',
      title: 'Smart contract editor',
      iconComponent: 'nebulas-logo'
    }, {
      index: 2,
      component: 'app-info',
      title: 'Details',
      icon: 'info'
    }, {
      index: 3,
      component: 'editor-settings',
      title: 'Editor settings',
      icon: 'settings'
    }]

    return {
      iframeDoc: null,
      tabs,
      currTab: tabs[0],
      slideRight: false
    }
  },
  methods: {
    ...mapActions('neb', ['pay']),
    showTab(tab) {
      this.slideRight = tab.index > this.currTab.index
      this.currTab = tab
    }
  },
  computed: {
    ...mapState('editor', ['compiled']),
    html () { return this.compiled.html },
    css () { return this.compiled.css },
    js () { return this.compiled.js }
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

    const doc = this.$refs.preview.contentDocument
    const style = doc.createElement('style')
    style.id = 'preview-style'
    doc.head.appendChild(style)
    console.log({head: doc.head})

    this.iframeDoc = doc
  },
  watch: {
    html (code) {
      this.iframeDoc.body.innerHTML = code
    },

    css (code) {
      const styleElem = this.iframeDoc.querySelector('#preview-style')
      styleElem.innerHTML = code
    },

    js (code) {
      // this.$refs.preview.src = 'about:blank'
      const jsEl = this.iframeDoc.querySelector('#preview-script')
      if (jsEl) jsEl.parentNode.removeChild(jsEl)

      const script = this.iframeDoc.createElement('script')
      const inlineScript = this.iframeDoc.createTextNode(code)
      script.appendChild(inlineScript)
      script.id = 'preview-script'
      this.iframeDoc.body.appendChild(script)
    }
  }
}
</script>

<style scoped lang="scss">
$dist: 1rem;
.slide-enter-active {
  transition: all .2s;
  transform: translateX(0rem);
}
.slide-enter, .slide-leave-to {
  transition: all .2s;
  transform: translateX(-$dist);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX($dist);
}
.slide-right {
  .slide-leave-to {
    transform: translateX(-$dist);
  }
  .slide-enter {
    transform: translateX($dist);
  }
}

.brand {
  font-family: 'Comfortaa', sans-serif;
  font-size: .8rem;
  margin-left: 1rem;
  margin-right: 2rem;
  font-weight: 400;
  color: var(--logo-text);

  &__logo {
    margin-right: .5rem;
    width: 1.25rem;
    /deep/ {
      path, rect {
        fill: var(--logo-fill);
        stroke-width: 4px;
        stroke: var(--logo-stroke);
      }
    }
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
        background: var(--blue);
      }
    }
  }
}

.header {
  flex: 0 0 3rem;
  background: var(--header-bg);
  color: white;
  align-items: center;
}

.content {
  flex: 2;
  min-width: 24rem;
  background: var(--editor-bg);
  overflow: hidden;

  &__wrapper {
    height: 100%;
    position: relative;

    /deep/ section {
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

.btn {
  &:nth-of-type(4) { margin-left: auto; }
  i { font-size: .9rem; }
}

@keyframes slide-in {
  to { transform: translateY(0%); }
}
</style>
