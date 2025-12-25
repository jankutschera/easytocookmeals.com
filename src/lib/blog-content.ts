import blogContentData from '../../data/blog-content.json';

interface BlogContent {
  wordpress_url: string;
  title: string;
  content: string;
}

interface BlogContentData {
  blog_content: Record<string, BlogContent>;
  url_corrections: Record<string, string>;
}

const data = blogContentData as BlogContentData;

export function getBlogContent(slug: string): BlogContent | null {
  return data.blog_content[slug] || null;
}

export function getWordPressUrl(slug: string): string | null {
  return data.url_corrections[slug] || null;
}

export function getAllBlogContent(): Record<string, BlogContent> {
  return data.blog_content;
}
