<template>
  <section class="section">
    <nav class="tabs">
      <div
        v-for="tab of tabs"
        :key="`tab-sel-${tab.to}`"
        class="tab"
        :class="{ 'tab--active': currTab === tab.to }"
        @click="currTab = tab.to"
      >{{ tab.title }}</div>
    </nav>

    <div class="tab-content">
      <template v-if="currTab === 'html'">
        <h2>HTML</h2>

        <select name="preprocessor">
          <option value="html">None</option>
          <option value="pug">Pug</option>
          <option disabled value="markdown">Markdown (Soon)</option>
        </select>

        <input placeholder="HTML classes" type="text">
        <textarea placeholder="Head content" type="text"></textarea>
      </template>

      <template v-if="currTab === 'css'">
        <h2>CSS</h2>

        <select name="preprocessor">
          <option value="css">None</option>
          <option value="stylus">Stylus</option>
          <option disabled value="scss">SCSS (Soon)</option>
          <option disabled value="sass">SASS (Soon)</option>
          <option disabled value="less">LESS (Soon)</option>
        </select>

        Use normalizer <input type="checkbox">
        Use autoprefixer <input type="checkbox">
      </template>

      <template v-if="currTab === 'js'">
        <h2>JS</h2>

        <select name="preprocessor">
          <option value="js">None</option>
          <option value="babel">Babel</option>
          <option disabled value="typescript">Typescript (Soon)</option>
          <option disabled value="coffeescript">Coffeescript (Soon)</option>
        </select>
      </template>

      <template v-if="currTab === 'editor'">
        <div>
          Editor theme
          <select @change="onThemeChange" :value="currTheme" name="update">
            <option
              v-for="theme of allThemes"
              :value="theme.slug"
              :key="`opt-theme-${theme.slug}`"
            >{{ theme.name }}</option>
          </select>
        </div>

        <div>
          <h2>Update frequency</h2>
          Apply only to JS <input type="checkbox">
          <select name="update">
            <option value="0">Instant</option>
            <option value="1">One second</option>
            <option value="2">Two seconds</option>
          </select>
        </div>

        <div>Use spaces <input type="checkbox"></div>
        <div>Indent width <input type="number"></div>
      </template>

    </div>
  </section>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      currTab: 'html',
      tabs: [
        { to: 'html', title: 'HTML' },
        { to: 'css', title: 'CSS' },
        { to: 'js', title: 'JS' },
        { to: 'editor', title: 'Editor' }
      ]
    }
  },
  computed: {
    ...mapGetters('editor', ['allThemes', 'currTheme'])
  },
  methods: {
    ...mapActions('editor', ['setTheme']),
    ...mapActions('ui', ['setThemeTransition']),
    onThemeChange (event) {
      this.setThemeTransition()
      this.setTheme(event.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.section {
  padding-top: 2.25rem;
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
</style>
