<template>
  <section class="col section">
    <div class="row header">
      <h1 class="title">Save</h1>

      <div class="row">
        Private
        <icon-toggle
          @click="toggleVisibility"
          :on="!isPublic"
          :icons="['', 'lock']"
          :style="{
            '--toggle-bg': 'var(--color-editor-dark)',
            '--toggle-bg--on': 'var(--color-editor-light)',
            '--thumb-bg': 'var(--color-editor-light)',
            '--thumb-bg--on': 'var(--color-editor-accent)'
          }"
        />
      </div>
    </div>

    <app-input
      :float-placeholder="true"
      placeholder="Project title"
      type="text"
      v-model="title"
    />
    <app-input
      :textarea="true"
      :float-placeholder="true"
      placeholder="Description"
      v-model="description"
    />

    <div class="row row--jc-between row--ai-end">
      <a
        v-if="rootIpfsHash"
        class="link"
        :href="`https://infura-ipfs.io/ipfs/${rootIpfsHash}/dist`"
        target="_blank"
      >Full page preview</a>

      <action-btn
        :show-loading="true"
        @click.native="onSave"
        :loading="isSaving"
        :disabled="isSaving"
      >Save</action-btn>
    </div>

    <button class="remove row row--ai-center" @click="onRemove">
      <i title="Remove" class="material-icons">delete</i>
    </button>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import AppInput from '../ui/AppInput'
import ActionBtn from '../ui/ActionBtn'
import IconToggle from '../ui/IconToggle'

export default {
  components: {
    AppInput,
    ActionBtn,
    IconToggle
  },
  data () {
    const { slug } = this.$route.params

    return { slug }
  },
  computed: {
    ...mapState('sheet', ['rootIpfsHash', 'isSaving']),
    ...mapFields('sheet', ['isPublic', 'title', 'description'])
  },
  methods: {
    ...mapActions('sheet', [
      'saveIpfs',
      'removeSheet',
      'saveOnNebulas'
    ]),

    toggleVisibility () {
      this.isPublic = !this.isPublic
    },

    async onRemove () {
      const remove = confirm(`Are you sure you want to remove ${this.slug}?`)
      if (remove) {
        await this.removeSheet(this.slug)
        this.$router.push('/')
      }
    },

    async onSave () {
      this.$notify({
        group: 'editor',
        title: 'Saving project'
      })

      try {
        await this.saveIpfs(this.slug)
        await this.saveOnNebulas(this.slug)
        this.$notify({
          group: 'editor',
          type: 'success',
          title: 'Project saved!'
        })
      } catch (err) {
        this.$notify({
          group: 'editor',
          type: 'error',
          title: 'Error while saving project',
          text: typeof err === 'string' ? err : err.message
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.section { padding: 1rem; }
.toggle { margin-left: 1rem; }

.header {
  justify-content: space-between;
  margin-bottom: 1rem;
}

.align-right { align-self: flex-end; }
.link { color: var(--color-text); }
.remove {
  border: none;
  color: var(--color-text-lighter);
  align-self: flex-start;
  margin: auto 0 -.35rem -.5rem;
  i { font-size: 1rem; }
}


.input-wrapper {
  margin-bottom: .5rem;
  --color-darker: var(--color-editor-dark);
}

button.action-btn {
  border: none;
  --color-accent: var(--color-editor-accent);
  margin-top: 1rem;
  margin-left: auto;
}

button {
  color: white;
  border: 1px solid white;
}
</style>
