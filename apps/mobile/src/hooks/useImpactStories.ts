import { useCallback } from 'react';
import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { impactStoryService } from '../services/impactStoryService';
import type { ImpactStoryResponse } from '../types/impactStory.types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoriesPage {
  content:    ImpactStoryResponse[];
  totalPages: number;
  page:       number;
}

interface UseImpactStoriesResult {
  stories:     ImpactStoryResponse[];
  loading:     boolean;
  refreshing:  boolean;
  loadingMore: boolean;
  hasMore:     boolean;
  error:       string | null;
  refresh:     () => Promise<void>;
  loadMore:    () => Promise<void>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 8;

export const impactStoriesKeys = {
  all:  ()                    => ['impactStories']           as const,
  list: (size: number)        => ['impactStories', { size }] as const,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useImpactStories(): UseImpactStoriesResult {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    error,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery<
    StoriesPage,
    Error,
    InfiniteData<StoriesPage>,
    ReturnType<typeof impactStoriesKeys.list>,
    number                          // pageParam type
  >({
    queryKey: impactStoriesKeys.list(PAGE_SIZE),

    queryFn: async ({ pageParam }) => {
      const data = await impactStoryService.getStories({
        page: pageParam,
        size: PAGE_SIZE,
      });
      return {
        content:    data.content,
        totalPages: data.totalPages,
        page:       pageParam,
      };
    },

    initialPageParam: 0,

    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages - 1
        ? lastPage.page + 1
        : undefined,

    // Keep previous data visible while refetching — avoids flash of empty list
    placeholderData: (prev) => prev,

    staleTime:  5 * 60_000,   // 5 min — avoids unnecessary background refetches
    gcTime:     300_000,  // 5 min
    retry:      2,
  });

  // Flatten all pages into a single array
  const stories = data?.pages.flatMap((p) => p.content) ?? [];

  // ── Actions ──────────────────────────────────────────────────────────────────

  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const loadMore = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) return;
    await fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ── Derived state (mirrors old hook API exactly) ──────────────────────────

  return {
    stories,
    loading:     isLoading,
    refreshing:  isRefetching && !isFetchingNextPage,
    loadingMore: isFetchingNextPage,
    hasMore:     hasNextPage ?? false,
    error:       error ? 'No se pudieron cargar las historias. Intenta de nuevo.' : null,
    refresh,
    loadMore,
  };
}