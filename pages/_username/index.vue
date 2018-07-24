<template>
  <section class="section">
    <loading-indicator v-if="loading" />
    <transition name="fade">
      <div v-if="!loading" class="col profile">
        <app-avatar :style="{ '--size': '5rem' }" :hash="userProfile.avatar" />

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

    <div v-if="!loading" class="wrapper">
      <sheet-grid
        v-if="userSheets.length"
        :username="$route.params.username"
      />

      <div class="col col--center" v-else>
        <nav-btn
          v-if="ownProfile"
          :shadow="true"
          :href="`/${loggedUser.username}/${slug()}`"
        >Create your first project!</nav-btn>

        <span class="empty-msg" v-else>{{ emptyMsg }}.</span>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import shortid from 'shortid'

import AppAvatar from '@/components/ui/AppAvatar'
import SheetGrid from '@/components/SheetGrid'
import LoadingIndicator from '@/components/ui/LoadingIndicator'
import NavBtn from '@/components/ui/NavBtn'

export default {
  components: {
    AppAvatar,
    NavBtn,
    LoadingIndicator,
    SheetGrid
  },

  middleware: 'check-extension',

  data () {
    const words = ['Dust', 'Nada', 'Empty', 'Nothing yet']
    const emptyMsg = words[Math.floor(Math.random() * words.length)]
    return { loading: true, emptyMsg }
  },
  computed: {
    ...mapState('profile', ['userProfile', 'totalUserSheets', 'userSheets']),
    ...mapState('homepage', ['loggedUser']),
    ownProfile () {
      return this.loggedUser &&
        this.userProfile.username === this.loggedUser.username
    }
  },
  methods: {
    ...mapActions('profile', ['getProfile', 'getUserSheets']),
    slug: () => shortid.generate()
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

.empty-msg {
  color: var(--color-text-lighter);
  font-size: 1.5rem;
  margin-top: 4rem;
}

.link {
  color: var(--color-text-light);
  opacity: .5;
}

.edit-profile {
  margin: auto;
}

.username { opacity: .5; }
.bio { margin: 1rem auto; }

.grid {
  margin-top: 2rem;
}
</style>
