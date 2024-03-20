<script setup lang="ts">
import type PostEntity from "~/types/post.entity";
import AppIntersectionWrapper from "~/components/ui/AppIntersectionWrapper.vue";
import {parseLinkHeaderAndGetLastPage} from "~/utils/json-api-utils";
import CommentEntity from "~/types/comment.entity";

interface Props {
    post: PostEntity;
}
const props = defineProps<Props>();

const isLoading: Ref<boolean> = ref(true);
const activePage: Ref<number> = ref(1);
const lastPage: Ref<number> = ref(1);
const isFullyLoaded: Ref<boolean> = ref(false);
const comments: Ref<CommentEntity[]> = ref([]);
const search: Ref<string> = useDebouncedRef('', 500, () => {
    activePage.value = 1;
    comments.value = [];
    isFullyLoaded.value = false;

    observeLastElement();
    getComments();

});

let lastRecordObserver: IntersectionObserver | null = null;

function getLastRecordElement() {
  return document.querySelector('.post-comments__item:last-child');
}

function observeLastElement() {
  console.log(lastRecordObserver);
  if(!lastRecordObserver) return

  const lastRecordElement = getLastRecordElement();
  if (lastRecordElement) {
    lastRecordObserver.observe(lastRecordElement);
  }
}

function getComments() {
  if(isFullyLoaded.value) return;

  isLoading.value = true;

  fetch(`${import.meta.env.VITE_API_URL}/comments?postId=${props.post.id}&_page=${activePage.value}&_limit=5&fullName_like=${search.value}`)
      .then(async (res) => {
        lastPage.value = parseLinkHeaderAndGetLastPage(res.headers.get('link'));

        if(activePage.value === lastPage.value) {
          isFullyLoaded.value = true;
        }
        const data: CommentEntity[] = await res.json();
        comments.value = [...comments.value, ...data];
        return res;
      })
      .finally(() => {
        isLoading.value = false;
      });

}


onMounted(async () => {
  await getComments();

  lastRecordObserver = new IntersectionObserver(async (entries) => {
    const lastCard = entries[0];
    console.log(lastCard);
    if (!lastCard.isIntersecting) return;

    await getComments();

    if(lastRecordObserver) {
      lastRecordObserver.unobserve(lastCard.target);
    }

    if (activePage.value <= lastPage.value) {
      observeLastElement();
    }
  });

  observeLastElement();
});
</script>

<template>
  <div class="post-comments">
    <h4 class="post-comments__title">Comments</h4>
    <v-text-field
        class="post-comments__search"
        v-model="search"
        label="Search"
        outlined
        variant="solo"
        append-inner-icon="mdi-magnify"
    />
    <v-alert
        v-if="isFullyLoaded && comments.length === 0"
        type="info"
        class="post-comments__no-records"
        variant="tonal"
        text="No comments yet."
    />

    <div class="post-comments__list">
      <v-card
          class="post-comments__item"
          v-for="(comment, index) in comments"
          :key="index"
      >
        <v-card-title>
          {{ comment.fullName }}
        </v-card-title>
        <v-card-text class="mb-0">
          {{ comment.body }}
        </v-card-text>
      </v-card>

    </div>

    <template v-if="isLoading">
      <v-skeleton-loader
          type="heading,text@2"
          v-for="i in 5"
          :key="i"
      />
    </template>
  </div>
</template>

<style lang="scss">
.post-comments {
  &__title {
    margin-bottom: 20px;
    font-size: 24px;
  }
  &__search {
    margin: 15px 0;
  }
  &__item {
    margin-bottom: 15px;
  }
}
</style>