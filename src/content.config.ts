import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});

const now = defineCollection({
	loader: glob({ base: './src/content/now', pattern: '**/*.md' }),
	schema: z.object({
		date: z.coerce.date(),
		label: z.string(),
		quote: z.string().optional(),
		opinion: z.string().optional(),
		youtube: z.string().url().optional(),
		image: z
			.object({
				src: z.string(),
				alt: z.string(),
			})
			.optional(),
	}),
});

export const collections = { blog, now };
