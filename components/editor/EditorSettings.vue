<template>
  <section class="section">
    <div class="wrapper">
      <h2 class="subtitle">Editor Settings</h2>

      <div class="form-group">
        <app-btn-select
          :value="currTheme"
          label="Choose Theme"
          @click.native="showThemePopup = !showThemePopup"
          class="btn-select"
        />

        <app-btn-select
          label="Editor Font"
          class="btn-select"
          :caret="false"
        >
          <select v-model="font">
            <option
              v-for="(font, index) of fonts"
              :value="font"
              :key="`ff-${index}`"
            >{{ font }}</option>
          </select>

          <select v-model="fontSize">
            <option
              v-for="size of Array(11).fill().map((n, i) => i + 10)"
              :value="size"
              :key="`fs-${size}`"
            >{{ size }}px</option>
          </select>
        </app-btn-select>

        <app-btn-select
          label="Indent with"
          class="btn-select"
          :caret="false"
        >
          <select class="select-width" v-model="tabSize">
            <option
              v-for="size of Array(6).fill().map((e, i) => i + 1)"
              :value="size"
              :key="`fs-${size}`"
            >{{ size }}</option>
          </select>

          <select v-model="indentWithTabs">
            <option :value="true">Tabs</option>
            <option :value="false">Spaces</option>
          </select>
        </app-btn-select>
      </div>

      <h2 class="subtitle">Behaviour</h2>
      <div class="form-group">
        <app-btn-select
          label="Refresh type"
          class="btn-select"
          :caret="false"
        >
          <select v-model="refreshType">
            <option value="manual">Manual refresh</option>
            <option value="refresh">Refresh entire page</option>
            <option value="live-css">Refresh + CSS Injection</option>
            <option value="live-reload">Live reload (experimental)</option>
          </select>
        </app-btn-select>

        <app-btn-select
          label="Refresh delay"
          class="btn-select"
          :caret="false"
          :disabled="refreshType === 'manual'"
        >
          <select v-model="updateDelay">
            <option :value="0">Instant</option>
            <option :value="1">One second</option>
            <option :value="2">Two seconds</option>
          </select>
        </app-btn-select>
      </div>

      <!--
      <h2 class="subtitle">Layout</h2>
      <div class="form-group">
        <button
          v-for="layout of ui.layouts"
          :key="`layout-${layout}`"
          class="btn"
          :class="{ 'btn--active': ui.layout === layout }"
          @click="setLayout(layout)"
        >{{ layout }}</button>
      </div>
      -->

      <div class="form-group">
        <button class="btn btn-save">Save</button>
      </div>
    </div><!-- /.wrapper -->

    <div
      class="theme-picker-wrapper"
      :class="{
        'theme-picker-wrapper--show': showThemePopup
      }"
    >
      <h4 class="subtitle row">
        <button
          @click="showThemePopup = !showThemePopup"
          class="btn material-icons"
        >arrow_back</button>
        <span>Editor Theme</span>
      </h4>

      <ul class="theme-picker">
        <li
          v-for="theme of allThemes"
          :key="`btn-opt-theme-${theme.slug}`"
        >
          <button
            class="btn btn-picker"
            :class="{ 'btn--active': currTheme === theme.slug }"
            @click="changeTheme(theme.slug)"
          >
            <img
              :src="require(`~/assets/img/theme-${theme.slug.replace(/\s/g, '-')}.jpg`)"
              :alt="`${theme.name} theme`"
            >
          </button>
          <small class="theme-name">{{ theme.name }}</small>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import ElementQueries from 'css-element-queries/src/ElementQueries'

import AppBtnSelect from '../ui/AppBtnSelect'

export default {
  components: {
    AppBtnSelect
  },
  computed: {
    ...mapGetters('editor', ['allThemes', 'currTheme']),
    ...mapState('editor', ['layout', 'ui']),
    ...mapFields('editor', [
      'ui.font',
      'ui.fontSize',
      'ui.fonts',
      'ui.refreshType',
      'ui.updateDelay',
      'cmOpts.tabSize',
      'cmOpts.indentWithTabs'
    ])
  },
  methods: {
    ...mapActions('editor', ['setTheme', 'setLayout', 'setFont']),
    ...mapActions('ui', ['setThemeTransition']),

    changeTheme (theme) {
      this.setThemeTransition()
      this.setTheme(theme)
      this.showThemePopup = false
    }
  },
  data: () => ({ showThemePopup: false, lastRefreshType: null }),
  mounted () {
    ElementQueries.init()
  }
}
</script>

<style lang="scss" scoped>
.section {
  padding: 0 1rem;
}

.btn-select {
  width: 100%;
}

.select-width {
  width: 4rem;
  text-align-last: center;
}

.wrapper {
  max-width: 25rem;
  margin: 1rem auto;

  &[min-width~="25rem"] {
    margin-top: 2rem;
  }
}

.form-group {
  margin: 1rem auto;
  margin-left: 0;
}

.subtitle {
  align-items: center;
  margin-top: 1rem;
  font-size: 1rem;
}

.btn {
  height: 2rem;
  background: var(--editor-color-dark);
  border-radius: .25rem;
  font-size: 1rem;

  &-save {
    border-radius: 0;
    margin-left: auto;
    padding: .75rem 2rem;
    height: auto;
    color: var(--text-lighter);

    &:hover {
      background: var(--editor-color-accent);
      color: var(--text-contrast);
    }
  }
}

.tabs {
  display: flex;
  width: 100%;
  position: absolute;
  top: 0;
  background: var(--editor-color-dark);
}

.tab {
  --c: var(--editor-color-accent);

  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: .5rem;
  font-size: .75rem;
  color: var(--c);

  border-bottom: 1px solid var(--c);
  opacity: .75;
  transition: all .2s ease;
  will-change: opacity, box-shadow;
  cursor: pointer;

  &--active {
    opacity: 1;
    box-shadow: inset 0 -1px 0 0 var(--c);
  }
}

.tab-content {
  color: var(--text-light);
}

.theme-picker-wrapper {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  background: var(--editor-color-dark);
  padding: 1rem;

  opacity: 0;
  pointer-events: none;
  transition: all .2s ease;

  &--show {
    opacity: 1;
    pointer-events: all;
  }
}

.theme-picker {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 1rem 0;
  grid-gap: 1rem;
  --btn-height: 5rem;
  max-width: 40rem;
  font-size: .8rem;

  &[min-width~="25rem"] {
    grid-template-columns: repeat(3, 1fr);
    font-size: 1rem;
    --btn-height: 6rem;
  }

  &[min-width~="35rem"] {
    grid-gap: 2rem;
    padding: 1rem;
    --btn-height: 7rem;
  }
}

.theme-name {
  display: block;
  margin-top: .5rem;
  color: var(--text-light);
}

.btn-picker {
  padding: 0;
  overflow: hidden;
  border-radius: 0;
  width: 100%;
  border: 1px solid transparent;
  background: transparent;
  opacity: .8;
  height: var(--btn-height);

  &:hover {
    opacity: 1;
  }
}

.btn--active {
  opacity: 1;
  border-color: var(--editor-color-accent);
}
</style>
