import { ProjectInnerMobileTopBar } from "@/components/ProjectInnerMobileTopBar";
import { WantWebsiteContactForm } from "@/components/WantWebsiteContactForm";
import {
  WANT_WEBSITE_CARD,
  WANT_WEBSITE_PERFORMANCE_SECTION_ID,
  WANT_WEBSITE_SECTIONS,
} from "@/data/want-a-website";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Want a Website?",
  description: WANT_WEBSITE_CARD.shortDescription,
};

export default function WantWebsitePage() {
  return (
    <main
      data-project-page=""
      className="mx-auto w-full min-w-0 max-w-4xl overflow-x-clip px-4 pt-3 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-16 md:py-24"
    >
      <ProjectInnerMobileTopBar />
      <section className="relative min-w-0 md:mt-8">
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl md:text-5xl">
          {WANT_WEBSITE_CARD.title}
        </h1>
        <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-text-muted sm:text-lg">
          {WANT_WEBSITE_CARD.shortDescription}
        </p>
      </section>

      <div className="mt-10 space-y-10 sm:mt-14">
        {WANT_WEBSITE_SECTIONS.map((section) => (
          <section
            key={section.title}
            id={
              section.title === "Built for performance"
                ? WANT_WEBSITE_PERFORMANCE_SECTION_ID
                : undefined
            }
          >
            <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
              {section.title}
            </h2>
            <p className="mt-4 font-sans text-base leading-relaxed text-foreground sm:text-lg">
              {section.body}
            </p>
          </section>
        ))}
      </div>

      <WantWebsiteContactForm />
    </main>
  );
}
