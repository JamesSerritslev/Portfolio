"use client";

import type { Project } from "@/data/projects";
import {
  prepareProjectToProjectNavigation,
  scheduleTransitionNavigation,
} from "@/lib/navigation-transition";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface ProjectScrollNavProps {
  currentSlug: string;
  nextProject: Project;
}

export function ProjectScrollNav({
  currentSlug,
  nextProject,
}: ProjectScrollNavProps) {
  const router = useRouter();

  const navigateToNext = useCallback(() => {
    if (currentSlug === nextProject.slug) return;

    const href = `/projects/${nextProject.slug}`;
    scheduleTransitionNavigation(href, prepareProjectToProjectNavigation, (target) => {
      router.push(target, { scroll: false });
    });
  }, [currentSlug, nextProject.slug, router]);

  return (
    <section
      aria-label={`Next project: ${nextProject.title}`}
      className="mt-16 border-t border-[#9F956C]/15 pt-12 sm:mt-20 sm:pt-16"
    >
      <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-[#9F956C]">
        Next Project
      </p>
      <button
        type="button"
        onClick={navigateToNext}
        className="group mt-6 w-full text-left"
      >
        <span className="font-serif text-2xl text-foreground transition-colors duration-300 group-hover:text-[#9F956C] sm:text-3xl">
          {nextProject.title}
        </span>
        <span className="mt-2 block font-sans text-sm text-text-muted transition-colors duration-300 group-hover:text-foreground">
          View next project
        </span>
      </button>
    </section>
  );
}
