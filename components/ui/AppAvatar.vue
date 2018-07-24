<template>
  <div class="avatar">
    <div class="image-wrapper">
      <img
        class="image"
        :alt="alt"
        :src="hash
          ? `${ipfsUrl}/${hash}`
          : require('~/assets/icons/user.svg')"
      >
    </div>

    <img
      v-if="admin"
      class="addon"
      src="~/assets/icons/crown.svg"
      alt="Crown"
    >
  </div>
</template>

<script>
import { IPFS_URL } from '@/lib/ipfs'

export default {
  props: {
    hash: { type: String },
    alt: { type: String },
    admin: { type: Boolean, default: false }
  },
  data: () => ({ ipfsUrl: IPFS_URL })
}
</script>

<style lang="scss" scoped>
.avatar {
  position: relative;
}

.addon {
  width: 1rem;
  position: absolute;
  left: .9rem;
  bottom: 0;
}

.image {
  &-wrapper {
    --s: var(--size, 4rem);
    width: var(--s); height: var(--s);
    border-radius: 50%;
    overflow: hidden;
  }

  min-width: 100%;
  height: 100%;
}
</style>

