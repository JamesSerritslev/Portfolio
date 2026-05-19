import Link from "next/link";
import { ProjectCardsGallery } from "@/components/ProjectCardsGallery";
import { projects } from "@/data/projects";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-dvh max-w-5xl overflow-x-hidden px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6 md:flex md:h-dvh md:max-h-dvh md:flex-col md:overflow-hidden md:py-8 md:pb-8 md:pt-8">
      <section className="mb-6 shrink-0 text-center sm:mb-8 md:mb-5 md:text-left">
        <h1 className="animate-fade-in font-serif text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
          James
          <br />
          Serritslev
        </h1>
        <p className="animate-fade-in mx-auto mt-3 max-w-xl font-sans text-sm leading-relaxed text-[#888888] [animation-delay:150ms] sm:mt-4 sm:text-base md:mx-0 md:mt-5">
          I build fast, content-managed websites for clients who care about
          design. Based in South Jordan, UT.
        </p>
        <Link
          href="/resume"
          className="animate-fade-in mt-4 inline-block rounded-lg border-2 border-[#9F956C]/25 px-5 py-2.5 font-sans text-sm text-[#9F956C] transition-all [animation-delay:200ms] hover:border-[#9F956C] hover:text-white active:scale-[0.98] sm:mt-5 md:py-2"
        >
          Resume
        </Link>
      </section>

      <section className="text-center md:flex md:min-h-0 md:flex-1 md:flex-col md:overflow-visible md:text-left">
        <p className="mb-4 shrink-0 font-sans text-xs font-medium uppercase tracking-[0.2em] text-[#9F956C] md:mb-4">
          Projects
        </p>
        <div className="md:min-h-0 md:flex-1">
          <ProjectCardsGallery projects={projects} />
        </div>
      </section>
    </main>
  );
}
