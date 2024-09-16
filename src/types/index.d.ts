type APIResponse<T = any> = {
    statusCode: number;
    message: string;
    error: string | null;
    data: T;
}



type PaginationResp<T = any> = {
    rows: T[],
    meta: MetaPaginated
}

type MetaPaginated = {
    total: number;
    totalPage: number;
    page: number;
    search: string | undefined;
    limit: number;
    prev: number | null;
    next: number | null;
}