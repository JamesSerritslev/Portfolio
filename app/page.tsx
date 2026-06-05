import { HomeProjectsSection } from "@/components/HomeProjectsSection";
import { ProjectsDownloadHover } from "@/components/ProjectsDownloadHover";
import { ResumeButton } from "@/components/ResumeButton";
import { WordFlick } from "@/components/WordFlick";
import { projects } from "@/data/projects";

export default function HomePage() {
  return (
    <>
      <ProjectsDownloadHover />
      <main
        data-home-page=""
        className="mx-auto min-h-dvh w-full min-w-0 max-w-5xl overflow-x-clip px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6 md:flex md:h-dvh md:max-h-dvh md:flex-col md:overflow-x-visible md:overflow-y-hidden md:py-8 md:pb-8 md:pt-8"
      >
        <section className="relative z-0 mb-6 shrink-0 text-center sm:mb-8 md:mb-5 md:text-left">
          <WordFlick />
          <ResumeButton />
        </section>

        <HomeProjectsSection projects={projects} />
      </main>
    </>
  );
}
