import type PostEntity from "~/types/post.entity";
import {Sort} from "~/pages/posts/index.vue";

interface GetPostsQuery {
    search?: string,
    page: number,
    perPage: number,
    sort: Sort,
}
/*
export default function (query: GetPostsQuery) {



    return {
        posts,
        refresh,
        execute,
        pending,
    };
}*/
