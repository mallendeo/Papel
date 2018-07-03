<template>
  <section class="container row">
    Papel

    <sheet-grid
      :sheets="sheets"
      :curr-page="currPage"
      :total-sheets="totalSheets"
      :show-author="true"
      @next="goToPage(currPage + 1)"
      @prev="goToPage(currPage - 1)"
    />
  </section>
</template>


<script>
import { mapActions, mapState } from 'vuex'

import SheetGrid from '@/components/SheetGrid'

export default {
  components: { SheetGrid },
  data: () => ({ currPage: 1 }),
  computed: {
    ...mapState('homepage', ['sheets', 'totalSheets'])
  },
  methods: {
    ...mapActions('homepage', ['getSheets']),
    goToPage (page) {
      const { username } = this
      this.currPage = page
      this.getSheets({ page })
    }
  },
  mounted () {
    this.getSheets()
  }
}
</script>

<style scoped lang="scss">
</style>
