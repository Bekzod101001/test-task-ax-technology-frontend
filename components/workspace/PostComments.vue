<script setup lang="ts">
import type PostEntity from "~/types/post.entity";
import {parseLinkHeaderAndGetLastPage} from "~/utils/json-api-utils";
import CommentEntity from "~/types/comment.entity";
import AppScrollPaginationWrapper from "~/components/ui/AppScrollPaginationWrapper.vue";
import {Ref} from "vue";

interface Props {
    post: PostEntity;
}
const props = defineProps<Props>();

const isLoading: Ref<boolean> = ref(true);
const activePage: Ref<number> = ref(1);
const lastPage: Ref<number> = ref(1);
const isFullyLoaded: Ref<boolean> = ref(false);
const comments: Ref<CommentEntity[]> = ref([]);

const route = useRoute();
const router = useRouter();
const savedSearchInQuery = route.query.q as string ?? '';
const search: Ref<string> = useDebouncedRef(savedSearchInQuery, 500, () => {
    router.push({
      query: { q: search.value },
    });
    activePage.value = 1;
    comments.value = [];
    isFullyLoaded.value = false;
    getComments();
});

function getCommentsApi(params: {
  postId: number;
  _page: number;
  _limit: number;
  fullName_like?: string;
}) {
  const url = new URL(`${import.meta.env.VITE_API_URL}/comments`);

  const searchParams = {
    postId: params.postId.toString(),
    _page: params._page.toString(),
    _limit: params._limit.toString(),
    ...(params.fullName_like ? { fullName_like: params.fullName_like } : {}),
  };
  url.search = new URLSearchParams(searchParams).toString();

  // TODO - implement fetch & useFetch wrapper as separate reusable functions
  return fetch(url);
}

function getComments() {
  if(isFullyLoaded.value) return;

  isLoading.value = true;

  const params = {
    postId: props.post.id,
    _page: activePage.value,
    _limit: 5,
    fullName_like: search.value,
  }

  getCommentsApi(params)
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

function getMoreComments() {
  if(activePage.value < lastPage.value) {
    activePage.value++;
  }
  getComments();
}

onMounted(async () => {
  await getComments();

});
</script>

<template>
  <div class="post-comments">
    <h4 class="post-comments__title">Comments</h4>
    <v-text-field
        class="post-comments__search"
        v-model="search"
        label="Search by full name"
        outlined
        variant="solo"
        append-inner-icon="mdi-magnify"
    />
    <v-alert
        v-if="!isLoading && comments.length === 0"
        type="info"
        class="post-comments__no-records"
        variant="tonal"
        text="No comments yet."
    />
    <app-scroll-pagination-wrapper
        @last-item-observe="getMoreComments"
        class="post-comments__list"
    >
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

    </app-scroll-pagination-wrapper>

    <template v-if="isLoading">
      <v-skeleton-loader
          type="heading,text@2"
          v-for="i in 5"
          class="post-comments__item"
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