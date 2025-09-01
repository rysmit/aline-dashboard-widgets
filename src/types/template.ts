import { Widget } from './widget';

export interface Template {
  id: string;
  name: string;
  status: 'draft' | 'published';
  widgets: Widget[];
  updatedAt: string;
  createdAt: string;
}

export interface TemplateAssignment {
  communityId: string;
  templateId: string;
  isPrimary: boolean;
}

export interface DashboardTemplate extends Template {
  careType: string;
  communityIds: string[];
  isPublished: boolean;
}