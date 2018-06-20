<template>
  <section class="section">
    <h1>Save</h1>

    <input placeholder="Untitled Project" type="text">
    <br>
    <textarea placeholder="Description" cols="30" rows="10"></textarea>
    <br>
    <input placeholder="Tags" type="text">
    <br>
    Private <input type="checkbox">

    <br>
    <br>
    <h4>Deploy</h4>
    Url: https://<input type="text">.papel.app
    <button>Deploy</button>

    <br>
    <br>
    <h4>History</h4>
    <ul>
      <li>now - Current progress (Local)</li>
      <li>30 min ago - Add animation <button>load</button></li>
      <li>34 min ago - Create svg logo <button>load</button></li>
    </ul>

    <br>
    <button>Save</button>
  </section>
</template>

<script>
export default {

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
