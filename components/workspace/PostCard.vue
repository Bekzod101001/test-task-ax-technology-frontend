<script setup lang="ts">

import type PostEntity from "~/types/post.entity";

interface Props {
    post: PostEntity;
}
const props = defineProps<Props>();
</script>
<template>

  <nuxt-link
    :to="`/posts/${post.id}`"
    class="post-card"
  >
      <lazy-nuxt-img
        :src="post.featuredImage"
        class="post-card__image"
      />
      <div class="post-card__text-content">
        <h3 class="post-card__title">
          {{ post.title }}
        </h3>

        <p class="post-card__description">
          {{ post.description }}
        </p>

        <span class="post-card__stats">
          Views: {{ post.views }}
        </span>
      </div>


  </nuxt-link>
</template>

<style lang="scss">
.post-card {
  text-decoration: none;
  color: #fff;
  display: block;
  transition: transform 0.3s;
  &:hover {
    transform: translateY(-5px);
  }
  &__image {
    object-fit: cover;
    height: 200px;
    width: 100%;
  }
  &__text-content {
    padding: 15px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    background-color: #232323;
  }
  &__title {
    white-space: pre-wrap!important;
    font-size: 18px;
    line-height: 1.5;
    font-weight: bold;
  }
  &__description {
    font-size: 14px;
    min-height: 80px;
    margin: 10px 0;
  }
  &__stats {
    font-size: 12px;
    display: block;
    color: #f5f5f5;
    margin-top: auto;
  }
}
</style>