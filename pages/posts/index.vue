<script setup lang="ts">

import type PostEntity from "~/types/post.entity";
import PostCard from "~/components/workspace/PostCard.vue";
import PaginatedItems from "~/types/paginated-items";
import paginatedItemsSkeleton from "~/constants/paginated-items-skeleton";
import {deepClone} from "~/utils/utils";
import {parseLinkHeaderAndGetLastPage} from "~/utils/json-api-utils";
import {Ref} from "vue";
import AppPagination from "~/components/ui/AppPagination.vue";

export type Sort = {
  text: string;
  key: SortByEnum;
  type: SortTypeEnum;
}
enum SortByEnum {
  VIEWS = 'views',
  TITLE = 'title',
}
enum SortTypeEnum {
  ASC = 'asc',
  DESC = 'desc',
}

const activePage: Ref<number> = ref(1);
const lastPage = useState('postLastPage', () => 1);
const perPage: Ref<number> = ref(6);

const router = useRouter();
const route = useRoute();
const sorts: Sort[] = reactive([
  {
    text: 'Name - Ascending',
    key: SortByEnum.TITLE,
    type: SortTypeEnum.ASC,
  },
  {
    text: 'Name - Descending',
    key: SortByEnum.TITLE,
    type: SortTypeEnum.DESC,
  },
  {
    text: 'Views - Ascending',
    key: SortByEnum.VIEWS,
    type: SortTypeEnum.ASC,
  },
  {
    text: 'Views - Descending',
    key: SortByEnum.VIEWS,
    type: SortTypeEnum.DESC,
  },
]);

const sort: {
  type: SortTypeEnum | null;
  by: SortByEnum | null;
} = reactive({
  type: null,
  by: null,
})


const search = useDebouncedRef(route.query.q as string ?? '', 500, () => {
  router.push({ query: { q: search.value } });
});

const computedQuery = computed(() => {
  return {
    _page: activePage.value,
    _limit: perPage.value,
    _sort: sort.by,
    _order: sort.type,
    title_like: search.value
  }
})
const {
  data: posts,
  pending,
} = useFetch<PostEntity[]>(`${import.meta.env.VITE_API_URL}/posts`, {
  query: computedQuery,
  async onResponse({ request, response, options }) {
    console.log(response);
    lastPage.value = parseLinkHeaderAndGetLastPage(response.headers.get('Link'));
    console.log(lastPage.value);
  },
  async onResponseError({ request, response, options }) {
    console.log(response);
  },
  default: () => [],
  watch: [activePage, perPage, sort, search],
})

function setSort(selectedSort: Sort | null) {
  sort.type = selectedSort ? selectedSort.type : null;
  sort.by = selectedSort ? selectedSort.key : null;
}


watch([sort, search], () => {
  activePage.value = 1;
})

</script>

<template>
  <div class="posts">
    <div class="posts__header">
      <h2 class="posts__header__title">Posts</h2>
      <div class="posts__header__params">
        <div class="posts__header__sort">
          <v-select
              :items="sorts"
              @update:modelValue="setSort"
              item-title="text"
              return-object
              label="Sort by"
              hide-details
              variant="solo"
          />

        </div>
        <div class="posts__header__per-page">

          <v-select
              v-model="perPage"
              :items="[6, 12, 24]"
              label="Per page"
              hide-details
              variant="solo"
          />
        </div>
      </div>

    </div>

    <v-text-field
      width="100%"
      height="60px"
      variant="solo"
      v-model="search"
      placeholder="Search..."
      class="my-6"
      append-inner-icon="mdi-magnify"
    />
    <v-row
      :class="[
        'posts__row',
        {
          'posts__row_loading': pending,
        }
      ]"
    >
      <v-col
        cols="4"
        v-for="post in posts"
        :key="post.id"
      >
        <post-card :post="post" />
      </v-col>
    </v-row>
    <v-alert
      v-if="!pending && !posts.length"
      type="info"
      text="No posts found."
    />
    <v-progress-linear
        indeterminate
        v-if="pending"
    />


    <div class="posts__footer">
      <!-- using my own simple pagination component, because vuetify pagination causes hydration mismatch -->
      <app-pagination
          class="posts__pagination"
          v-model="activePage"
          :length="lastPage"
      />

    </div>

  </div>
</template>

<style lang="scss">
.posts {
  padding: 60px 0;
  &__row {
    &_loading {
      opacity: 0.5;
      transition: opacity 0.3s;
    }
  }
  &__header {
    border-bottom: 1px solid #363636;
    padding-bottom: 30px;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    &__sort {
      width: 250px;
    }
    &__params {
      margin-left: auto;
      display: flex;
    }
    &__per-page {
      margin-left: 16px;
      width: 100px;
    }
  }
  &__title {
    font-size: 48px;
  }

  &__per-page {
    margin-left: auto;
    width: 150px;
  }
  &__pagination {
    flex-shrink: 0;
  }
  &__footer {
    margin-top: 30px;
  }
}
</style>