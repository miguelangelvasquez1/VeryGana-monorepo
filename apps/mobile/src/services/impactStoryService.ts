import type { ImpactStoryListResponse, ImpactStoryResponse } from '../types/impactStory.types';
import { apiClient } from "../api/apiClient";
// ── Ajusta la base URL a tu entorno ───────────────────────────────────────────

interface GetStoriesParams {
  page?:   number;
  size?:   number;
  status?: string;
}

async function get<T>(path: string): Promise<T> {
  const res = await apiClient.get(path);
  if (res.status < 200 || res.status >= 300) throw new Error(`API error ${res.status}: ${path}`);
  return res.data as T;
}

export const impactStoryService = {
  /**
   * Lista las historias publicadas (paginada).
   * Usa status=PUBLISHED por defecto para el feed público.
   */
  getStories(params: GetStoriesParams = {}): Promise<ImpactStoryListResponse> {
    const { page = 0, size = 10, status = 'PUBLISHED' } = params;
    const qs = new URLSearchParams({
      page:   String(page),
      size:   String(size),
      status,
    });
    return get<ImpactStoryListResponse>(`/impact-stories/consumer?${qs}`);
  },
};