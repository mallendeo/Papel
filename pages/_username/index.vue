<template>
  <section class="section">
    <h1>{{ $route.params.username }}</h1>
    <input type="text" v-model="username">
    <button @click="upsertUser">save</button>
    <h4>Showcase</h4>
    <div class="project-grid">
      <div
        v-for="sheet of userProfile.sheets"
        class="iframe-wrapper"
        :key="sheet.distHash"
      >
        <iframe
          sandbox="allow-scripts allow-pointer-lock allow-same-origin"
          scrolling="no"
          tabindex="-1"
          allowtransparency="true"
          :src="`${ipfsUrl}/${sheet.distHash}`"
          frameborder="0"
        ></iframe>
      </div>
    </div>
    <template v-if="sheets">
      <h4>Public</h4>
      {{ sheets.length }} of {{ totalSheets }}
      <div class="project-grid">
        <nuxt-link
          v-for="sheet of sheets"
          :key="sheet.distHash"
          :to="`/${$route.params.username}/${sheet.slug}`"
        >
          <div class="iframe-wrapper">
            <iframe
              sandbox="allow-scripts allow-pointer-lock allow-same-origin"
              scrolling="no"
              tabindex="-1"
              allowtransparency="true"
              :src="`${ipfsUrl}/${sheet.distHash}`"
              frameborder="0"
            ></iframe>
          </div>
        </nuxt-link>
      </div>
    </template>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { HOST as IPFS_HOST } from '../../lib/ipfs'

export default {
  data () {
    return {
      username: '',
      ipfsUrl: `https://${IPFS_HOST}/ipfs/`
    }
  },
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
    this.getProfile(username)
    this.getUserSheets({ username })
  }
}
</script>

<style lang="scss" scoped>
.section {
  height: 100vh;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
  padding: 1rem;
  width: 100%;
  margin: auto;
}

.iframe-wrapper {
  height: 10rem;
  border-radius: .5rem;
  overflow: hidden;
  margin-bottom: auto;
  box-shadow: 0 .5rem 2rem rgba(0,0,0,.1);

  iframe {
    pointer-events: none;
    transform: scale(.5);
    transform-origin: 0 0;
    width: 200%;
    height: 200%;
  }
}
</style>
