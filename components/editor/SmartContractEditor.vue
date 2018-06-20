<template>
  <section class="section col">
    <editor-toolbar class="nav row">
      <app-select
        class="select-wrapper"
        :currTitle="preprosList[opts.lang]"
        :options="selectOptions"
        :value="opts.lang"
        @change="lang => (opts.lang = lang)"
      />
      <h2 class="nav__title">Nebulas Contract</h2>

      <button
        v-for="tab of tabs"
        :key="`nav-${tab.name}`"
        :title="tab.title"
        class="btn btn--fade"
        :class="{ 'btn--active': currTab === tab }"
        @click="currTab = tab"
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
    </editor-toolbar>

    <cm-editor
      :code="code.src"
      :options="{ mode: 'text/jsx' }"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import CmEditor from './CmEditor'
import EditorToolbar from './EditorToolbar'
import AppSelect from '../ui/AppSelect'
import DatabaseIcon from '../icons/DatabaseIcon'
import TerminalIcon from '../icons/TerminalIcon'

export default {
  components: {
    AppSelect,
    CmEditor,
    EditorToolbar,
    DatabaseIcon,
    TerminalIcon
  },
  computed: {
    ...mapState('sc-editor', ['code', 'prepros']),
    ...mapFields('sc-editor', ['ui.currTab', 'ui.tabs', 'opts']),

    preprosList () {
      return Object.keys(this.prepros)
    },

    selectOptions () {
      return this.preprosList.map(lang => ({
        value: lang,
        icon: require(`~/assets/icons/${this.prepros[lang].icon}.svg`),
        title: `${this.prepros[lang].title}${!this.prepros[lang].enabled ? ' (Soon)' : ''}`,
        disabled: !this.prepros[lang].enabled
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
.select-wrapper {
  height: 3rem;
}

.nav {
  flex: 0 0 3rem;
  background: var(--editor-color-dark);
  color: var(--text-light);
  justify-content: flex-end;

  &__title {
    font-weight: 400;
    margin-right: auto;
    font-size: .9rem;
    opacity: .5;
  }
}

.btn {
  height: 3rem;
  border-bottom: 2px solid transparent;

  i { font-size: .8rem; }
  svg { height: .75rem; }

  &--active {
    background: transparent;
    color: var(--warning-color);
    border-bottom-color: currentColor;
  }
}
</style>
