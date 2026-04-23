import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Transitional pattern: supports current root files and upcoming locale subfolders.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
				lang: z.enum(['de', 'en']).optional(),
			title: z.string(),				subtitle: z.string().optional(),			description: z.string(),
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
		type: z.enum(['standard', 'rating']).optional(),
		quote: z.string().optional(),
		opinion: z.string().optional(),
		reviewText: z.string().optional(),
		rating: z
			.object({
				value: z.number().int().min(1),
				scaleMax: z.number().int().min(1).default(10),
				display: z.string().optional(),
			})
			.optional(),
		richlink: z
			.object({
				title: z.string().optional(),
				show: z.string().optional(),
				url: z.string().url(),
				kind: z.enum(['movie', 'recommendation']).default('recommendation'),
				backlink: z.boolean().default(true),
				description: z.string().optional(),
				cover: z
					.object({
						src: z.string().url(),
						alt: z.string(),
					})
					.optional(),
			})
			.optional(),
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
