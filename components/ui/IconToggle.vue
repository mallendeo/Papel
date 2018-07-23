<template>
  <div
    v-on="$listeners"
    class="toggle"
    :class="{ 'toggle--on': on }"
  >
    <div class="thumb"></div>
    <i class="material-icons" :class="{ fade: on }">{{ icons[0] || '' }}</i>
    <i class="material-icons" :class="{ fade: !on }">{{ icons[1] || '' }}</i>
  </div>
</template>

<script>
export default {
  props: {
    icons: { type: Array, default: () => [] },
    on: { type: Boolean, default: false }
  }
}
</script>

<style lang="scss" scoped>
$height: 1.5rem;

.toggle {
  width: $height * 2;
  height: $height;
  display: flex;
  position: relative;

  justify-content: space-around;
  align-items: center;

  color: var(--toggle-color, white);
  background: var(--toggle-bg, #292D3D);
  border-radius: $height / 2;
  cursor: pointer;
  user-select: none;

  &--on {
    background: var(--toggle-bg--on, #e2e2e2);
    .thumb {
      transform: translateX(100%);
      background: var(--thumb-bg--on, var(--color-accent));
    }
  }

  .material-icons {
    font-size: $height / 2;
    z-index: 1;
    width: $height;
    text-align: center;
    transition: opacity .2s ease;
  }
}

.fade {
  opacity: .5;
}

.thumb {
  height: $height;
  width: $height;
  position: absolute;
  border-radius: $height / 2;
  left: 0;
  background: var(--thumb-bg, var(--color-accent));
  transition: transform .2s ease;
}
</style>
