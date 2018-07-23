<template>
  <div :class="{ 'icon-right': iconRight }">
    <!-- TODO: Refactor -->
    <nuxt-link
      v-if="!href && to"
      v-on="$listeners"
      class="btn row row--ai-center nav-btn"
      :class="{ disabled, shadow }"
      :to="to"
    >
      <slot />
    </nuxt-link>

    <a
      v-on="$listeners"
      v-if="href"
      class="btn row row--ai-center nav-btn"
      :href="href"
    >
      <slot />
    </a>

    <button
      v-if="!href && !to"
      v-on="$listeners"
      :disabled="disabled"
      class="btn row row--ai-center nav-btn"
    >
      <slot />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    to: { type: String },
    href: { type: String },
    disabled: { type: Boolean },
    shadow: { type: Boolean },
    iconRight: { type: Boolean, default: false }
  }
}
</script>


<style lang="scss" scoped>
.nav-btn {
  padding: .5rem 1rem;
  border-radius: .25rem;
  background: var(--color-shade);
  color: var(--color-text);
  text-decoration: none;

  &:hover {
    background: var(--color-accent);
    color: white;
  }

  &:disabled, &.disabled {
    pointer-events: none;
    opacity: .25;
  }
}

[data-theme=light] .shadow {
  box-shadow: var(
    --shadow,
    0 .25rem .75rem -.25rem var(--shadow-color, rgba(0,0,0,.2))
  );
}

.nav-btn, .nav-btn /deep/ {
  font-size: 1rem;
  .material-icons {
    font-size: 1rem;
    margin-right: .5rem;
  }
}

.icon-right /deep/ {
  .material-icons {
    margin-right: 0;
    margin-left: .5rem;
  }
}
</style>
