import axios from "axios"
import { API_URL } from "../config/api"
 
export const fetcher = async <T = any>(url: string, options?: RequestInit) => {
    return await fetch(API_URL + url, options)
        .then(e => e.json())
        .then((e: APIResponse<T>) => {
            if (e.error) throw Error(e.error)
            return e.data
        })
}

export const infinitefetcher = async (url: string, options?: RequestInit) => {
    return await fetch(API_URL + url, options)
        .then(e => e.json())
        .then((e: APIResponse<PaginationResp>) => {
            if (e.error) throw Error(e.error)
            return e.data.rows as any
        })
}


export const getKey = (url: string) => (pageIndex: number, previousPageData: any[]) => {
    if (previousPageData && !previousPageData.length) return null
    return `${url}?page=${pageIndex}&limit=10`
}

export const myAxios = axios.create({
    baseURL: API_URL,
    // withCredentials: true,
    transformResponse: (e) => {
        const response = JSON.parse(e)
        return response.error   ? response : response.data
    },
});

