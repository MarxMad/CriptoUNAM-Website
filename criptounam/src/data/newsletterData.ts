import data from './newsletterData.json';

export interface NewsletterEntry {
  id: number;
  date: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
}

export const newsletterData: NewsletterEntry[] = data;

export default newsletterData;
