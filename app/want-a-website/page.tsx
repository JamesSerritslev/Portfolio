import { WantWebsiteBackLink } from "@/components/WantWebsiteBackLink";
import { WantWebsiteContactForm } from "@/components/WantWebsiteContactForm";
import {
  WANT_WEBSITE_CARD,
  WANT_WEBSITE_SECTIONS,
} from "@/data/want-a-website";
import { PROJECT_IMAGE } from "@/data/projects";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Want a Website?",
  description: WANT_WEBSITE_CARD.shortDescription,
};

export default function WantWebsitePage() {
  return (
    <main
      data-project-page=""
      className="mx-auto max-w-4xl overflow-x-hidden px-4 py-10 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-16 md:py-24"
    >
      <WantWebsiteBackLink />

      <div className="mt-6 flex flex-col items-center gap-6 text-center md:mt-8 md:flex-row md:items-start md:justify-between md:gap-10 md:text-left">
        <div className="min-w-0 md:flex-1">
          <h1 className="font-serif text-3xl text-white sm:text-4xl md:text-5xl">
            {WANT_WEBSITE_CARD.title}
          </h1>
          <p className="mt-4 font-sans text-base leading-relaxed text-[#888888] sm:text-lg">
            {WANT_WEBSITE_CARD.shortDescription}
          </p>
        </div>

        <div className="mx-auto w-full max-w-[22rem] shrink-0 overflow-hidden rounded-2xl border-2 border-[#9F956C]/25 bg-black p-1 sm:max-w-none md:mx-0 md:w-[min(100%,32rem)] md:max-w-[32rem] md:pt-1 lg:max-w-[36rem]">
          <div className="relative w-full overflow-hidden rounded-xl bg-black">
            <div
              className="relative w-full overflow-hidden"
              style={{
                paddingBottom: `calc(100% * ${PROJECT_IMAGE.height} / ${PROJECT_IMAGE.width})`,
              }}
            >
              <Image
                src={WANT_WEBSITE_CARD.imageUrl}
                alt=""
                width={PROJECT_IMAGE.width}
                height={PROJECT_IMAGE.height}
                sizes="(max-width: 768px) 100vw, 512px"
                className="absolute inset-0 h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-10 sm:mt-14">
        {WANT_WEBSITE_SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="font-serif text-2xl text-white sm:text-3xl">
              {section.title}
            </h2>
            <p className="mt-4 font-sans text-base leading-relaxed text-white sm:text-lg">
              {section.body}
            </p>
          </section>
        ))}
      </div>

      <WantWebsiteContactForm />
    </main>
  );
}
