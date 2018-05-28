<template>
  <section class="container row">
    <div id="content" class="content col">
      <header class="header row">
        <h1 class="brand row row--center">
          <paper-logo class="brand__logo"></paper-logo> Papel
        </h1>

        <button @click="() => pay()" class="btn">Save</button>
      </header>

      <app-editors />
    </div>

    <div id="preview" class="preview">
      <!-- Disable allow-popups (prevent alerts) when showing the showcase -->
      <iframe
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
import shortid from 'shortid'

import Split from 'split.js'
import { mapState, mapActions } from 'vuex'

import PaperLogo from '../components/PaperLogo'
import AppEditors from '../components/AppEditors'

export default {
  components: { PaperLogo, AppEditors },
  data: () => ({
    iframeDoc: null
  }),
  methods: {
    ...mapActions('neb', ['pay'])
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
      }),
      gutterStyle: (dimension, gutterSize) => ({
        'flex-basis': `${gutterSize}px`
      })
    })

    const doc = this.$refs.preview.contentWindow.document
    const style = doc.createElement('style')
    style.id = 'preview-style'
    doc.head.appendChild(style)

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
.brand {
  font-family: 'Comfortaa', sans-serif;
  font-size: .8rem;
  margin-left: 1rem;
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
        background: var(--btn-bg);
      }
    }
  }
}

.header {
  height: 3rem;
  background: var(--header-bg);
  color: white;
  align-items: center;
}

.content {
  flex: 2;
  background: #222d32;
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

.btn { margin-left: auto; }

@keyframes slide-in {
  to { transform: translateY(0%); }
}
</style>
