import type PaginatedItems from "~/types/paginated-items";

const PaginatedItemsSkeleton: PaginatedItems = {
    items: [],
    total: 0,
    totalPages: 0,
    page: 0,
    perPage: 0,
}

export default PaginatedItemsSkeleton;