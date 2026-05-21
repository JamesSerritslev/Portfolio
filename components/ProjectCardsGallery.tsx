"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/data/projects";

/** Staggered positions: BandScope (left) → Analogue Room (center) → Standing Sun (right). */
const GALLERY_LAYOUTS = [
  "md:absolute md:left-[2%] md:top-[6%] md:z-10 md:-rotate-[13deg]",
  "md:absolute md:left-[30%] md:top-[12%] md:z-20 md:rotate-0",
  "md:absolute md:left-[56%] md:top-0 md:z-30 md:rotate-[13deg]",
] as const;

interface ProjectCardsGalleryProps {
  projects: Project[];
}

export function ProjectCardsGallery({ projects }: ProjectCardsGalleryProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <>
      {/* Mobile & tablet portrait: scrollable stack */}
      <div className="flex flex-col items-center gap-6 pb-4 sm:gap-8 sm:pb-6 md:hidden">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} variant="gallery" />
        ))}
      </div>

      {/* Desktop (md+): staggered overlap */}
      <div className="pointer-events-none relative mx-auto hidden h-full w-full max-w-6xl origin-top scale-[0.88] md:block lg:scale-[0.94] xl:scale-100">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            variant="gallery"
            layoutClassName={GALLERY_LAYOUTS[index]}
            isElevated={hoveredSlug === project.slug}
            onMouseEnter={() => setHoveredSlug(project.slug)}
            onMouseLeave={() => setHoveredSlug(null)}
          />
        ))}
      </div>
    </>
  );
}
