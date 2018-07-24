<template>
  <div
    @dragenter.stop.prevent="onDragEnter"
    @dragleave.stop.prevent="onDragLeave"
    @dragover.stop.prevent
    @drop.stop.prevent="onDrop"
    @drag.stop.prevent
    @dragstart.stop.prevent
    @dragend.stop.prevent
    class="dropzone"
    :class="{
      highlight,
      'highlight--over': isOver
    }"
  >
    <div :class="{ 'no-events': isOver }">
      <slot />
    </div>
    <small
      v-if="showMessage"
      class="abs-center message"
    >{{ !isOver ? 'Drag & drop an image' : 'Drop to upload' }}</small>
  </div>
</template>

<script>
import isFunction from 'lodash/isFunction'
import * as ipfs from '@/lib/ipfs'
import { asyncFileReader } from '@/lib/helpers'

/**
 * Events:
 *  - error
 *  - dragenter
 *  - uploading
 *  - uploaded
 *  - uploaderror
 */
export default {
  props: {
    single: { type: Boolean, default: false },
    showMessage: { type: Boolean, default: false },
    highlight: { type: Boolean, default: false },
    filter: { type: Function }
  },

  data: () => ({
    isOver: false,
    files: [],
    uploading: false,
    ipfsUrl: ipfs.IPFS_URL
  }),

  methods: {
    onDragLeave () {
      this.$emit('dragleave')
      this.isOver = false
    },

    onDragEnter (event) {
      const { files } = event.dataTransfer
      this.$emit('dragenter', files)
      this.isOver = true
    },

    async onDrop (event) {
      const { files } = event.dataTransfer

      if (isFunction(this.filter) && !this.filter([...files])) {
        this.$emit('error', Error('Files not allowed'))
      }

      if (this.single && files.length > 1) {
        this.$emit('error', Error('Only one file is allowed'))
        return false
      }

      const data = await asyncFileReader(files)
      this.uploading = true

      this.$emit('uploading', files)

      try {
        const savedIpfs = await ipfs.saveFiles(
          [...files].map((file, index) => ({
            path: file.name,
            content: data[index]
          }))
        )

        const savedFiles = [...files].map((file, index) => ({
          name: file.name,
          type: file.type,
          size: savedIpfs[index].size,
          hash: savedIpfs[index].hash
        }))

        this.$emit('uploaded', savedFiles)
      } catch (err) {
        this.$emit('uploaderror', err)
      } finally {
        this.uploading = false
        this.isOver = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.highlight {
  position: relative;
  --color: var(--color-lighter);
  padding: 1rem 2rem;

  border: 1px dashed var(--color);
  border-radius: .25rem;

  &--over {
    --color: var(--color-accent, var(--color-editor-accent));
  }
}

.message {
  position: absolute;
  top: calc(100% + .5rem);
  font-size: .8rem;
  color: var(--color-text);
  text-align: center;
}
</style>
