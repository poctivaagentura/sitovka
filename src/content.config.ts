import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// --- SUB-SCHEMAS ---

const heroSchema = (image: any) =>
  z.object({
    defaultActiveIndex: z.number().optional().default(0),
    cards: z
      .array(
        z.object({
          lines: z.array(
            z.object({
              text: z.string(),
              color: z.enum(["white", "dark"]),
            }),
          ),
          alignment: z.enum(["left", "right"]),
          supplementary: z.object({
            text: z.string(),
            position: z.enum(["bottom-left", "bottom-right"]),
          }),
          image: image().optional(),
          theme: z.enum(["green", "white", "grey"]),
        }),
      )
      .default([]),
  });

const aboutSchema = (image: any) =>
  z.object({
    heading: z.string().default("O nás"),
    col1: z.string().default(""),
    col2: z.string().default(""),
    image: image().optional(),
    benefits: z
      .array(
        z.object({
          iconId: z.enum(["target", "board", "light"]),
          titleHashtag: z.string(),
          titleRemainder: z.string(),
          description: z.string(),
        }),
      )
      .default([]),
  });

const servicesSchema = (image: any) =>
  z.object({
    headingHighlight: z.string().default(""),
    headingRemainder: z.string().default(""),
    introText: z.string().default(""),
    items: z
      .array(
        z.object({
          image: image().optional(),
          title: z.string(),
          description: z.string(),
        }),
      )
      .default([]),
  });

const caseStudiesSchema = (image: any) =>
  z.object({
    heading: z.string().default("Případové studie"),
    items: z
      .array(
        z.object({
          tabLabel: z.string(),
          heading: z.string(),
          description: z.string().optional(),
          metrics: z
            .array(
              z.object({
                label: z.string(),
                value: z.string(),
                showCheckmark: z.boolean().optional().default(true),
              }),
            )
            .optional()
            .default([]),
          testimonial: z
            .object({
              quote: z.string(),
              avatar: image().optional(),
              clientLogo: image().optional(),
              name: z.string().optional().default(""),
              role: z.string().optional().default(""),
            })
            .optional(),
        }),
      )
      .default([]),
  });

const clientsSchema = (image: any) =>
  z.object({
    logos: z
      .array(
        z.object({
          name: z.string().optional().default(""),
          href: z.string().url().optional().or(z.literal("")),
          logo: image(),
        }),
      )
      .default([]),
  });

const contactsSchema = (image: any) =>
  z.object({
    heading: z.string().default("Kontakty"),
    introText: z.string().default(""),
    team: z
      .array(
        z.object({
          name: z.string(),
          role: z.string().optional().default(""),
          email: z.string().optional().default(""),
          phone: z.string().optional().default(""),
          avatar: image().optional(),
          isFeatured: z.boolean().optional().default(false),
          objectPosition: z.string().optional(),
        }),
      )
      .default([]),
  });

const prefooterSchema = (image: any) =>
  z.object({
    image: image().optional(),
    headingHighlight: z.string().default("#chcete, aby"),
    headingRemainder: z.string().default("váš obsah<br />fungoval?"),
  });

// --- COLLECTIONS ---

const pages = defineCollection({
  loader: glob({ pattern: "*.json", base: "src/content/pages" }),
  schema: ({ image }) =>
    z.object({
      hero: heroSchema(image).optional(),
      about: aboutSchema(image).optional(),
      services: servicesSchema(image).optional(),
      caseStudies: caseStudiesSchema(image).optional(),
      clients: clientsSchema(image).optional(),
      contacts: contactsSchema(image).optional(),
      prefooter: prefooterSchema(image).optional(),
    }),
});

const footer = defineCollection({
  loader: glob({ pattern: "footer.json", base: "./src/content/global" }),
  schema: z.object({
    company: z.object({
      name: z.string(),
      street: z.string(),
      city: z.string(),
    }),
    legal: z.object({
      ico: z.string(),
      dic: z.string(),
      court: z.string(),
    }),
    bank: z.object({
      accountNumber: z.string(),
      swift: z.string(),
      iban: z.string().optional(),
    }),
    socials: z
      .object({
        facebook: z.string().url().nullable().optional(),
        instagram: z.string().url().nullable().optional(),
        x: z.string().url().nullable().optional(),
        linkedin: z.string().url().nullable().optional(),
        youtube: z.string().url().nullable().optional(),
      })
      .optional(),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/testimonials" }),
  schema: ({ image }) =>
    z.object({
      logo: image().optional(),
      content: z.string(),
      avatar: image().optional(),
      name: z.string().optional().default(""),
      role: z.string().optional().default(""),
    }),
});

export const collections = {
  pages,
  footer,
  testimonials,
};
