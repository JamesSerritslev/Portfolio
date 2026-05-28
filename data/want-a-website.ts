export const WANT_WEBSITE_ROUTE = "/want-a-website" as const;

export const WANT_WEBSITE_CARD = {
  id: "want-a-website",
  title: "Want a Website?",
  shortDescription:
    "Custom-built sites that load fast, rank well, and reflect your brand, not a template.",
  imageUrl: "/images/want-a-website.jpg",
} as const;

export const WANT_WEBSITE_SECTIONS = [
  {
    title: "Built for performance",
    body:
      "Every site I build is engineered from the ground up, with no page-builder bloat, no unnecessary plugins, and no generic theme weighing down your load times. That means faster pages, smoother interactions, and an experience your visitors actually enjoy.",
  },
  {
    title: "Unlimited creative direction",
    body:
      "Template platforms lock you into layouts someone else designed. A custom build gives you full control over structure, typography, motion, and brand storytelling, so your site looks like your business, not a theme with your logo dropped in.",
  },
  {
    title: "SEO as a foundation, not an add-on",
    body:
      "Search engines reward fast, accessible, well-structured sites with clean metadata and semantic HTML. Custom development lets us optimize Core Web Vitals, structured data, crawlability, and on-page content from day one, instead of fighting plugin conflicts or platform limits after launch.",
  },
  {
    title: "Security you can stand behind",
    body:
      "According to Sucuri's 2023 Hacked Website Report, WordPress was the CMS involved in 74.8% of malware-infected websites the company remediated, overwhelmingly through vulnerable third-party plugins, outdated themes, and weak admin credentials. Drag-and-drop platforms like Wix and WordPress also expose millions of sites that share the same underlying patterns, making them predictable targets at scale. A custom codebase with modern hosting and disciplined updates presents a much smaller, harder-to-scan attack surface.",
  },
  {
    title: "A credible presence for your brand",
    body:
      "For many customers, your website is the first proof that you are serious. A polished, fast, distinctive site signals professionalism before you ever pick up the phone. It is one of the highest-leverage investments a business can make in how it is perceived.",
  },
] as const;
