"use client";

import { ProjectCard } from "@/components/ProjectCard";
import { WantWebsiteCard } from "@/components/WantWebsiteCard";
import { WANT_WEBSITE_CARD } from "@/data/want-a-website";
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

/** Staggered positions: Web Dev Lead Generator → SEO Reporting Tool → Analogue Room → Standing Sun → To Do List → BandScope → COR Web Solutions → Want a Website. */
const GALLERY_LAYOUTS = [
  "md:absolute md:left-[0%] md:top-[8%] md:z-10 md:-rotate-[15deg]",
  "md:absolute md:left-[9%] md:top-[13%] md:z-20 md:-rotate-[10deg]",
  "md:absolute md:left-[18%] md:top-[4%] md:z-30 md:-rotate-[5deg]",
  "md:absolute md:left-[28%] md:top-[12%] md:z-[35] md:rotate-[0deg]",
  "md:absolute md:left-[37%] md:top-[5%] md:z-40 md:rotate-[4deg]",
  "md:absolute md:left-[47%] md:top-[12%] md:z-[45] md:rotate-[8deg]",
  "md:absolute md:left-[56%] md:top-[6%] md:z-[48] md:rotate-[11deg]",
  "md:absolute md:left-[66%] md:top-0 md:z-50 md:rotate-[14deg]",
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
        className="flex w-full min-w-0 max-w-full flex-col items-center gap-6 overflow-x-clip pb-4 sm:gap-8 sm:pb-6 md:hidden"
      >
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} variant="gallery" />
        ))}
        <WantWebsiteCard />
      </div>

      {/* Desktop (md+): staggered overlap */}
      <div
        ref={stageRef}
        data-arc-stage=""
        className="pointer-events-none relative z-50 mx-auto hidden h-full w-full max-w-full origin-top scale-[0.84] md:block lg:scale-[0.88] xl:scale-[0.93] 2xl:scale-[0.97]"
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
        <WantWebsiteCard
          layoutClassName={GALLERY_LAYOUTS[projects.length]}
          isElevated={hoveredSlug === WANT_WEBSITE_CARD.id}
          onMouseEnter={() => setHoveredSlug(WANT_WEBSITE_CARD.id)}
          onMouseLeave={() => setHoveredSlug(null)}
        />
      </div>
    </>
  );
}
