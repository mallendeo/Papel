<template>
  <div class="grid">
    <loading-indicator
      :style="{ '--color': 'var(--color-accent)' }"
      v-if="loading"
    />

    <div
      v-if="!loading && getUsername(sheet)"
      v-for="(sheet, index) of sheetList"
      :key="`${sheet.distHash}-${index}`"
      class="grid__item col"
    >
      <a class="iframe-wrapper" :href="`/${getUsername(sheet)}/${sheet.slug}`">
        <iframe
          :src="`${ipfsUrl}/${sheet.distHash}`"
          sandbox="allow-scripts allow-pointer-lock allow-same-origin"
          scrolling="no"
          tabindex="-1"
          allowtransparency="true"
          frameborder="0"
        ></iframe>

        <div v-if="sheet.title || sheet.description" class="details">
          <h4 v-if="sheet.title" class="details__title">{{ sheet.title }}</h4>
          <p v-if="sheet.description" class="details__description">{{ sheet.description }}</p>
        </div>
      </a>

      <div class="actions">
        <div class="link">
          <a v-if="showAuthor" :href="`/${getUsername(sheet)}`">
            <app-avatar
              :style="{ '--size': '2rem' }"
              :hash="sheet.author.avatar"
              :alt="`User @${getUsername(sheet)}`"
              :admin="sheet.author.isAdmin"
            />
          </a>

          <div class="col">
            <a class="title" :href="`/${getUsername(sheet)}/${sheet.slug}`">
              {{ sheet.title || `A project by ${getUsername(sheet)}` }}
            </a>

            <a class="username" v-if="showAuthor" :href="`/${getUsername(sheet)}`">
              {{ sheet.author.name || sheet.author.username }}
            </a>
          </div>
        </div>

        <button class="btn action-btn">
          <i class="material-icons">comment</i>
          {{ sheet.numComments || 0 }}
        </button>
        <button class="btn action-btn">
          <i class="material-icons">
            {{ sheet.liked ? 'favorite' : 'favorite_border' }}
          </i>
          {{ sheet.numLikes || 0 }}
        </button>
      </div>
    </div>

    <nav class="nav" v-if="totalSheets > perPage">
      <nav-btn :to="pageUrl(currPage - 1)" :disabled="!showPrevBtn">
        <i class="material-icons">arrow_back</i>
        Prev
      </nav-btn>
      <nav-btn :icon-right="true" :to="pageUrl(currPage + 1)" :disabled="!showNextBtn">
        Next
        <i class="material-icons">arrow_forward</i>
      </nav-btn>
    </nav>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { IPFS_URL } from '../lib/ipfs'

import AppAvatar from './ui/AppAvatar'
import LoadingIndicator from './ui/LoadingIndicator'
import NavBtn from './ui/NavBtn'

export default {
  components: {
    AppAvatar,
    LoadingIndicator,
    NavBtn
  },

  data: () => ({ loading: true }),

  async mounted () {
    this.loading = true
    const { page, list: type } = this.$route.params
    const { username } = this

    if (username) {
      await this.getUserSheets({ username, page })
    } else {
      await this.getSheets({ page, type })
    }

    this.loading = false
  },

  props: {
    showAuthor: { type: Boolean, default: false },
    username: { type: String },
    perPage: { type: Number, default: 6 },
    ipfsUrl: { type: String, default: IPFS_URL }
  },

  methods: {
    ...mapActions('profile', ['getUserSheets']),
    ...mapActions('homepage', ['getSheets'])
  },

  computed: {
    ...mapState('profile', ['userSheets', 'totalUserSheets']),
    ...mapState('homepage', ['sheets', 'totalSheets']),

    sheetList () {
      return this.username
        ? this.userSheets || []
        : this.sheets
    },

    showPrevBtn () {
      return this.currPage > 1
    },

    currPage () {
      return Number(this.$route.params.page || 1)
    },

    showNextBtn () {
      return this.currPage < this.totalSheets / this.perPage
    },

    getUsername () {
      return sheet => this.username || sheet.author && sheet.author.username
    },

    pageUrl () {
      const { params: { list = 'picks' } } = this.$route
      return page => `/${list === 'public' ? 'picks' : list}/${page || ''}`
    }
  }
}
</script>

<style lang="scss" scoped>
.grid {
  width: 100%; height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 16rem) 1fr;
  grid-gap: 2.5rem;

  &__item {
    height: 100%;
  }
}

.loading {
  grid-area: 1 / 2;
}

.details {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  padding: 1rem;
  background: var(--color-shade);
  transition: all .2s ease;
  opacity: 0;
  color: var(--color-text);

  &:hover {
    opacity: 1;
  }

  &__title{
    font-size: 1.25rem;
    line-height: 1rem;
  }

  &__description {
    font-weight: 400;
    margin-top: .5rem;
    color: var(--color-text-light);
  }
}

.username,
.title {
  max-width: 10rem;
  margin-left: .5rem;
  text-decoration: none;
  color: var(--color-text);

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-weight: bold;
}

.title {
  font-size: .9rem;
}

.username {
  align-self: flex-start;
  opacity: .5;
  font-size: .8rem;
}

.link {
  flex: 1;
  color: white;
  display: flex;
  position: relative;
  text-decoration: none;
}

.iframe-wrapper {
  flex: 1;
  background: white;
  transition: all .2s ease;
  border-radius: .25rem;
  overflow: hidden;
  position: relative;
  // border-radius + overflow chrome bug workaround
  mask-image: radial-gradient(circle, white 100%, black 100%);

  iframe {
    pointer-events: none;
    transform: scale(.501); // right border bug
    transform-origin: 0 0;
    width: 200%;
    height: 200%;
    border: none;
  }
}

.nav {
  grid-column: 2 / 3;
  grid-row: 3;
  display: flex;
  justify-content: space-between;
}

.actions {
  display: flex;
  margin-top: 1rem;
  align-items: center;
}

.action-btn {
  height: auto;
  display: flex;
  align-self: stretch;
  color: var(--color-text-light);
  font-size: .75rem;
  padding: 0 .25rem;

  [class*=icon] {
    color: var(--color-text);
    margin-right: .25rem;
    font-size: .85rem;
  }

  &:first-of-type { margin-left: auto; }
}
</style>
