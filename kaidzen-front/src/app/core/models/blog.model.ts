import { BlogStatus } from './enums';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  image?: string;
  content: string;
  status: BlogStatus;
  createdAt: Date;
  updatedAt: Date;
}
