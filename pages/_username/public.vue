<template>
  <section class="section">
    <h4>Public</h4>
    {{ sheets.length }} of {{ totalSheets }}
    <sheet-grid
      :username="username"
      :sheets="sheets"
      :currPage="currPage"
      :totalSheets="totalSheets"
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
  data: () => ({
    username: '',
    currPage: 1
  }),
  computed: {
    ...mapState('profile', ['sheets', 'totalSheets'])
  },
  methods: {
    ...mapActions('profile', ['getUserSheets']),
    goToPage (page) {
      const { username } = this
      this.currPage = page
      this.getUserSheets({ username, page })
    }
  },
  mounted () {
    const { username } = this.$route.params
    this.username = username
    this.goToPage(1)
  }
}
</script>

<style lang="scss" scoped>
.section {
  height: 100vh;
}
</style>
