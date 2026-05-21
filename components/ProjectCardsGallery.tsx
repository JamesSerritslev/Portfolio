"use client";

import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/data/projects";
import {
  ensureHomeScrollLock,
  releaseHomeScrollLock,
} from "@/lib/home-scroll-lock";
import { runArcEntrance } from "@/lib/arc-entrance";
import { runStackEntrance } from "@/lib/stack-entrance";
import {
  isInitialDocumentLoad,
  skipHomeEntranceAnimations,
} from "@/lib/page-reload";
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

function shouldPlayCardEntrance(): boolean {
  if (useNavigationStore.getState().navigatedFromResume) return false;
  if (document.documentElement.classList.contains("skip-home-entrance")) {
    return false;
  }
  return isInitialDocumentLoad();
}

export function ProjectCardsGallery({ projects }: ProjectCardsGalleryProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mobileStageRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    return () => releaseHomeScrollLock();
  }, []);

  useLayoutEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const stage = isDesktop ? stageRef.current : mobileStageRef.current;

    const markAllStagesReady = () => {
      stageRef.current?.setAttribute("data-arc-ready", "");
      mobileStageRef.current?.setAttribute("data-mobile-card-ready", "");
    };

    const skipEntrance = () => {
      skipHomeEntranceAnimations();
      useNavigationStore.getState().setNavigatedFromResume(false);
      markAllStagesReady();
      releaseHomeScrollLock();
    };

    if (!stage) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      skipEntrance();
      return;
    }

    if (!shouldPlayCardEntrance()) {
      skipEntrance();
      return;
    }

    const cards = Array.from(stage.querySelectorAll<HTMLElement>(":scope > a"));
    if (cards.length === 0) {
      markAllStagesReady();
      return;
    }

    let cancelEntrance = () => {};

    if (isDesktop) {
      ensureHomeScrollLock();
      cancelEntrance = runArcEntrance(cards, stage, {
        delay: ARC_ENTRANCE_DELAY_MS,
        onComplete: releaseHomeScrollLock,
      });
    } else {
      cancelEntrance = runStackEntrance(cards, {
        delay: ARC_ENTRANCE_DELAY_MS,
      });
    }

    markAllStagesReady();

    const desktopStage = stageRef.current;
    const mobileStage = mobileStageRef.current;

    return () => {
      desktopStage?.removeAttribute("data-arc-ready");
      mobileStage?.removeAttribute("data-mobile-card-ready");
      cancelEntrance();
    };
  }, [pathname, projects]);

  return (
    <>
      {/* Mobile & tablet portrait: scrollable stack */}
      <div
        ref={mobileStageRef}
        data-mobile-card-stage=""
        className="flex flex-col items-center gap-6 pb-4 sm:gap-8 sm:pb-6 md:hidden"
      >
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
