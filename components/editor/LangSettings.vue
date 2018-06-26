<template>
  <div class="settings col" icon="settings" title="">
    <template v-if="lang === 'html'">
      <label>HTML Classes</label>
      <input placeholder="e.g page-home page--active" class="form-control" type="text">

      <label for="html-classes-input">HTML <span>&lt;head&gt;</span> content</label>
      <codemirror
        placeholder="<meta>, <link>, ..."
        v-observe-visibility="visibilityChanged"
        class="editor"
        ref="cm"
        :options="htmlMetaOpts"
        v-model="headContent"
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
import { mapFields } from 'vuex-map-fields'

export default {
  props: {
    lang: { type: String, required: true }
  },
  methods: {
    visibilityChanged () {
      this.codemirror.refresh()
    }
  },
  computed: {
    ...mapState('editor', ['opts']),
    ...mapFields('editor', ['editors.html.headContent']),
    codemirror () {
      return this.$refs.cm.codemirror
    },
    htmlMetaOpts () {
      return {
        ...this.opts,
        styleActiveLine: false,
        lineNumbers: false
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
    font-size: .8rem;
    height: 100%;
    border-radius: .25rem;
    &-gutters { display: none; }
    &-empty {
      color: var(--text-lighter);
    }
  }
}

label {
  margin-bottom: .5rem;
  margin-top: 1rem;
  display: block;
  font-size: .8rem;
  span {
    color: hsl(var(--red-hue), 90%, 60%);
  }
}

.form-control {
  outline: none;
  padding: .5rem 0;
  background: var(--editor-color);
  border: none;
  font-size: .8rem;

  color: var(--text-light);

  &::placeholder {
    color: var(--text-lighter);
  }
}
</style>
