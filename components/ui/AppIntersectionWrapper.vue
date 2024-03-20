<template>
  <div ref="observedElement">
    <slot/>
    <!-- Your content here -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// Define the reference to the element
const observedElement = ref<HTMLElement | null>(null);

// Define the event emitter
const emit = defineEmits<{
  (e: "elementVisible"): void
}>();

function getLastRecordElement() {
  return document.querySelector('.history__block__date:last-child');
}

function observeLastElement() {
  const lastRecordElement = getLastRecordElement();
  if (lastRecordElement) {
    lastRecordObserver.observe(lastRecordElement);
  }
}

let observer: IntersectionObserver;

onMounted(() => {
  if (!observedElement.value) return;

  observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;

    emit("elementVisible");
    observer.unobserve(lastCard.target);
  }, {
    // Adjust the root and rootMargin as needed
    root: null,
    rootMargin: '0px',
    threshold: 1.0 // Trigger when the element is fully visible
  });

  // Start observing the element
  observer.observe(observedElement.value);
});

onUnmounted(() => {
  // Disconnect the observer
  if (observer) observer.disconnect();
});
</script>