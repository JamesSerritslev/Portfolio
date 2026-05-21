import { ProjectCardsGallery } from "@/components/ProjectCardsGallery";
import { ResumeButton } from "@/components/ResumeButton";
import { WordFlick } from "@/components/WordFlick";
import { projects } from "@/data/projects";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-dvh max-w-5xl overflow-x-hidden px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6 md:flex md:h-dvh md:max-h-dvh md:flex-col md:overflow-hidden md:py-8 md:pb-8 md:pt-8">
      <section className="mb-6 shrink-0 text-center sm:mb-8 md:mb-5 md:text-left">
        <WordFlick />
        <ResumeButton />
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
