"use client";

import { useProjectReleasesModal } from "@/components/ProjectReleasesProvider";
import Image from "next/image";
import { PROJECT_IMAGE } from "@/data/projects";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

interface ProjectDetailCardProps {
  project: Project;
  /** Hides footer link when live site is already shown in the page header. */
  compact?: boolean;
}

const cardHoverStyles =
  "border-2 border-[#9B4B35]/25 transition-all duration-300 hover:border-[#9B4B35] hover:shadow-[0_0_0_1px_#9B4B35,0_12px_32px_rgba(155,75,53,0.2)]";

export function ProjectDetailCard({
  project,
  compact = false,
}: ProjectDetailCardProps) {
  const releases = useProjectReleasesModal();
  const useReleasesGate = Boolean(releases && project.releasesUrl);

  const image = (
    <div
      className={cn(
        "overflow-hidden bg-surface",
        compact ? "rounded-xl" : "",
      )}
    >
      <Image
        src={project.imageUrl}
        alt={`${project.title} screenshot`}
        width={PROJECT_IMAGE.width}
        height={PROJECT_IMAGE.height}
        sizes={
          compact
            ? "(max-width: 640px) 100vw, 480px"
            : "(max-width: 768px) 100vw, 768px"
        }
        className="h-auto w-full object-contain"
      />
    </div>
  );

  const cardClassName = cn(
    "block overflow-hidden bg-surface",
    compact ? "rounded-2xl p-1" : "rounded-lg",
    cardHoverStyles,
    compact
      ? "group hover:scale-[1.01] active:scale-[0.99] md:active:scale-100"
      : "group hover:-translate-y-0.5 active:translate-y-0",
  );

  if (useReleasesGate && releases) {
    return (
      <button
        type="button"
        onClick={releases.openModal}
        className={cn(cardClassName, "cursor-pointer text-left")}
        aria-label={`Download ${project.title}`}
      >
        {image}
      </button>
    );
  }

  return (
    <a
      href={project.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(cardClassName, "group")}
    >
      {image}
      {!compact && (
        <p className="px-6 py-4 font-sans text-sm text-[#9B4B35] transition-colors group-hover:text-foreground">
          {project.detailLinkLabel ?? "View Live Site"}
        </p>
      )}
    </a>
  );
}
