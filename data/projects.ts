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
    liveUrl: "https://www.analogueroom.com/",
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
      "Projects is a local-first desktop application for developers who want a lightweight, focused way to manage side projects and in-progress work. Instead of a generic todo app, it is shaped around how I actually work: one workspace per project, a clear split between active and completed tasks, and a notes area for ideas that do not belong on the task list. Everything runs offline. Tasks, notes, and project metadata live in a SQLite database on disk. No accounts, no sync, no network calls.",
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
    imageUrl: "/images/projects-app.png",
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
