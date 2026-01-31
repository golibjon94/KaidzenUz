import { BlogStatus } from './enums';

export interface FileModel {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
}

export interface CreatePostDto {
  title: string;
  slug: string;
  imageId?: string | null;
  content: string;
  status: BlogStatus;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  imageId?: string | null;
  image?: FileModel | null;
  content: string;
  status: BlogStatus;
  createdAt: Date;
  updatedAt: Date;
}
