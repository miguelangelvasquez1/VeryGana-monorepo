// ─── Shared with web — keep in sync with impactStory.types.ts ─────────────────

export type StoryStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type MediaType   = 'IMAGE' | 'VIDEO';

export interface StoryMediaResponse {
  id:           number;
  mediaType:    MediaType;
  publicUrl:      string;
  sizeBytes:     number;
  mimeType:     string;
  thumbnailUrl?: string;
  altText?:     string;
  displayOrder: number;
  isCover:      boolean;
  uploadedAt:   string;
}

export interface ImpactStoryResponse {
  id:                 number;
  title:              string;
  description:        string;
  storyDate:          string;
  beneficiariesCount: number;
  investedAmount:     number;
  investedCurrency:   string;
  location?:          string;
  category?:          string;
  status:             StoryStatus;
  authorName?:        string;
  tags?:              string;
  mediaFiles:         StoryMediaResponse[];
  createdAt:          string;
  updatedAt:          string;
}

export interface ImpactStoryListResponse {
  content:       ImpactStoryResponse[];
  totalElements: number;
  totalPages:    number;
  number:        number;
  size:          number;
}