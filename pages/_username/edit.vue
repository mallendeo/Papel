<template>
  <section class="col section wrapper">
    <h1>Profile</h1>
    <img
      v-if="loggedUser"
      class="avatar"
      :src="loggedUser.avatar
        ? `${ipfsUrl}/${loggedUser.avatar}`
        : require('~/assets/icons/user.svg')"
    >
    <div v-if="loggedUser" class="col form">
      <app-input
        placeholder="Username"
        :value="username"
        v-model="username"
      />
      <app-input placeholder="Full Name" v-model="name" />
      <app-input placeholder="Bio / About you" v-model="bio" />

      <action-btn>Save</action-btn>
    </div>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import AppInput from '@/components/ui/AppInput'
import ActionBtn from '@/components/ui/ActionBtn'

export default {
  components: {
    AppInput,
    ActionBtn
  },
  computed: {
    ...mapState('homepage', ['loggedUser']),
    ...mapFields('homepage', [
      'loggedUser.username',
      'loggedUser.name',
      'loggedUser.bio'
    ])
  }
}
</script>

<style scoped>
.form {
  margin: 2rem auto;
  width: 15rem;
}

.input-wrapper {
  margin-bottom: .5rem;
}
</style>
