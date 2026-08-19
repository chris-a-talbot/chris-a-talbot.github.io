import type { Component } from 'svelte';

/** Frontmatter accepted at the top of a post in src/posts/. */
export interface PostMetadata {
  title: string;
  /** ISO date, YYYY-MM-DD. Determines ordering. */
  date: string;
  /** One or two sentences shown on the blog index and in link previews. */
  description: string;
  tags?: string[];
  /** Drafts are visible with `npm run dev` and excluded from the build. */
  draft?: boolean;
  /** Kept in the repo but never rendered, in dev or in the build. */
  hidden?: boolean;
}

export interface Post extends PostMetadata {
  /** Derived from the filename: my-post.md -> /blog/my-post/ */
  slug: string;
  content: Component;
}

const modules = import.meta.glob<{ default: Component; metadata: PostMetadata }>(
  '/src/posts/*.md',
  { eager: true }
);

export const posts: Post[] = Object.entries(modules)
  .map(([path, module]) => ({
    ...module.metadata,
    slug: path.split('/').pop()!.replace(/\.md$/, ''),
    content: module.default
  }))
  .filter((post) => !post.hidden)
  .filter((post) => import.meta.env.DEV || !post.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

/** Posts either side of `slug` in reverse-chronological order. */
export function getNeighbors(slug: string): { newer?: Post; older?: Post } {
  const i = posts.findIndex((post) => post.slug === slug);
  return i === -1 ? {} : { newer: posts[i - 1], older: posts[i + 1] };
}

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
}

/** Day and month only — the year is carried by the index's year headings. */
export function formatShortDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  });
}

export function postYear(iso: string): string {
  return iso.slice(0, 4);
}

/** Posts grouped into year bands, newest first. */
export const postsByYear: Array<{ year: string; items: Post[] }> = [
  ...new Set(posts.map((post) => postYear(post.date)))
].map((year) => ({
  year,
  items: posts.filter((post) => postYear(post.date) === year)
}));
