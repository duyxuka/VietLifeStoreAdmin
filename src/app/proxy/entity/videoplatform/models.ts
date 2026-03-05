import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateSocialVideoDto {
  title?: string;
  description?: string;
  platform?: string;
  videoId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  section?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface SocialVideoDto {
  title?: string;
  description?: string;
  platform?: string;
  videoId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  section?: string;
  displayOrder: number;
  isActive: boolean;
  id?: string;
}

export interface SocialVideoInListDto extends EntityDto<string> {
  title?: string;
  platform?: string;
  videoId?: string;
  section?: string;
  displayOrder: number;
  isActive: boolean;
}
