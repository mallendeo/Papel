<template>
  <div class="sheets">
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
        </nuxt-link>

        <nuxt-link class="user-link" v-if="showAuthor" :to="`/${getUsername(sheet)}`">
          <img
            v-if="sheet.author.avatar"
            :src="`${ipfsUrl}/${sheet.author.avatar}`"
            :alt="`User @${getUsername(sheet)}`"
          >
          @{{ getUsername(sheet) }}
        </nuxt-link>
      </div>
    </div>

    <nav v-if="totalSheets > perPage">
      <button
        @click="$emit('prev')"
        :disabled="!showPrevBtn"
      >Prev</button>
      <button
        @click="$emit('next')"
        :disabled="!showNextBtn"
      >Next</button>
    </nav>
  </div>
</template>

<script>
import { HOST as IPFS_HOST } from '../lib/ipfs'

export default {
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 12rem;
  grid-gap: 1.5rem;
  padding: 1rem;
  width: 100%;
  max-width: 54rem;

  &__item {
    height: 100%;
    border: 1px solid #f0f0f0;
    transition: all .1s ease;
    will-change: box-shadow, transform;
    border-radius: .5rem;
    overflow: hidden;
    background: var(--editor-color);

    &:hover {
      transform: translateY(-.15rem);
      box-shadow: 0 .5rem 1rem -.4rem rgba(0,0,0,.1);
    }
  }
}

.user-link {
  flex: 0 0 2rem;
  color: white;
}

.iframe-wrapper {
  flex: 1;
  background: white;

  iframe {
    pointer-events: none;
    transform: scale(.5);
    transform-origin: 0 0;
    width: 200%;
    height: 200%;
  }
}
</style>
