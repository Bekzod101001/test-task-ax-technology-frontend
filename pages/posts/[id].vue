<script setup lang="ts">
import type PostEntity from "~/types/post.entity.js";
import PostSingleSkeleton from "~/components/workspace/PostSingleSkeleton.vue";
import PostComments from "~/components/workspace/PostComments.vue";

const route = useRoute();
const postId: number = Number(route.params.id as string);

const {
  data: post,
  error,
  pending
} = useFetch<PostEntity>(`${import.meta.env.VITE_API_URL}/posts/${postId}`)


</script>

<template>
  <div class="post">
    <v-btn
      class="post__back-btn"
      to="/posts"
      width="100px"
    >
      <v-icon>
        mdi-chevron-left
      </v-icon>
      Back
    </v-btn>

    <post-single-skeleton v-if="pending"/>
    <template v-else>
      <v-img
          :src="post.featuredImage"
          height="400"
          cover
      />

      <h2 class="post__title">{{ post.title }}</h2>

      <div class="post__meta">
        <span>Views: {{ post.views }}</span>
      </div>

      <div class="post__body">
        {{ post.body }}
      </div>

      <post-comments class="post__comments" :post="post!" />

    </template>


  </div>
</template>

<style lang="scss">
.post {
  padding: 60px 0;
  &__back-btn {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }
  &__title {
    margin-top: 30px;
  }
  &__meta {
    font-size: 12px;
    color: #ccc;
    margin: 15px 0;
  }
  &__body {
    line-height: 1.5;
  }
  &__comments {
    margin-top: 60px;
    padding-top: 60px;
    border-top: 1px solid #363636;
  }
}
</style>