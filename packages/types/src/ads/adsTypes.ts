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
  sessionUUID: string;
}

export enum AdMediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export interface LikeAdResponse {
  liked: boolean;
  rewardAmount: number;
}