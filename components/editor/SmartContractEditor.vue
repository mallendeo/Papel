<template>
  <section class="section col">
    <cm-editor
      code="class SmartContract {}"
      :options="{ mode: 'text/jsx' }"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex'

import CmEditor from './CmEditor'

export default {
  components: { CmEditor }
}
</script>
