<template>
  <header
    class="header"
    :class="ui.layout === 'col'
      ? 'col header--col'
      : 'row'
    "
  >
    <h1 class="brand row row--center">
      <papel-logo class="brand__logo" />
      <span>Papel</span>
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
      @click="save"
      class="btn btn--fade"
    >
      <upload-icon class="icon--small" />
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
import NebulasLogo from '../icons/NebulasLogo'
import UploadIcon from '../icons/UploadIcon'

import { mapActions, mapState } from 'vuex'

export default {
  components: {
    PapelLogo,
    NebulasLogo,
    UploadIcon
  },
  computed: mapState('editor', ['ui']),
  methods: {
    ...mapActions('editor', ['navTo']),
    ...mapActions('nebpay', ['callFunction']),
    ...mapActions('ipfs', ['saveCurrCode']),
    async save () {
      this.saveCurrCode()
    }
  }
}
</script>

<style lang="scss" scoped>
.icon--small {
  height: .75rem;
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

.header {
  flex: 0 0 3rem;
  background: var(--editor-color-dark);
  color: var(--text-light);
  align-items: center;

  &--col {
    width: 3rem;
    .brand {
      margin-left: auto;
      margin-right: auto;
      svg { margin: .75rem auto .5rem auto; }
      span { display: none; }
    }

    .btn {
      height: 2.5rem;
      margin: .5rem 0;
      order: 1;
      span { display: none; }
      &:last-of-type { order: 0 }
      &--active {
        box-shadow: inset -2px 0 0 var(--btn-color-active);
      }
    }
  }
}

.btn {
  &:nth-of-type(5) { margin-left: auto }
  .material-icons { font-size: .9rem }
  span { padding-left: .5rem }

  &--active {
    box-shadow: inset 0 -2px 0 var(--btn-color-active);
  }
}
</style>
