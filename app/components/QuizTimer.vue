<template>
  <div class="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
    <p class="text-sm text-amber-800">Time limit</p>
    <p class="text-2xl font-semibold text-amber-900">{{ displayTime }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  seconds: number;
}>();

const displayTime = computed(() => {
  const minutes = Math.floor(props.seconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (props.seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
});
</script>
