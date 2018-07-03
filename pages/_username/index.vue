<template>
  <section class="section">
    <h1>{{ $route.params.username }}</h1>
    <input type="text" v-model="username">
    <button @click="upsertUser">save</button>
    <h4>Showcase</h4>
    <sheet-grid
      v-if="userProfile.showcase"
      :username="username"
      :sheets="userProfile.showcase"
      :totalSheets="userProfile.showcase.length"
    />

    <template v-if="sheets">
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
    </template>
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
    ...mapState('profile', ['userProfile', 'sheets', 'totalSheets'])
  },
  methods: {
    ...mapActions('profile', ['getProfile', 'saveProfile', 'getUserSheets']),
    upsertUser () {
      this.saveProfile({
        username: this.username
      })
    },
    goToPage (page) {
      const { username } = this
      this.currPage = page
      this.getUserSheets({ username, page })
    }
  },
  mounted () {
    const { username } = this.$route.params
    this.username = username
    this.getProfile(username)
    this.goToPage(1)
  }
}
</script>

<style lang="scss" scoped>
.section {
  height: 100vh;
}
</style>
