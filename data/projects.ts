/** Shared dimensions for all project screenshots (2476×1864). */
export const PROJECT_IMAGE = {
  width: 2476,
  height: 1864,
} as const;

export interface Project {
  slug: string;
  title: string;
  date: string;
  shortDescription: string;
  fullDescription: string;
  stack: { category: string; items: string[] }[];
  imageUrl: string;
  liveUrl: string;
  accentColor?: string;
  /** Shown on the project detail page while the site is still being built. */
  inProgress?: boolean;
}

export const projects: Project[] = [
  {
    slug: "bandscope",
    title: "BandScope",
    date: "January 2026",
    liveUrl: "https://bandscope.net",
    shortDescription:
      "Full-stack music networking app for musicians, bands, and venues — 110 users in month one, zero paid ads.",
    fullDescription:
      "BandScope is a personal project I'm passionate about. It's a full-stack music networking platform that connects musicians, bands, and venues — part professional network, part local gig board. Users create role-specific profiles, discover and follow each other, post and browse events, and message directly. I designed and built the entire product: auth and onboarding, three user role types, event discovery and creation, follows, in-app messaging, notifications, content moderation, and custom transactional email flows. Ships as a responsive web app and native iOS/Android apps via Capacitor, all backed by Supabase. In its first month after launch, BandScope grew to 110 users entirely through organic Facebook community posts — zero paid advertising.",
    stack: [
      {
        category: "Frontend",
        items: ["React 18", "TypeScript", "Vite", "React Router"],
      },
      {
        category: "Backend",
        items: ["Supabase Auth", "PostgreSQL", "Row Level Security", "Storage"],
      },
      {
        category: "Serverless",
        items: ["Supabase Edge Functions (Deno)", "Resend"],
      },
      {
        category: "Mobile",
        items: ["Capacitor 8", "iOS", "Android", "Push Notifications"],
      },
      { category: "Tooling", items: ["SPA Prerendering", "React Helmet", "Git"] },
    ],
    imageUrl: "/images/bandscope.png",
  },
  {
    slug: "analogue-room",
    title: "The Analogue Room",
    date: "May 2026",
    inProgress: true,
    liveUrl: "https://theanalogueroom.com",
    shortDescription:
      "Content-managed venue website for a vinyl lounge and wine bar in Solvang, California.",
    fullDescription:
      "Marketing and storytelling site for The Analogue Room — a vinyl lounge and wine bar in Solvang, California. Built with Sanity so the team can update copy, imagery, and page structure without touching code. The front end prioritizes SEO, smooth browsing, and polish. Includes custom API endpoints for newsletter signup with basic abuse protection, interactive map elements, and an accessible component set built on Radix UI and Tailwind.",
    stack: [
      {
        category: "Frontend",
        items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4"],
      },
      {
        category: "CMS",
        items: ["Sanity CMS", "Portable Text", "Visual Editing"],
      },
      {
        category: "Integrations",
        items: ["Mapbox GL", "React Hook Form", "Zod"],
      },
      { category: "Tooling", items: ["Radix UI", "ESLint", "Git"] },
    ],
    imageUrl: "/images/analogue-room.png",
  },
  {
    slug: "standing-sun-wines",
    title: "Standing Sun Wines",
    date: "May 2026",
    inProgress: true,
    liveUrl: "https://standingsunwines.com",
    shortDescription:
      "Next.js + Sanity rebuild for a Santa Ynez Valley winery — content-managed marketing pages, events, and lead capture.",
    fullDescription:
      "Full redesign and rebuild of the public site for Standing Sun Wines, a custom-crush winery and event venue in Buellton, California. The project migrates a static design-first export into a modern, content-managed Next.js application. Editors manage page layouts and copy through a modular Sanity section system, preview changes in context, and publish without touching code. The site includes event listing and detail pages, contact and inquiry forms, newsletter signup, and full SEO metadata — all while keeping the original brand look and feel.",
    stack: [
      {
        category: "Frontend",
        items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4"],
      },
      {
        category: "CMS",
        items: ["Sanity v5", "Portable Text", "Presentation Tool & Draft Mode"],
      },
      {
        category: "Integrations",
        items: ["Resend", "Mailchimp", "Mapbox GL"],
      },
      { category: "Tooling", items: ["Sharp", "Vercel", "Git"] },
    ],
    imageUrl: "/images/standing-sun-wines.png",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project | undefined {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1 || projects.length < 2) return undefined;
  return projects[(index + 1) % projects.length];
}
