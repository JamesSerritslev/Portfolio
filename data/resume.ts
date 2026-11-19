export const resumeContact = {
  name: "James Serritslev",
  phone: "805-325-3816",
  email: "jamesserritslev@gmail.com",
  location: "South Jordan, UT",
  website: "https://jamesserritslev.com",
  websiteLabel: "jamesserritslev.com",
  linkedIn: "https://www.linkedin.com/in/jamesserritslev",
  github: "https://github.com/JamesSerritslev",
  bandScope: "https://bandscope.net",
  bandScopeLabel: "BandScope.net",
  corWebSolutions: "https://www.corwebsolutions.com/",
  corWebSolutionsLabel: "COR Web Solutions",
};

export const resumeSummary =
  "Recent Computer Science graduate and full-stack developer with internship experience building API-integrated, SEO-optimized web applications. Founder of COR Web Solutions, a solo web development and local SEO practice, and creator of BandScope.net, a live musician networking platform — both demonstrating end-to-end ownership from architecture to deployment. Proficient in React, TypeScript, Next.js, Supabase, and AI-assisted development. Looking to join a team where I can contribute, learn, and ship great software.";

export const resumeProjects = [
  {
    title: "Portfolio assistant",
    subtitle: "This site — jamesserritslev.com",
    url: "https://jamesserritslev.com",
    period: "2026",
    bullets: [
      "Built a recruiter chat on this portfolio that answers from the resume and project notes and accepts a pasted job description.",
      "Connected a Groq tool-calling model (openai/gpt-oss-20b) through the Vercel AI SDK on a server-only route. A navigate tool opens BandScope, Analogue Room, Standing Sun Wines, To Do List, or the resume while the panel stays on screen.",
      "Limited use with Upstash Redis: 10 messages every 10 minutes and 40 per visitor per day, plus a site-wide daily cap. Cloudflare Turnstile checks once per chat session, and the Groq API key stays on the server.",
    ],
  },
  {
    title: "BandScope",
    subtitle: "Independent Project — bandscope.net",
    url: "https://bandscope.net",
    period: "January 2026 – Present",
    bullets: [
      "Designed and shipped a full-stack music networking product end to end: discovery feeds, profile matching, DMs, events/RSVPs, follows, account settings, and in-depth filtering on React 18 + TypeScript (Vite) with client-side SPA routing.",
      "Built collaboration matching on shared instruments, seeking, genres, and musical influences.",
      "Implemented real-time direct messaging and notifications with Supabase Realtime, plus transactional email via Deno Edge Functions and the Resend API (password reset, alerts, preferences).",
      "Added location-aware discovery (geocoding, Google Places autocomplete, radius browse) and timezone-aware show listings with maps deep links.",
      "Set up production SEO and sharing: sitemap generation, Playwright prerender for key routes, profile OG/share HTML, and guest browse limits to encourage signup; configured custom domain, CI/CD, and deployment on Vercel.",
      "Applied strict TypeScript and ESLint standards; wrapped the app with Capacitor for a future iOS/Android path.",
    ],
  },
  {
    title: "Client SEO Reporting Tool",
    subtitle: "Independent Project",
    url: "",
    period: "2026",
    bullets: [
      "Python, Gradio, Google APIs, and ReportLab — a local reporting app that pulls Search Console and GA4 into client-ready PDFs.",
      "Built an end-to-end SEO reporting pipeline: Gradio UI, Google API fetch, CSV export store, live HTML draft, and branded PDF.",
      "Integrated Search Console and GA4 (Data and Admin APIs) with OAuth 2.0, including multi-account login so clients on different Google accounts stay separate.",
      "Generated client PDFs with daily position and clicks charts, traffic channel mix, conversion events, and an AI/agentic search section sourced from GA4 referral data (ChatGPT, Perplexity, and similar).",
    ],
  },
];

export const resumeExperience = [
  {
    title: "Founder & Developer",
    companies: [
      { name: "COR Web Solutions", url: "https://www.corwebsolutions.com/" },
    ],
    location: "",
    period: "2026 – Present",
    summary:
      "Solo custom web development and local SEO practice for restaurants, trades, and storefronts (Create, Optimize, Rank).",
    bullets: [
      "Founded and operate a one-person web and SEO practice — no WordPress.",
      "Productized offerings: website builds and monthly local SEO, including AI visibility optimization (ChatGPT / Google AI Overviews).",
      "Built the marketing site with Next.js App Router, TypeScript, Tailwind CSS v4, Google Analytics, and a Resend-powered contact flow.",
      "Implemented SEO systems on the business site: metadata and canonicals, schema.org (Organization, Service, OfferCatalog, FAQ, Article), sitemap/robots, llms.txt, and OG/favicon assets.",
      "Delivered live custom sites for clients and applied SEO work such as backlink building, reporting, AI visibility analysis, local map ranking analysis, Google Business, Bing Places, Apple Maps, Yelp, and Facebook profile optimization, citation building, content writing, and analysis with Google Analytics and Google Search Console.",
    ],
  },
  {
    title: "Junior Full Stack Developer Intern",
    companies: [
      { name: "freecalculators.ai", url: "https://freecalculators.ai/" },
      { name: "Viberrr.com", url: "https://viberrr.com/" },
    ],
    location: "Remote",
    period: "April 2025 – August 2025",
    summary: "",
    bullets: [
      "Configured a Supabase database to support full-stack web applications.",
      "Integrated third-party API endpoints including Kit.com and Google OAuth.",
      "Implemented automated email sequencing workflows using OAuth and Kit.com.",
      "Executed on-page SEO strategies for freecalculators.ai to improve organic search visibility and traffic.",
      "Deployed and maintained applications using Supabase, Vercel, v0, Postmark, and Cursor.",
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
    items: "TypeScript, JavaScript, Python, C++, C#, SQL, Bash, HTML, CSS",
  },
  {
    category: "Frameworks & Libraries",
    items:
      "React 18/19, Next.js (App Router, Server Actions), React Router, Vite, Node.js, .NET, Tailwind CSS v4",
  },
  {
    category: "Platforms & Tools",
    items:
      "Supabase (Postgres, Auth, Storage, Realtime, Edge Functions), PostgreSQL, Vercel, Vercel AI SDK, Groq, Upstash Redis, Cloudflare Turnstile, Resend, Google Analytics, Google APIs (Search Console, GA4, OAuth, Places, Cloud Vision), Kit.com, Postmark, Claude Code, Cursor, Figma, ESLint, Git, GitHub",
  },
  {
    category: "Concepts",
    items:
      "REST APIs, SPA Architecture, Row-Level Security, CI/CD, Tool Calling, Technical SEO, On/Off Page SEO, Email Automation, QA Testing, OAuth 2.0",
  },
];

export const resumeNote =
  "In my opinion, AI has surpassed experienced programmers. It learns frameworks, recent language changes, and best practices faster than any human can. I've let go of programming by hand. Yes, AI can break code at times, humans also break code frequently. AI can fix its mistakes, so can humans. The difference is AI is much much faster. AI + a developer who knows how software works = fast and efficient development.";
