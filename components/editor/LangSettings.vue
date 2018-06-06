<template>
  <div class="settings col" icon="settings" title="">
    <template v-if="lang === 'html'">
      <label>HTML Classes</label>
      <input placeholder="e.g page-home page--active" class="form-control" type="text">

      <label for="html-classes-input">HTML <span>&lt;head&gt;</span> content</label>
      <codemirror
        class="editor"
        :options="htmlMetaOpts"
        @input="val => {}"
      ></codemirror>
    </template>

    <template v-if="lang === 'css'">
      <label class="form-group">
        Use autoprefixer
        <input type="checkbox">
      </label>

      <label class="form-group">
        Use reset
        <label>
          Normalize
          <input type="radio" name="css-reset">
        </label>
        <label>
          Reset
          <input type="radio" name="css-reset">
        </label>
        <label>
          None
          <input type="radio" name="css-reset">
        </label>
      </label>


    </template>

    <template v-if="lang === 'js'">
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    lang: { type: String, required: true }
  },
  computed: {
    ...mapState('editor', ['opts']),
    htmlMetaOpts () {
      return {
        ...this.opts,
        styleActiveLine: false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.settings {
  padding: 0 1rem 1rem;
  font-size: 1rem;
}

.title {
  font-weight: normal;
  font-size: 1rem;
}

.editor {
  flex: 1;
  height: 7rem;
  /deep/ .CodeMirror {
    height: 100%;
    border-radius: .25rem;
  }
}

label {
  margin-bottom: .5rem;
  margin-top: 1rem;
  display: block;
  span {
    color: hsl(var(--red-hue), 90%, 60%);
  }
}

.form-control {
  outline: none;
  padding: .5rem 1rem;
  background: var(--editor-color);
  border: none;
  border-radius: .25rem;

  color: var(--text-light);

  &::placeholder {
    color: var(--text-lighter);
  }
}
</style>
