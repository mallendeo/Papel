<template>
  <section class="section">
    <button class="btn" @click="showThemePopup = !showThemePopup">Choose Theme</button>
    <div>
      <h4>Editor font</h4>
      font family:
      <select v-model="font">
        <option
          v-for="(font, index) of fonts"
          :value="font"
          :key="`ff-${index}`"
        >{{ font }}</option>
      </select>
      font size:
      <input min="10" max="26" type="number" v-model="fontSize">
    </div>

    <div>
      Update frequency
      <select v-model="refreshDelay" name="update">
        <option :value="0">Instant</option>
        <option :value="1">One second</option>
        <option :value="2">Two seconds</option>
      </select>
      <br>
      Apply only to JS <input type="checkbox">
      <br>
      Preview without refresh (livereload) <input type="checkbox">
    </div>

    <div>
      Use:
      spaces <input v-model="indentWithTabs" :value="false" type="radio">
      tabs <input v-model="indentWithTabs" :value="true" type="radio">
    </div>
    <div>Indent width <input min="1" max="6" v-model="tabSize" type="number"></div>

    <div>
      <h4>Editor Layout</h4>
      <button
        v-for="layout of ui.layouts"
        :key="`layout-${layout}`"
        class="btn"
        :class="{ 'btn--active': ui.layout === layout }"
        @click="setLayout(layout)"
      >{{ layout }}</button>
    </div>

    <div
      class="theme-picker-wrapper"
      :class="{ 'theme-picker-wrapper--show': showThemePopup }"
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

    <button @click="zenMode = !zenMode" class="btn">Toggle Zen Mode</button>
  </section>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import ElementQueries from 'css-element-queries/src/ElementQueries'

export default {
  computed: {
    ...mapGetters('editor', ['allThemes', 'currTheme']),
    ...mapState('editor', ['layout', 'ui']),
    ...mapFields('editor', [
      'ui.font',
      'ui.fontSize',
      'ui.fonts',
      'ui.refreshDelay',
      'opts.tabSize',
      'opts.indentWithTabs'
    ]),
    ...mapFields('ui', [
      'zenMode'
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
  data: () => ({ showThemePopup: false }),
  mounted () {
    ElementQueries.init()
  }
}
</script>

<style lang="scss" scoped>
.section {
  padding: 1rem;
  color: var(--text-light);
}

h1, h2 {
  font-weight: 400;
  color: var(--text-light);
}

h1 {
  padding: 1rem;
  font-size: 1rem;
}

h2 {
  font-weight: 400;
}

.subtitle {
  align-items: center;
}

.btn {
  height: 2rem;
  background: var(--editor-color-dark);
  border-radius: .25rem;
  font-size: 1rem;
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
  padding: 2rem;

  opacity: 0;
  transform: translateX(-1rem);
  pointer-events: none;
  transition: all .2s ease;

  &--show {
    transform: translateX(0rem);
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
}

.theme-picker[min-width~="25rem"] {
  grid-template-columns: repeat(3, 1fr);
  font-size: 1rem;
  --btn-height: 6rem;
}

.theme-picker[min-width~="35rem"] {
  grid-gap: 2rem;
  --btn-height: 7rem;
}

.theme-name {
  display: block;
  margin-top: .5rem;
}

.btn-picker {
  padding: 0;
  overflow: hidden;
  border-radius: .25rem;
  width: 100%;
  border: 1px solid rgba(0,0,0,.2);
  will-change: transform;
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
