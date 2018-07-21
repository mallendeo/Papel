<template>
  <section class="section">
    <h1>Save</h1>
    Private <input type="checkbox">

    <a
      v-if="rootIpfsHash"
      :href="`https://ipfs.infura.io/ipfs/${rootIpfsHash}/dist`"
      target="_blank"
    >Preview</a>

    <input placeholder="Untitled Project" type="text">
    <br>
    <textarea placeholder="Description" cols="30" rows="10"></textarea>
    <br>

    <button>Save</button>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('sheet', ['rootIpfsHash'])
  }
}
</script>

<style lang="scss" scoped>
.section {
  padding: 1rem;
}
button {
  color: white;
  border: 1px solid white;
}
</style>
