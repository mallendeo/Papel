<template>
  <div class="grid">
    <div
      v-if="getUsername(sheet)"
      v-for="(sheet, index) of sheets"
      :key="`${sheet.distHash}-${index}`"
      class="grid__item col"
    >
      <nuxt-link class="iframe-wrapper" :to="`/${getUsername(sheet)}/${sheet.slug}`">
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
      </nuxt-link>
      <div class="actions">
        <nuxt-link class="user-link" v-if="showAuthor" :to="`/${getUsername(sheet)}`">
          <img
            class="avatar"
            :src="sheet.author.avatar
              ? `${ipfsUrl}/${sheet.author.avatar}`
              : require('~/assets/icons/user.svg')"
            :alt="`User @${getUsername(sheet)}`"
          >
          <div class="col">
            <span class="name">
              {{ sheet.author.name || getUsername(sheet) }}
            </span>
            <span class="username">@{{ getUsername(sheet) }}</span>
          </div>

        </nuxt-link>

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
      <nav-btn @click="$emit('prev')" :disabled="!showPrevBtn">
        <i class="material-icons">arrow_back</i>
        Prev
      </nav-btn>
      <nav-btn @click="$emit('next')" :disabled="!showNextBtn">
        Next
        <i class="material-icons">arrow_forward</i>
      </nav-btn>
    </nav>
  </div>
</template>

<script>
import { HOST as IPFS_HOST } from '../lib/ipfs'

import NavBtn from './ui/NavBtn'

export default {
  components: {
    NavBtn
  },

  props: {
    showAuthor: { type: Boolean, default: false },
    username: { type: String },
    currPage: { type: Number },
    perPage: { type: Number, default: 6 },
    totalSheets: { type: Number },
    ipfsUrl: { type: String, default: `https://${IPFS_HOST}/ipfs` },
    sheets: { type: Array, required: true }
  },

  computed: {
    showPrevBtn () {
      return this.currPage > 1
    },
    showNextBtn () {
      return this.currPage < this.totalSheets / this.perPage
    },
    getUsername () {
      return sheet => this.username || sheet.author && sheet.author.username
    }
  }
}
</script>

<style lang="scss" scoped>
.grid {
  width: 100%; height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 15rem) 1fr;
  grid-gap: 2.5rem;

  &__item {
    height: 100%;
  }
}

.details {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  padding: 1rem;
  background: var(--color);
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

.avatar {
  width: 1.75rem;
  height: 1.75rem;
  align-self: center;
  border-radius: 50%;
}

.username,
.name {
  margin-left: .5rem;
}

.username {
  align-self: flex-start;
  opacity: .5;
  font-size: .8rem;
}

.user-link {
  flex: 0 0 2rem;
  color: white;
  display: flex;
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

.nav-btn {
  width: 40%;
}

.actions {
  display: flex;
  margin-top: .5rem;
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
