<template>
  <header class="header row">
    <h1 class="brand row row--center">
      <papel-logo class="brand__logo" /> Papel
    </h1>

    <button
      v-for="tab of ui.tabs"
      :key="`nav-${tab.component}`"
      :title="tab.title"
      class="btn btn--fade"
      :class="{ 'btn--active': ui.currTab === tab }"
      @click="navTo(tab)"
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
      <i class="material-icons">cloud_upload</i>
      <span>Save</span>
      <!--
        call_split -> fork
        cloud_upload -> save
        cloud_off -> no extension
        cloud + loading -> saving
        cloud_done -> saved
      -->
    </button>
  </header>
</template>

<script>
import PapelLogo from '../icons/PapelLogo'
import NebulasLogo from '@/components/icons/NebulasLogo'

import { mapActions, mapState } from 'vuex'

export default {
  components: { PapelLogo, NebulasLogo },
  computed: mapState('editor', ['ui']),
  methods: {
    ...mapActions('editor', ['navTo'])
  }
}
</script>

<style lang="scss" scoped>
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

.header {
  flex: 0 0 3rem;
  background: var(--editor-color-dark);
  color: var(--text-light);
  align-items: center;
}

.btn {
  &:nth-of-type(5) { margin-left: auto; }
  i { font-size: .9rem; }
  span { padding-left: .5rem;}
  &--active { box-shadow: inset 0 -2px 0 var(--btn-color-active) }
}
</style>
