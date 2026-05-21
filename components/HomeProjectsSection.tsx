import { ProjectCardsGallery } from "@/components/ProjectCardsGallery";
import type { Project } from "@/data/projects";

export function HomeProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section className="relative z-30 min-h-0 overflow-visible text-center md:flex md:flex-1 md:flex-col md:text-left">
      <p className="animate-fade-in fade-delay-projects relative z-0 mb-4 shrink-0 font-sans text-xs font-medium uppercase tracking-[0.2em] text-[#9F956C] md:mb-4">
        Projects
      </p>
      <div className="relative -ml-6 min-h-0 flex-1 overflow-visible pl-6 md:-ml-10 md:pl-10">
        <ProjectCardsGallery projects={projects} />
      </div>
    </section>
  );
}
