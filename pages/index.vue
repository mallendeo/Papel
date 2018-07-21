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

<style scoped>
.grid {
  margin-top: 3rem;
}
</style>

