<script setup lang="ts">

</script>

<template>
  <div class="post-skeleton">
    <v-skeleton-loader
        type="image"
        min-height="400px"
    />
    <v-skeleton-loader
        type="heading"
        height="64px"
        class="my-4"
        width="100%"
    />
    <v-skeleton-loader
      type="text"
      class="mb-4"
      width="150px"
    />

    <v-skeleton-loader
        height="200px"
        width="100%"
        type="text@6"
    />
  </div>
</template>

<style scoped lang="scss">

</style>