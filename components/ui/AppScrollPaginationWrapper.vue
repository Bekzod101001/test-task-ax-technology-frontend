<template>
  <div ref="observedElement">
    <slot/>
    <div ref="trigger"/>
  </div>
</template>

<script setup lang="ts">
// TODO:
//  it would be much better to implement itemsProvider prop which will handle data loading
//  and handle all pagination logic here, but im running out of time

import { ref, onMounted, onUnmounted } from 'vue';


const emits = defineEmits(['lastItemObserve']);

const trigger = ref<HTMLElement | null>(null);

const lastRecordObserver: IntersectionObserver | null = null;
onMounted(() => {
  const lastRecordObserver = new IntersectionObserver(async (entries) => {
    const lastItem = entries[0];
    if (!lastItem.isIntersecting) return;

    emits('lastItemObserve');
  });

  lastRecordObserver.observe(trigger.value);
});

onUnmounted(() => {
  // Disconnect the observer
  if (lastRecordObserver) lastRecordObserver.disconnect();
});
</script>