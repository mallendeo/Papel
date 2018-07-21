<template>
  <section class="section">
    <div class="wrapper">
      <h2 class="subtitle">Editor Settings</h2>

      <div class="form-group">
        <app-btn-select
          label="Choose Theme"
          class="btn-select"
        >
          <select
            @change="() => setThemeTransition()"
            v-model="theme"
          >
            <option
              v-for="curr of allThemes"
              :value="curr.slug"
              :key="`theme-${curr.slug}`"
            >{{ curr.name }}</option>
          </select>
        </app-btn-select>

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

      <div class="form-group">
        <button @click="save" class="btn btn-save">Save</button>
      </div>
    </div><!-- /.wrapper -->
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
      'cmOpts.indentWithTabs',
      'cmOpts.theme'
    ])
  },
  methods: {
    ...mapActions('editor', ['saveSettings']),
    ...mapActions('ui', ['setThemeTransition']),
    save () {
      this.saveSettings()
      this.$notify({
        group: 'editor',
        title: 'Setting saved locally'
      })
    }
  },
  data: () => ({ lastRefreshType: null }),
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
  background: var(--color-editor-dark);
  border-radius: .25rem;
  font-size: 1rem;

  &-save {
    border-radius: 0;
    margin-left: auto;
    padding: .75rem 2rem;
    height: auto;
    color: var(--color-text);

    &:hover {
      background: var(--color-editor-accent);
      color: var(--color-text-contrast);
    }
  }
}

.tabs {
  display: flex;
  width: 100%;
  position: absolute;
  top: 0;
  background: var(--color-editor-dark);
}

.tab {
  --c: var(--color-editor-accent);

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
  color: var(--color-text-light);
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
  border-color: var(--color-editor-accent);
}
</style>
