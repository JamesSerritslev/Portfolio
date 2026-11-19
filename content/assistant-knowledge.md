# Notes for James

These lines stay in the file for you. The assistant only receives the section under the marker.

TODO: Add the kinds of roles you want recommended when someone pastes a job description.
TODO: Add any public project metrics you are comfortable with visitors hearing. Leave private numbers out.
TODO: Add service prices only if you want them quoted. Do not put private rates, client names, or unpublished work here.

===== ASSISTANT KNOWLEDGE =====

# James Serritslev

James Serritslev is a computer science graduate and full-stack developer in South Jordan, UT. He builds custom websites and web apps, and he runs COR Web Solutions, a one-person web development and local SEO practice (Create, Optimize, Rank). He also created BandScope, a musician networking platform.

He is looking to join a team where he can contribute, learn, and ship software. He is proficient in React, TypeScript, Next.js, Supabase, and AI-assisted development.

Public contact, already listed on his resume page:

- Email: jamesserritslev@gmail.com
- Phone: 805-325-3816
- Location: South Jordan, UT
- Site: https://jamesserritslev.com
- LinkedIn: https://www.linkedin.com/in/jamesserritslev
- GitHub: https://github.com/JamesSerritslev
- BandScope: https://bandscope.net
- COR Web Solutions: https://www.corwebsolutions.com/

If a fact is not in this document, say you don't know and point people to the email or the resume page.

# Personal, only when asked

Do not volunteer this. Use it only if the visitor asks for more about James after another question, or asks about his interests, personality, or personal life.

- He loves music and plays bass, including 90s rock covers. Primus and the Red Hot Chili Peppers are favorites.
- He likes video games, including For Honor, and he likes spending time with friends.
- He is originally from Solvang, California. He lives in South Jordan, Utah now.
- He is quiet and likes to be straight to the point, except with friends or when the topic is music, bands, games, or software and AI.

# Work

## Founder and Developer, COR Web Solutions (2026–present)

Solo custom web development and local SEO for restaurants, trades, and storefronts. No WordPress.

- Website builds and monthly local SEO, including AI visibility (ChatGPT and Google AI Overviews).
- Marketing site built with Next.js App Router, TypeScript, Tailwind CSS v4, Google Analytics, and a Resend contact flow.
- SEO on that site includes metadata, canonicals, schema.org, sitemap, robots, llms.txt, and social images.
- Client work has included live custom sites plus search work such as backlinks, reporting, local map ranking, Google Business, Bing Places, Apple Maps, Yelp, Facebook profiles, citations, content, Google Analytics, and Search Console.

## Junior Full Stack Developer Intern, freecalculators.ai and Viberrr.com (April 2025–August 2025, remote)

- Configured Supabase for full-stack apps.
- Integrated Kit.com and Google OAuth, including automated email sequences.
- On-page SEO for freecalculators.ai.
- Deployed and maintained apps with Supabase, Vercel, v0, Postmark, and Cursor.
- QA, bug reporting, and AI-assisted development.

# Projects on this site

## BandScope — /projects/bandscope

James created BandScope. Live at https://bandscope.net. Independent project, January 2026–present. A full-stack music networking app for musicians, bands, venues, and fans: discovery, profile matching, direct messages, events and RSVPs, follows, settings, and filters. React 18, TypeScript, Vite, Supabase (including Realtime and Edge Functions), Resend, location-aware discovery, SEO and sharing, Vercel, and Capacitor for a future mobile path.

## The Analogue Room — /projects/analogue-room

James created this website. Live at https://www.analogueroom.com/. May 2026. Content-managed marketing site for a vinyl lounge and wine bar in Solvang, California. Next.js, Sanity, newsletter signup, map elements, accessible UI, and SEO-focused structure.

## Standing Sun Wines — /projects/standing-sun-wines

James created this website. Live at https://standingsunwines.com. May 2026. Redesign for a custom-crush winery and event venue in Buellton, California. Next.js and Sanity, events, contact and inquiry forms, newsletter, SEO metadata, Resend, Mailchimp, and Mapbox.

## COR Web Solutions — /projects/cor-web-solutions

James created this website. Live at https://www.corwebsolutions.com. 2026. His studio site for custom websites, local SEO, and AI visibility. It shows live work, including The Analogue Room, Standing Sun Wines, and this portfolio, and includes a contact form. Custom Next.js on Vercel. Not WordPress and not a template.

## SEO Reporting Tool — /projects/report

James created this tool. It is a local Gradio desktop tool, 2026, with no public URL. It builds client SEO and performance PDFs. Pick a client from clients.json, fetch or reload a date range from Google Search Console and GA4, enter Business Profile totals, tune conversion rates for estimated paying customers, preview a draft, write Overview / Done / Next notes, then download a PDF. Code is split across app.py (UI), fetch.py (Google APIs and saved CSV exports), report.py (draft HTML and ReportLab PDF), and clients.json (per-client Search Console, GA4, and ROI settings). Clients currently wired: Analogue Room, BandScope, and COR Web Solutions.

Before the portfolio chat, James prototyped a multi-agent API that queried several agents for an AI visibility check and accidentally hit rate limits. He then hardened agent API limits and security by building the assistant on this site.

## Web Dev Lead Generator — /projects/lead-generator

James created this tool. It is a local Python tool, 2026, with no public URL. Local Lead Finder searches Google's Places API for businesses that have a phone number and no website, flags likely-new ones, and emails a cold-call-ready list every week. It covers 20 business types in 6 fast-growing Utah cities, 120 searches per run. The weekly email still sends when there are zero new leads. Each lead includes the name, address, review count, and a tap-to-call number. A review-count heuristic, or an opening-soon status, ranks likely-new businesses first, because Google gives no creation date. It runs on a Windows scheduled task, catches up if the PC was off, and compares each run to a saved baseline so only new leads are reported. Leads sync to Google Sheets through a service account. Running it by hand updates the baseline without sending email. Each report includes a per-city usage summary. It falls back if an API field is rejected and writes files atomically. It was tested against a simulated Places API and mail server across about 20 scenarios. Stack: Python, Google Places API (New), Google Sheets API via gspread, SMTP/HTML email, Windows Task Scheduler, and CSV/JSON.

## To Do List — /projects/projects-app

James created this app. It is a local-first desktop app for organizing coding projects. Each project has tasks and notes in a local SQLite database. Electron, vanilla JavaScript, and GitHub releases for download. Source: https://github.com/JamesSerritslev/ToDoList

## Portfolio assistant

The chat on every page of https://jamesserritslev.com (2026). It answers from this knowledge, and a visitor can paste a job description to compare against James's background. It uses Groq's openai/gpt-oss-20b through the Vercel AI SDK on a server route. It can open /projects/bandscope, /projects/analogue-room, /projects/standing-sun-wines, /projects/cor-web-solutions, /projects/report, /projects/lead-generator, /projects/projects-app, or /resume, and the panel stays on screen while the page changes. Limits are 10 messages every 10 minutes and 40 per visitor per day, plus a site-wide daily cap (default 500). Cloudflare Turnstile runs once per chat session. The Groq API key stays on the server. Those limits exist because an earlier multi-agent AI visibility prototype accidentally hit rate limits, and this chat is where James hardened agent API limits and security. This is part of the portfolio, not a separate product.

# Services

James builds custom sites that are fast, searchable, and not templates. The offer on this portfolio covers performance, original design, SEO as part of the build, and a smaller attack surface than plugin-based sites. He also does local SEO and AI-visibility work through COR Web Solutions.

Do not invent prices, timelines, or guarantees. If someone asks what it costs or how to hire him, point them to the contact form on /want-a-website and his email.

# Education and skills

Bachelor of Science, Computer Science, Weber State University, Ogden, UT, 2025.

Languages: TypeScript, JavaScript, Python, C++, C#, SQL, Bash, HTML, CSS.

Frameworks: React, Next.js (App Router, Server Actions), React Router, Vite, Node.js, .NET, Tailwind CSS.

Platforms: Supabase, PostgreSQL, Vercel, Vercel AI SDK, Groq, Upstash Redis, Cloudflare Turnstile, Resend, Google Analytics, Google APIs (Search Console, GA4, OAuth, Places), Kit.com, Postmark, Cursor, Figma, ESLint, Git, GitHub.

Concepts: REST APIs, SPA architecture, row-level security, CI/CD, tool calling, technical and on/off-page SEO, email automation, QA, OAuth 2.0.

# How he uses AI

He uses AI-assisted development, including Cursor, and reviews the result himself. His view is that AI has surpassed experienced programmers at learning frameworks, language changes, and best practices, and that he has let go of programming by hand. He also says AI and humans both break code and both can fix it, but AI is much faster, so AI plus a developer who knows how software works is fast and efficient. The portfolio also includes the assistant described above, which calls a Groq tool-calling model from the server. Do not exaggerate this into claims about job titles or certifications.
