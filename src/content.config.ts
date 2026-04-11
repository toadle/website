import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Transitional pattern: supports current root files and upcoming locale subfolders.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
				lang: z.enum(['de', 'en']).optional(),
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			alternateLanguageUrl: z.string().optional(),
			heroImage: image().optional(),
		}),
});

const now = defineCollection({
	loader: glob({ base: './src/content/now', pattern: '**/*.md' }),
	schema: z.object({
		date: z.coerce.date(),
		lang: z.enum(['de', 'en']).optional(),
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
