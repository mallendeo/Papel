<template>
  <section
    @dragenter.stop.prevent="isOver = true"
    @dragleave.stop.prevent="isOver = false"
    @dragover.stop.prevent
    @drop.stop.prevent="onDrop"
    @drag.stop.prevent
    @dragstart.stop.prevent
    @dragend.stop.prevent
    :class="{ filedrop: isOver }"
    class="col section"
  >
    <div class="row header">
      <h2 class="title">Files</h2>
      <p class="hint" v-if="!loading">Drag and drop one or more files to upload.</p>
    </div>

    <loading-indicator v-if="loading" />

    <transition name="fade">
      <div v-show="isOver || uploading" class="dropzone">
        <div class="col col--center dropzone__inner">
          <h4 v-if="!uploading">Drop to upload!</h4>
          <h4 v-if="uploading">
            Uploading... <br>You'll be prompted to accept the transaction.
          </h4>
        </div>
      </div>
    </transition>

    <ul class="col list" v-if="!loading && files.length">
      <li
        class="row list__item"
        v-for="file of files"
        :key="`file-${file.id}`"
        v-clipboard:copy="`${ipfsUrl}/${file.hash}`"
        @click="onCopy"
      >
        <strong class="filename">{{ file.name }}</strong>

        <button>
          <i class="material-icons">link</i>
        </button>

        <button @click.stop="removeFile(file)">
          <i class="material-icons">delete</i>
        </button>
      </li>
    </ul>

    <i class="material-icons bg-icon abs-center">folder</i>
  </section>
</template>

<script>
import * as ipfs from '@/lib/ipfs'
import * as blockchain from '@/lib/blockchain'
import { asyncFileReader } from '@/lib/helpers'

import LoadingIndicator from '@/components/ui/LoadingIndicator'

export default {
  components: {
    LoadingIndicator
  },

  data: () => ({
    isOver: false,
    files: [],
    loading: true,
    uploading: false,
    ipfsUrl: ipfs.IPFS_URL
  }),

  mounted () {
    this.loadFiles()
  },

  methods: {
    async loadFiles () {
      this.loading = true
      this.files = await blockchain.getFiles().catch(console.error)
      this.loading = false
    },

    onDragLeave () {
      this.isOver = false
    },

    onCopy () {
      this.$notify({
        group: 'editor',
        title: 'Asset url copied to clipboard'
      })
    },

    async removeFile (file) {
      if (!confirm(`Are you sure you want to remove ${file.name}?`)) return
      await blockchain.removeFile(file.id)
      this.files = this.files.filter(f => f.id !== file.id)
    },

    async onDrop (event) {
      const { files } = event.dataTransfer
      const data = await asyncFileReader(files)
      this.uploading = true

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

      try {
        await blockchain.saveFiles(savedFiles)
        this.$notify({
          group: 'editor',
          title: `${savedFiles.length ? 'Files' : 'File'} successfully uploaded.`
        })
        this.loadFiles()
      } catch (e) {
        console.error(e)
      } finally {
        this.uploading = false
        this.isOver = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.section {
  padding: 1rem;
  height: 100%;
  position: relative;

  &.filedrop * { pointer-events: none; }
}

.bg-icon {
  font-size: 4rem;
  width: 4rem; height: 4rem;
  opacity: .1;
}

.header { align-items: center; }
.title { margin-right: 1rem; }
.filename { margin-right: auto; }
.hint {
  opacity: .5;
  font-size: .75rem;
}

.dropzone {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: var(--color-editor-dark);
  z-index: 9;
  padding: 2rem;

  &__inner {
    width: 100%; height: 100%;
    margin: auto;
    border: 1px dashed var(--color-editor-accent);
    border-radius: .5rem;
    text-align: center;
  }
}

.list {
  z-index: 8;
  word-wrap: break-word;
  padding-bottom: 2rem;
  margin-top: 1rem;
  overflow: auto;

  &__item {
    font-size: .9rem;
    color: var(--color-text-light);
    position: relative;
    flex-shrink: 0;
    padding: .25rem 1rem;
    border-radius: .25rem;
    cursor: pointer;

    button { opacity: 0; }

    &:hover {
      background: var(--color-editor-light);
      button { opacity: 1; }
    }

    .material-icons {
      font-size: .9rem;
      color: var(--color-text-light);
    }
  }
}
</style>
