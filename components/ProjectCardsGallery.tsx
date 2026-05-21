"use client";

import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/data/projects";
import {
  ensureHomeScrollLock,
  releaseHomeScrollLock,
} from "@/lib/home-scroll-lock";
import { runArcEntrance } from "@/lib/arc-entrance";
import { skipHomeEntranceAnimations, wasPageReloaded } from "@/lib/page-reload";
import { useNavigationStore } from "@/store/navigationStore";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** Staggered positions: BandScope (left) → Analogue Room (center) → Standing Sun (right). */
const GALLERY_LAYOUTS = [
  "md:absolute md:left-[2%] md:top-[6%] md:z-10 md:-rotate-[13deg]",
  "md:absolute md:left-[30%] md:top-[12%] md:z-20 md:rotate-0",
  "md:absolute md:left-[56%] md:top-0 md:z-30 md:rotate-[13deg]",
] as const;

/** Wait after load before cards arc in (ms). */
const ARC_ENTRANCE_DELAY_MS = 1600;

interface ProjectCardsGalleryProps {
  projects: Project[];
}

function shouldPlayArcEntrance(): boolean {
  if (useNavigationStore.getState().navigatedFromResume) return false;
  return wasPageReloaded("/");
}

export function ProjectCardsGallery({ projects }: ProjectCardsGalleryProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    return () => releaseHomeScrollLock();
  }, []);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const markStageReady = () => stage.setAttribute("data-arc-ready", "");

    const skipEntrance = () => {
      skipHomeEntranceAnimations();
      useNavigationStore.getState().setNavigatedFromResume(false);
      markStageReady();
      releaseHomeScrollLock();
    };

    if (!window.matchMedia("(min-width: 768px)").matches) {
      skipEntrance();
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      skipEntrance();
      return;
    }

    if (!shouldPlayArcEntrance()) {
      skipEntrance();
      return;
    }

    ensureHomeScrollLock();

    const cards = Array.from(stage.querySelectorAll<HTMLElement>(":scope > a"));
    if (cards.length === 0) {
      markStageReady();
      return;
    }

    const cancelArc = runArcEntrance(cards, stage, {
      delay: ARC_ENTRANCE_DELAY_MS,
      onComplete: releaseHomeScrollLock,
    });

    markStageReady();

    return () => {
      stage.removeAttribute("data-arc-ready");
      cancelArc();
    };
  }, [pathname, projects]);

  return (
    <>
      {/* Mobile & tablet portrait: scrollable stack */}
      <div className="flex flex-col items-center gap-6 pb-4 sm:gap-8 sm:pb-6 md:hidden">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} variant="gallery" />
        ))}
      </div>

      {/* Desktop (md+): staggered overlap */}
      <div
        ref={stageRef}
        data-arc-stage=""
        className="pointer-events-none relative z-50 mx-auto hidden h-full w-full max-w-full origin-top scale-[0.88] md:block lg:scale-[0.94] xl:scale-100"
      >
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
