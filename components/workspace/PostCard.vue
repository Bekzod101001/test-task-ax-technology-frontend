<script setup lang="ts">

import type PostEntity from "~/types/post.entity";

interface Props {
    post: PostEntity;
}
const props = defineProps<Props>();
</script>
<template>
    <v-card
      class="post-card"
      width="100%"
      :to="`/posts/${post.id}`"
    >
        <lazy-nuxt-img
          :src="post.featuredImage"
          class="post-card__image"
        />
        <div class="post-card__text-content">
          <v-card-title class="post-card__title">
            {{ post.title }}
          </v-card-title>

          <v-card-text class="post-card__description">
            {{ post.description }}
          </v-card-text>

          <v-card-subtitle>
            Views: {{ post.views }}
          </v-card-subtitle>
        </div>

    </v-card>
</template>

<style lang="scss">
.post-card {
  &__image {
    object-fit: cover;
    height: 200px;
    width: 100%;
  }
  &__text-content {
    padding: 15px;
  }
  &__title {
    white-space: pre-wrap!important;
    font-size: 16px;
  }
  &__description {
    min-height: 80px;
  }
}
</style>