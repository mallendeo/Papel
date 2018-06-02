<template>
  <section class="section col">
    <cm-editor
      :code="code"
      :options="{ mode: 'text/jsx' }"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex'

import CmEditor from './CmEditor'

export default {
  components: { CmEditor },
  computed: {
    ...mapState('editor', {
      code: state => state.code.contract
    })
  }
}
</script>
