/** Shared dimensions for all project screenshots (2476×1864). */
export const PROJECT_IMAGE = {
  width: 2476,
  height: 1864,
} as const;

export interface ProjectDetailSection {
  title: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
}

export interface Project {
  slug: string;
  title: string;
  date: string;
  shortDescription: string;
  fullDescription: string;
  stack: { category: string; items: string[] }[];
  imageUrl: string;
  liveUrl: string;
  liveUrlLabel?: string;
  /** GitHub releases page opened after download instructions modal. */
  releasesUrl?: string;
  downloadLabel?: string;
  /** When false, hides the text link beside the project date. */
  showExternalLink?: boolean;
  detailLinkLabel?: string;
  sections?: readonly ProjectDetailSection[];
  highlights?: readonly string[];
  metaLine?: string;
  accentColor?: string;
  /** Shown on the project detail page while the site is still being built. */
  inProgress?: boolean;
}

export const projects: Project[] = [
{
    slug: "lead-generator",
    title: "Web Dev Lead Generator",
    date: "2026",
    liveUrl: "",
    showExternalLink: false,
    shortDescription:
      "A Python tool I created that finds local businesses with a phone number and no website, then emails a cold-call-ready lead list every week.",
    fullDescription:
      "I created Local Lead Finder, automated prospecting for web developers. Selling websites to small businesses usually means hours of searching by hand. The best leads are businesses that just opened: they have a Google Business Profile and a phone line, but no website yet. Google does not expose a recently-created filter, so those leads are hard to find. This tool searches for them and sends a ranked list every week with no manual work.",
    sections: [
      {
        title: "The solution",
        paragraphs: [
          "It searches Google's Places API across 20 high-intent business types, including cafes, salons, photographers, and trades, in 6 fast-growing Utah cities. That is 120 searches per run. It keeps only the businesses that have a phone number and no website.",
        ],
      },
      {
        title: "Key features",
        bullets: [
          "Automatic weekly email, even when there are zero new leads. There is nothing to open, run, or export",
          "Cold-call-ready list: business name, address, review count, and a tap-to-call phone number",
          "New-business signal: very few reviews, or an opening-soon status, puts likely-new businesses at the top, because Google gives no creation date",
          "Weekly automation on a Windows scheduled task. It catches up if the PC was off, and compares each run to a saved baseline so only new leads are reported",
          "Google Sheets sync through a service account, so leads, review counts, and opening status stay up to date. Existing leads are backfilled automatically",
          "Manual mode adds to the baseline without sending an email",
          "Each report includes a per-city usage summary for that run",
          "If an API field is rejected it falls back, and it writes files atomically so a crash cannot corrupt them",
          "Verified against a simulated Places API and mail server across about 20 scenarios, including first runs, repeat runs, failures, and the unattended path",
        ],
      },
      {
        title: "Outcome",
        paragraphs: [
          "It replaces manual prospecting with a hands-off weekly pipeline. Each Monday a ranked, ready-to-dial list of businesses that probably need a website lands in the inbox.",
        ],
      },
    ],
    stack: [
      {
        category: "App",
        items: ["Python"],
      },
      {
        category: "APIs",
        items: ["Google Places API (New)", "Google Sheets API (gspread)"],
      },
      {
        category: "Delivery",
        items: ["SMTP/HTML email", "Windows Task Scheduler", "CSV/JSON persistence"],
      },
    ],
    imageUrl: "/images/lead-generator.png",
  },
{
    slug: "report",
    title: "SEO Reporting Tool",
    date: "2026",
    liveUrl: "",
    showExternalLink: false,
    shortDescription:
      "A Gradio desktop tool I created that turns Google Search Console, GA4, and Business Profile numbers into a client PDF.",
    fullDescription:
      "I created SEO Reporting Tool, a Gradio desktop tool for building client SEO and performance PDFs. You pick a client from clients.json, fetch or reload a date range from Google Search Console and GA4, type in Business Profile totals, tune conversion rates for estimated paying customers, preview a draft with notes, then download a PDF. The flow is: select a client, set this period and an optional prior period, fetch or load an export, enter Business Profile numbers and ROI rates, write Overview, Done, and Next, then download the PDF.",
    sections: [
      {
        title: "How it is built",
        bullets: [
          "app.py is the Gradio interface",
          "fetch.py talks to the Google APIs and can reload a saved CSV export",
          "report.py turns the draft into HTML and a ReportLab PDF",
          "clients.json holds each client's Search Console, GA4, and ROI settings",
          "Clients currently wired: Analogue Room, BandScope, and COR Web Solutions",
        ],
      },
      {
        title: "What it taught me about agents",
        paragraphs: [
          "Before this portfolio chat, I prototyped a multi-agent API that queried several agents to run an AI visibility check. I accidentally ran into rate limits. Building the assistant on this site is how I hardened agent API limits and security: short burst caps, a daily cap per visitor, a site-wide daily cap, and a one-time human check before the model is called.",
        ],
      },
    ],
    highlights: [
      "Draft first: preview the numbers, then write the notes",
      "Two date ranges, fetched from Google or loaded from a saved export",
      "Business Profile totals and conversion rates for estimated paying customers",
      "Overview, Done, and Next notes on the draft, then a PDF download",
      "No public URL. It runs on the machine that holds the client data",
    ],
    stack: [
      {
        category: "App",
        items: ["Python", "Gradio"],
      },
      {
        category: "Data",
        items: ["Google Search Console", "GA4", "CSV exports"],
      },
      {
        category: "Output",
        items: ["ReportLab", "HTML draft"],
      },
    ],
    imageUrl: "/images/report-chart.png",
  },
{
    slug: "analogue-room",
    title: "The Analogue Room",
    date: "May 2026",
    liveUrl: "https://www.analogueroom.com/",
    shortDescription:
      "A content-managed venue website I created for a vinyl lounge and wine bar in Solvang, California.",
    fullDescription:
      "I created the marketing and storytelling site for The Analogue Room — a vinyl lounge and wine bar in Solvang, California. Built with Sanity so the team can update copy, imagery, and page structure without touching code. The front end prioritizes SEO, smooth browsing, and polish. Includes custom API endpoints for newsletter signup with basic abuse protection, interactive map elements, and an accessible component set built on Radix UI and Tailwind.",
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
    liveUrl: "https://standingsunwines.com",
    shortDescription:
      "A Next.js + Sanity rebuild I created for a Santa Ynez Valley winery — content-managed marketing pages, events, and lead capture.",
    fullDescription:
      "I created the full redesign and rebuild of the public site for Standing Sun Wines, a custom-crush winery and event venue in Buellton, California. The project migrates a static design-first export into a modern, content-managed Next.js application. Editors manage page layouts and copy through a modular Sanity section system, preview changes in context, and publish without touching code. The site includes event listing and detail pages, contact and inquiry forms, newsletter signup, and full SEO metadata — all while keeping the original brand look and feel.",
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
{
    slug: "projects-app",
    title: "To Do List",
    date: "2026",
    liveUrl: "https://github.com/JamesSerritslev/ToDoList",
    releasesUrl: "https://github.com/JamesSerritslev/ToDoList/releases",
    downloadLabel: "Download",
    showExternalLink: false,
    shortDescription:
      "Personal productivity desktop app I built to keep coding work organized without relying on the cloud. Each project gets its own task list and scratchpad-style notes, stored in a local SQLite database so data stays on your machine.",
    fullDescription:
      "I created To Do List, a local-first desktop application for developers who want a lightweight, focused way to manage side projects and in-progress work. Instead of a generic todo app, it is shaped around how I actually work: one workspace per project, a clear split between active and completed tasks, and a notes area for ideas that do not belong on the task list. Everything runs offline. Tasks, notes, and project metadata live in a SQLite database on disk. No accounts, no sync, no network calls.",
    sections: [
      {
        title: "What it does",
        bullets: [
          "Project hub: create and browse projects, sorted by most recently opened",
          "Task management: add, edit, complete, undo, delete, and drag-reorder tasks",
          "Project notes: separate notes stream per project, distinct from tasks",
          "Cursor integration: map projects to local folders and open them in Cursor with one click",
          "Interactive guide: a polished onboarding tour that requires the user to perform each action before advancing",
          "In-app README: built-in documentation covering architecture, data storage, and build instructions",
        ],
      },
      {
        title: "Technical highlights",
        bullets: [
          "Electron 35 with a frameless, platform-aware window (hidden title bar on Windows/macOS)",
          "better-sqlite3 with WAL journaling and foreign-key constraints",
          "Secure renderer: context isolation, strict Content Security Policy, no Node integration in the UI",
          "Vanilla JS / HTML / CSS: custom animations, modal system, and tour logic without a frontend framework",
          "Cross-platform packaging: portable .exe, macOS .dmg, Linux .AppImage and .deb",
          "CI/CD: GitHub Actions matrix build across Windows, macOS, and Linux",
        ],
      },
      {
        title: "Why I built it",
        paragraphs: [
          "I wanted a todo tool that matched my workflow as a developer: fast to open, keyboard-friendly, tied to real project folders, and completely under my control. Building it also let me practice the full stack of a small desktop product — database schema, IPC bridge, packaging, and UX polish — in a focused, shippable scope.",
        ],
      },
    ],
    highlights: [
      "Local-first SQLite storage: your data never leaves your machine",
      "Project-based task lists with done / to-do sections",
      "Drag-and-drop task reordering",
      "Inline editing for tasks and notes",
      "One-click Open in Cursor for linked project folders",
      "Interactive hands-on onboarding tour with spotlight UI",
      "Cross-platform desktop builds (Windows, macOS, Linux)",
      "Automated release builds via GitHub Actions",
    ],
    metaLine:
      "Built in a single focused session using Cursor for rapid iteration, with follow-up passes on the interactive tour, animations, and cross-platform packaging.",
    stack: [
      {
        category: "Desktop",
        items: ["Electron 35", "electron-builder"],
      },
      {
        category: "Frontend",
        items: ["Vanilla JavaScript", "HTML", "CSS"],
      },
      {
        category: "Data",
        items: ["better-sqlite3 (SQLite + WAL)"],
      },
      {
        category: "Security",
        items: ["contextBridge IPC", "CSP", "no network"],
      },
      {
        category: "CI/CD",
        items: ["GitHub Actions (Windows / macOS / Linux)"],
      },
    ],
    imageUrl: "/images/todo-list.png",
  },
{
    slug: "bandscope",
    title: "BandScope",
    date: "January 2026",
    liveUrl: "https://bandscope.net",
    shortDescription:
      "A full-stack music networking app I created for musicians, bands, and venues — 110 users in month one, zero paid ads.",
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
    slug: "cor-web-solutions",
    title: "COR Web Solutions",
    date: "2026",
    liveUrl: "https://www.corwebsolutions.com",
    shortDescription:
      "The studio site I created for custom websites, local SEO, and AI visibility, built for businesses that want to be found.",
    fullDescription:
      "I created COR Web Solutions, the site for my web studio. It introduces custom website builds, local SEO, and AI visibility for restaurants, trades, shops, and other local businesses. The homepage leads with the offer, shows live work including The Analogue Room, Standing Sun Wines, and this portfolio, and ends with a contact form that sends a project note straight to my inbox. The site is a custom Next.js build on Vercel, not a template and not WordPress.",
    sections: [
      {
        title: "What the site covers",
        bullets: [
          "Custom websites: unique builds a client can edit, with search and maps in mind",
          "Local SEO: keyword research, citations, backlinks, technical checks, and content",
          "AI visibility: clear facts so ChatGPT, AI Overviews, and answer engines can recommend the business",
          "Selected work: Analogue Room, Standing Sun Wines, and a custom portfolio",
          "A direct contact form for the business name, the build they want, and a short note",
        ],
      },
    ],
    highlights: [
      "Live at corwebsolutions.com",
      "Custom Next.js site on Vercel",
      "No WordPress and no template theme",
      "Work samples, services, pricing, process, and FAQ on one site",
      "Contact form that lands in James's inbox",
    ],
    stack: [
      {
        category: "Frontend",
        items: ["Next.js", "React"],
      },
      {
        category: "Hosting",
        items: ["Vercel"],
      },
    ],
    imageUrl: "/images/cor-web-solutions.png",
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
