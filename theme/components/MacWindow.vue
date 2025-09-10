<template>
  <div class="mac-window" v-bind="$attrs">
    <div class="mac-titlebar">
      <div class="mac-buttons">
        <div class="mac-button close"></div>
        <div class="mac-button minimize"></div>
        <div class="mac-button maximize"></div>
      </div>
      <div class="mac-title">{{ title }}</div>
    </div>
    <div class="mac-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
}

defineProps<Props>();

// Disable automatic attribute inheritance since we're manually binding them
defineOptions({
  inheritAttrs: false,
});
</script>
