import { error } from '@sveltejs/kit';
import { getNeighbors, getPost, posts } from '$lib/blog';
import type { EntryGenerator, PageLoad } from './$types';

/** Tells the static adapter which post pages to prerender. */
export const entries: EntryGenerator = () => posts.map((post) => ({ slug: post.slug }));

export const load: PageLoad = ({ params }) => {
  const post = getPost(params.slug);
  if (!post) error(404, `There's no post called "${params.slug}".`);

  return { post, ...getNeighbors(params.slug) };
};
