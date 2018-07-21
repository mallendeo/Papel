<template>
  <section class="section">
    <loading-indicator v-if="loading" />
    <transition name="fade">
      <div v-if="!loading" class="col profile">
        <img
          class="avatar"
          :src="userProfile.avatar
            ? `${ipfsUrl}/${userProfile.avatar}`
            : require('~/assets/icons/user.svg')"
        >
        <h2 class="name">{{ userProfile.name }}</h2>
        <span class="username">@{{ userProfile.username }}</span>
        <p class="bio">{{ userProfile.bio }}</p>

        <nuxt-link
          class="link"
          :to="`/${$route.params.username}/edit`"
          v-if="ownProfile"
        >
          Edit profile
        </nuxt-link>
      </div>
    </transition>

    <div class="wrapper">
      <sheet-grid
        v-if="!loading"
        :username="$route.params.username"
      />
    </div>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import SheetGrid from '@/components/SheetGrid'
import LoadingIndicator from '@/components/ui/LoadingIndicator'
import NavBtn from '@/components/ui/NavBtn'

export default {
  components: {
    NavBtn,
    LoadingIndicator,
    SheetGrid
  },
  data: () => ({ loading: true }),
  computed: {
    ...mapState('profile', ['userProfile', 'totalUserSheets']),
    ...mapState('homepage', ['loggedUser']),
    ownProfile () {
      return this.loggedUser &&
        this.userProfile.username === this.loggedUser.username
    }
  },
  methods: {
    ...mapActions('profile', ['getProfile', 'getUserSheets'])
  },
  async mounted () {
    const { username } = this.$route.params
    await this.getProfile(username)
    await this.getUserSheets({ username })
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.profile {
  padding-top: 4rem;
  padding-bottom: 2rem;
  align-items: center;
  background: var(--color-contrast);
  color: var(--color-text);
}

div.loading {
  margin-top: 4rem;
}

.name {
  margin-top: 1rem;
  font-weight: 400;
}

.link {
  color: var(--color-text-light);
  opacity: .5;
}

.edit-profile {
  margin: auto;
}

.username { opacity: .5; }
.bio { margin-top: 1rem; }

.avatar {
  width: 5rem;
  height: 5rem;
}

.grid {
  margin-top: 2rem;
}
</style>
