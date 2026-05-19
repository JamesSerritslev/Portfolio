export const resumeDownloadPath = "/James_Serritslev_Resume_2026.docx";

export const resumeContact = {
  name: "James Serritslev",
  phone: "805-325-3816",
  email: "jamesserritslev@gmail.com",
  location: "South Jordan, UT",
  linkedIn: "https://www.linkedin.com/in/jamesserritslev",
  github: "https://github.com/JamesSerritslev",
};

export const resumeSummary =
  "Recent Computer Science graduate and full-stack developer with internship experience building API-integrated, SEO-optimized web applications. Currently shipping BandScope — a live musician networking platform with 110+ organic users in month one — and content-managed marketing sites for winery and hospitality clients. Proficient in React, TypeScript, Next.js, Sanity, Supabase, and AI-assisted development. Looking to join an engineering team where I can contribute, learn, and ship great software.";

export const resumeProjects = [
  {
    title: "BandScope",
    subtitle: "Solo Full-Stack Project",
    url: "https://bandscope.net",
    period: "January 2026 – Present",
    bullets: [
      "Built and deployed a full-stack musician networking platform connecting musicians, bands, and venues — profiles, events, follows, in-app messaging, notifications, and content moderation.",
      "Reached 110 users in the first month after launch through organic Facebook community posts — zero paid advertising.",
      "Built with React 18 + TypeScript (Vite) and React Router; ships as a responsive web app and native iOS/Android apps via Capacitor.",
      "Backend powered entirely by Supabase: PostgreSQL with Row Level Security, Auth, Storage, and Deno Edge Functions.",
      "Implemented transactional email automation using the Resend API via Supabase Edge Functions.",
      "Configured custom domain, CI/CD pipeline, and production deployment on Vercel; wrote 9 SQL migration files managing schema evolution.",
    ],
  },
  {
    title: "The Analogue Room",
    subtitle: "Client Website — Vinyl Lounge & Wine Bar",
    url: "https://theanalogueroom.com",
    period: "May 2026",
    bullets: [
      "Content-managed marketing site for a vinyl lounge and wine bar in Solvang, California — built with Next.js and Sanity CMS.",
      "Modular page builder with Portable Text and visual editing so the team updates copy, imagery, and layout without code.",
      "Custom API routes for newsletter signup with abuse protection; interactive Mapbox map elements.",
      "Accessible UI built on Radix UI and Tailwind CSS with SEO-focused structure and metadata.",
    ],
  },
  {
    title: "Standing Sun Wines",
    subtitle: "Client Website — Winery & Event Venue",
    url: "https://standingsunwines.com",
    period: "May 2026",
    bullets: [
      "Full redesign and rebuild of the public site for a custom-crush winery and event venue in Buellton, California.",
      "Migrated a static design export into Next.js with a modular Sanity section system, draft preview, and in-context publishing.",
      "Event listing and detail pages, contact and inquiry forms, newsletter signup, and full SEO metadata.",
      "Integrations: Resend, Mailchimp, Mapbox GL; deployed on Vercel with image optimization via Sharp.",
    ],
  },
];

export const resumeExperience = [
  {
    title: "Junior Full Stack Developer Intern",
    companies: [
      { name: "freecalculators.ai", url: "https://freecalculators.ai/" },
      { name: "Viberrr.com", url: "https://viberrr.com/" },
    ],
    location: "Remote",
    period: "April 2025 – August 2025",
    bullets: [
      "Configured a Supabase database using Cursor and Claude Code to support full-stack web applications.",
      "Integrated third-party API endpoints including Kit.com and Google OAuth.",
      "Implemented automated email sequencing workflows using OAuth and Kit.com.",
      "Executed on-page SEO strategies for freecalculators.ai to improve organic search visibility and traffic.",
      "Deployed and maintained applications using Supabase, Vercel, v0, Postmark, and Claude Code.",
      "Conducted QA testing and bug reporting throughout the development lifecycle.",
      "Leveraged AI-assisted development tools to accelerate delivery while maintaining code quality.",
    ],
  },
];

export const resumeEducation = {
  degree: "Bachelor of Science, Computer Science",
  school: "Weber State University — Ogden, UT",
  year: "2025",
  coursework:
    "Data Structures & Algorithms, OOP (C++/C#), Advanced Database Design (SQL), Software Engineering (Figma / .NET), Client-Side Web Development (HTML/CSS/JS), Scripting (Bash/Python), Network Fundamentals, Computer Architecture (Assembly)",
};

export const resumeSkills = [
  {
    category: "Languages",
    items:
      "TypeScript, JavaScript, Python, C++, C#, SQL, Bash, HTML, CSS",
  },
  {
    category: "Frameworks & Libraries",
    items:
      "React 18/19, Next.js, React Router, Vite, Node.js, Tailwind CSS, Radix UI, .NET",
  },
  {
    category: "Platforms & Tools",
    items:
      "Supabase, PostgreSQL, Sanity CMS, Vercel, Resend, Mailchimp, Mapbox GL, Capacitor, Kit.com, Google OAuth, Postmark, Claude Code, Cursor, Figma, ESLint, Git",
  },
  {
    category: "Concepts",
    items:
      "REST APIs, SPA Architecture, Row Level Security, CI/CD, SEO, Email Automation, Content Management, QA Testing",
  },
];
