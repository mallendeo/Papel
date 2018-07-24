<template>
  <section class="col">
    <loading-indicator class="page-loading" v-if="!loggedUser" />

    <transition name="fade">
      <form
        @submit.prevent="updateProfile"
        v-if="loggedUser"
        class="col form"
      >
        <h1 class="title">Edit Profile</h1>

        <drop-zone
          @error="onError"
          @dragenter="onDragEnter"
          @uploading="onUploading"
          @uploaded="onUploaded"
          :filter="filesFilter"
          :single="true"
        >
          <loading-indicator
            :style="{ '--color': 'var(--color-accent)' }"
            class="abs-center"
            v-if="uploading"
          />
          <app-avatar
            :style="{
              '--size': '5rem',
              opacity: uploading ? .5 : 1
            }"
            v-if="loggedUser"
            :hash="loggedUser.avatar"
          />
        </drop-zone>

        <app-input
          :float-placeholder="true"
          placeholder="Username"
          v-model="username"
          :disabled="fetching"
          pattern="^[a-zA-Z0-9_-]*$"
          ref="usernameInput"
        />
        <app-input
          :float-placeholder="true"
          placeholder="Full Name"
          :disabled="fetching"
          v-model="name"
        />
        <app-input
          :float-placeholder="true"
          placeholder="Bio / About you"
          :disabled="fetching"
          v-model="bio"
        />

        <action-btn
          :loading="fetching"
          :show-loading="true"
          :disabled="fetching"
        >Save</action-btn>
      </form>
    </transition>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import AppAvatar from '@/components/ui/AppAvatar'
import AppInput from '@/components/ui/AppInput'
import ActionBtn from '@/components/ui/ActionBtn'
import DropZone from '@/components/DropZone'
import LoadingIndicator from '@/components/ui/LoadingIndicator'

export default {
  components: {
    AppAvatar,
    AppInput,
    ActionBtn,
    DropZone,
    LoadingIndicator
  },

  data () {
    return {
      fetching: false,
      uploading: false
    }
  },

  computed: {
    ...mapState('homepage', ['loggedUser']),
    ...mapFields('homepage', [
      'loggedUser.avatar',
      'loggedUser.username',
      'loggedUser.name',
      'loggedUser.bio'
    ])
  },

  methods: {
    filesFilter (files) {
      const allowed = ['jpg', 'jpeg', 'png']
      return files.filter(file =>
        allowed.find(format =>
          file.name.endsWith(format)
        )
      ).length
    },

    onError (event) {
      console.log('onError', event)
    },
    onDragEnter (event) {
      console.log('onDragEnter', event)
    },
    onUploading (event) {
      this.uploading = true
      console.log('onUploading', event)
    },
    onUploaded ([file]) {
      console.log({file})
      this.uploading = false
      this.avatar = file.hash
    },

    ...mapActions('profile', ['getProfile', 'saveProfile']),

    async updateProfile () {
      const { username, name, bio, avatar } = this
      const { username: currUsername } = this.$route.params

      const input = this.$refs.usernameInput
      if (!username) return input.showError('Username required!')

      this.fetching = true
      if (currUsername !== username && await this.getProfile(username)) {
        input.showError('Username is taken.')
        this.fetching = false
        return
      }

      try {
        await this.saveProfile({ username, name, bio, avatar })
        this.$router.replace({ params: { username } })
      } catch (err) {
        console.error(err)
      } finally {
        this.fetching = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar /deep/ {
  .image-wrapper {
    box-shadow: 0 .5rem 4rem rgba(0,0,0,.4);
  }
}

.dropzone {
  position: relative;
  margin-bottom: 2rem;
}

.title {
  color: var(--color-text);
  margin-bottom: 4rem;
}

.avatar {
  opacity: .2;
}

.form {
  align-items: center;
  margin: 2rem auto;
  width: 15rem;
}

.input-wrapper {
  margin-bottom: .75rem;
  width: 100%;
}

button.action-btn {
  margin-top: 1rem;
  align-self: flex-end;
}
.loading {
  z-index: 9;
}
.page-loading {
  margin-top: 4rem;
}
</style>
