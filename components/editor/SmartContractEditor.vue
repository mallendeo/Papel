<template>
  <section class="section col">
    <cm-editor
      v-observe-visibility="visibilityChanged"
      ref="sc-editor"
      code="class SmartContract {}"
      :options="{ mode: 'text/jsx' }"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex'

import CmEditor from './CmEditor'

export default {
  components: { CmEditor },
  methods: {
    visibilityChanged (isVisible) {
      if (isVisible) {
        const ref = this.$refs['sc-editor']
        const cm = ref.codemirror || ref.$children[0].codemirror
        if (cm) cm.refresh()
      }
    }
  }
}
</script>
