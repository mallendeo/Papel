<template>
  <section class="col wrapper">
    <sheet-grid :show-author="true" />
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import SheetGrid from '@/components/SheetGrid'

export default {
  components: {
    SheetGrid
  },

  middleware: 'check-extension'
}
</script>
