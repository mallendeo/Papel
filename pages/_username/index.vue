<template>
  <section class="col wrapper">
    <h1>{{ $route.params.username }}</h1>
    <input type="text" v-model="username">
    <button @click="upsertUser">save</button>
    <h4>Showcase</h4>
    <sheet-grid
      v-if="userProfile.showcase"
      :username="username"
    />
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import SheetGrid from '@/components/SheetGrid'

export default {
  components: {
    SheetGrid
  },
  data: () => ({ username: '' }),
  computed: {
    ...mapState('profile', ['userProfile', 'sheets', 'totalSheets'])
  },
  methods: {
    ...mapActions('profile', ['getProfile', 'saveProfile', 'getUserSheets']),
    upsertUser () {
      this.saveProfile({
        username: this.username
      })
    }
  },
  mounted () {
    const { username } = this.$route.params
    this.username = username
    this.getProfile(username)
  }
}
</script>

<style lang="scss" scoped>
</style>
