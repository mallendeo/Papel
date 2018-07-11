<template>
  <section class="section col">
    Papel

    <loading-screen v-if="loading" />

    <sheet-grid
      v-if="sheets"
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
import { getAccount, checkExt } from '../lib/nebulas'

import LoadingScreen from '@/components/ui/LoadingScreen'
import SheetGrid from '@/components/SheetGrid'

export default {
  components: {
    SheetGrid,
    LoadingScreen
  },
  data: () => ({
    currPage: 1,
    loading: true
  }),
  computed: {
    ...mapState('homepage', ['sheets', 'totalSheets'])
  },
  methods: {
    ...mapActions('homepage', ['getSheets']),
    goToPage (page) {
      const { username } = this
      this.currPage = page
      this.getSheets({ page })
    },

    redirect () {
      this.$router.push('/getting-started')
    }
  },
  async mounted () {
    if (!checkExt()) return this.redirect()

    try {
      await getAccount(null, 5)
    } catch (err) {
      return this.redirect()
    }

    await this.getSheets()
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.section {
  min-height: 100vh;
}

.sheets {
  margin: auto;
}
</style>
