// pagination interface of json-server, unfortunately it's for v1, but we are using now 0.17.4 because filtering not implemented in v1
type PaginatedItems<T = any> = {
    data: T[],
    total: number,
    last: number,
    page: number,
    first: number,
    items: number,
    pages: number
}

export default PaginatedItems;