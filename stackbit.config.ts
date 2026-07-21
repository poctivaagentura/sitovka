import { defineStackbitConfig, type SiteMapEntry } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  ssgName: "custom",
  nodeVersion: "18",

  devCommand:
    "node_modules/.bin/astro dev --port {PORT} --host --allowed-hosts all",

  experimental: {
    ssg: {
      name: "Astro",
      logPatterns: {
        up: ["ready in", "astro"],
      },
      passthrough: ["/vite-hmr/**"],
      directRoutes: {
        "socket.io": "socket.io",
      },
    },
  },

  siteMap: ({ documents, models }) => {
    const pageModels = models.filter((m) => m.type === "page");
    return documents
      .filter((d) => pageModels.some((m) => m.name === d.modelName))
      .map((document) => {
        const model = pageModels.find((m) => m.name === document.modelName);
        if (!model) return null;
        return {
          stableId: document.id,
          urlPath: model.urlPath || "/",
          document,
          isHomePage: document.modelName === "Homepage",
        };
      })
      .filter(Boolean) as SiteMapEntry[];
  },

  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: [
        "src/content/pages",
        "src/content/global",
        "src/content/testimonials",
      ],
      models: [
        // HOMEPAGE MODEL
        {
          name: "Homepage",
          type: "page",
          urlPath: "/",
          filePath: "src/content/pages/homepage.json",
          fields: [
            // HERO
            {
              name: "hero",
              type: "object",
              label: "Hero Section",
              fields: [
                {
                  name: "cards",
                  type: "list",
                  label: "Hero Cards",
                  items: {
                    type: "object",
                    labelField: "headline",
                    fields: [
                      { name: "highlight", type: "string", required: true },
                      { name: "headline", type: "string", required: true },
                      { name: "description", type: "string", required: true },
                      { name: "image", type: "image" },
                      {
                        name: "theme",
                        type: "enum",
                        options: ["green", "white", "grey"],
                        default: "green",
                      },
                    ],
                  },
                },
              ],
            },
            // ABOUT
            {
              name: "about",
              type: "object",
              label: "About Section",
              fields: [
                { name: "heading", type: "string", default: "O nás" },
                { name: "col1", type: "markdown", label: "Left Column" },
                { name: "col2", type: "markdown", label: "Right Column" },
                { name: "image", type: "image" },
                {
                  name: "benefits",
                  type: "list",
                  label: "Benefits",
                  items: {
                    type: "object",
                    labelField: "titleRemainder",
                    fields: [
                      {
                        name: "iconId",
                        type: "enum",
                        options: ["target", "board", "light"],
                        default: "target",
                      },
                      { name: "titleHashtag", type: "string", required: true },
                      {
                        name: "titleRemainder",
                        type: "string",
                        required: true,
                      },
                      { name: "description", type: "string", required: true },
                    ],
                  },
                },
              ],
            },
            // SERVICES
            {
              name: "services",
              type: "object",
              label: "Services Section",
              fields: [
                {
                  name: "headingHighlight",
                  type: "string",
                  default: "Co umíme?",
                },
                { name: "headingRemainder", type: "string" },
                { name: "introText", type: "markdown" },
                {
                  name: "items",
                  type: "list",
                  label: "Service Cards",
                  items: {
                    type: "object",
                    labelField: "title",
                    fields: [
                      { name: "image", type: "image" },
                      { name: "title", type: "string", required: true },
                      { name: "description", type: "markdown" },
                    ],
                  },
                },
              ],
            },
            // CASE STUDIES
            {
              name: "caseStudies",
              type: "object",
              label: "Case Studies Section",
              fields: [
                {
                  name: "heading",
                  type: "string",
                  default: "Případové studie",
                },
                {
                  name: "items",
                  type: "list",
                  label: "Case Studies",
                  items: {
                    type: "object",
                    labelField: "tabLabel",
                    fields: [
                      { name: "tabLabel", type: "string", required: true },
                      { name: "heading", type: "string", required: true },
                      { name: "description", type: "markdown" },
                      {
                        name: "metrics",
                        type: "list",
                        label: "Metrics (1-4 items)",
                        items: {
                          type: "object",
                          labelField: "label",
                          fields: [
                            { name: "label", type: "string", required: true },
                            { name: "value", type: "string", required: true },
                            {
                              name: "showCheckmark",
                              type: "boolean",
                              default: true,
                              label: "Show checkmark after value",
                            },
                          ],
                        },
                      },
                      {
                        name: "testimonial",
                        type: "object",
                        label: "Client Testimonial (optional)",
                        fields: [
                          {
                            name: "quote",
                            type: "markdown",
                            required: true,
                            label: "Quote text",
                          },
                          {
                            name: "avatar",
                            type: "image",
                            label: "Person avatar",
                          },
                          {
                            name: "clientLogo",
                            type: "image",
                            label: "Client company logo",
                          },
                          {
                            name: "name",
                            type: "string",
                            label: "Person name",
                          },
                          {
                            name: "role",
                            type: "string",
                            label: "Person role and company",
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
            // CLIENTS
            {
              name: "clients",
              type: "object",
              label: "Clients Section",
              fields: [
                {
                  name: "logos",
                  type: "list",
                  label: "Client Logos",
                  items: {
                    type: "object",
                    fields: [
                      { name: "name", type: "string" },
                      { name: "href", type: "string" },
                      { name: "logo", type: "image", required: true },
                    ],
                  },
                },
              ],
            },
            // CONTACTS
            {
              name: "contacts",
              type: "object",
              label: "Contacts Section",
              fields: [
                { name: "heading", type: "string", default: "Kontakty" },
                { name: "introText", type: "markdown" },
                {
                  name: "team",
                  type: "list",
                  label: "Team Members",
                  items: {
                    type: "object",
                    labelField: "name",
                    fields: [
                      { name: "name", type: "string", required: true },
                      { name: "role", type: "string" },
                      { name: "email", type: "string" },
                      { name: "phone", type: "string" },
                      { name: "avatar", type: "image" },
                      { name: "isFeatured", type: "boolean", default: false },
                      { name: "objectPosition", type: "string" },
                    ],
                  },
                },
              ],
            },
            // PREFOOTER
            {
              name: "prefooter",
              type: "object",
              label: "Prefooter Section",
              fields: [
                { name: "image", type: "image" },
                {
                  name: "headingHighlight",
                  type: "string",
                  default: "#chcete, aby",
                },
                {
                  name: "headingRemainder",
                  type: "string",
                  default: "váš obsah<br />fungoval?",
                },
              ],
            },
          ],
        },
        // Footer Config
        {
          name: "Footer",
          type: "data",
          label: "Footer Configuration",
          filePath: "src/content/global/footer.json",
          fields: [
            {
              name: "company",
              type: "object",
              label: "Company Info",
              fields: [
                { name: "name", type: "string" },
                { name: "street", type: "string" },
                { name: "city", type: "string" },
              ],
            },
            {
              name: "legal",
              type: "object",
              label: "Legal Info",
              fields: [
                { name: "ico", type: "string" },
                { name: "dic", type: "string" },
                { name: "court", type: "string" },
              ],
            },
            {
              name: "bank",
              type: "object",
              label: "Bank Details",
              fields: [
                { name: "accountNumber", type: "string" },
                { name: "swift", type: "string" },
                { name: "iban", type: "string" },
              ],
            },
            {
              name: "socials",
              type: "object",
              label: "Social Media Links",
              fields: [
                { name: "facebook", type: "string" },
                { name: "instagram", type: "string" },
                { name: "x", type: "string" },
                { name: "linkedin", type: "string" },
                { name: "youtube", type: "string" },
              ],
            },
          ],
        },
        // Testimonials
        {
          name: "Testimonial",
          type: "data",
          filePath: "src/content/testimonials/{slug}.json",
          labelField: "name",
          fields: [
            { name: "logo", type: "image" },
            { name: "content", type: "markdown", required: true },
            { name: "avatar", type: "image" },
            { name: "name", type: "string" },
            { name: "role", type: "string" },
          ],
        },
      ],
      assetsConfig: {
        referenceType: "relative",
        assetsDir: "src/assets",
        uploadDir: "images",
      },
    }),
  ],
});
