import { DocumentNode, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 8

export function usePaginatedQuery(
    query: DocumentNode,
    totalCountPath: string,
    variables: Record<string, unknown>,
    doIskip: boolean
) {
    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE)

    const { loading, error, data, refetch } = useQuery(query, {
        variables: {
            ...variables,
            offset: DEFAULT_PAGE_SIZE * (currentPage - 1),
            limit: DEFAULT_PAGE_SIZE,
        },
        skip: doIskip
    })

    useEffect(() => {
        refetch({
            ...variables,
            offset: DEFAULT_PAGE_SIZE * (currentPage - 1),
            limit: DEFAULT_PAGE_SIZE,
        })
    }, [currentPage, refetch, variables])

    const totalCount = data?.[totalCountPath].totalCount || 0
    const totalPages = Math.ceil(totalCount / DEFAULT_PAGE_SIZE)

    const handlePageChangeMui = (_:unknown, page: number) => {
        setCurrentPage(page)
    }

    return { loading, error, currentPage, data, totalPages, handlePageChangeMui }
}
