export interface AdForConsumerDTO {
  id: number;
  title: string;
  description: string;
  currentLikes: number;
  contentUrl: string;
  targetUrl: string;
  advertiserId: number;
  advertiserName: string;
  mediaType: AdMediaType;
}

export enum AdMediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}