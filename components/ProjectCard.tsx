"use client";

import { prepareHomeToProjectNavigation, scheduleTransitionNavigation } from "@/lib/navigation-transition";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { PROJECT_IMAGE } from "@/data/projects";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  variant?: "list" | "gallery";
  layoutClassName?: string;
  isElevated?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const { width: imgW, height: imgH } = PROJECT_IMAGE;
const IMAGE_ASPECT_PADDING = `calc(100% * ${imgH} / ${imgW})`;

function ProjectCardImage({
  src,
  alt,
  showFullImage = false,
  rounded = false,
}: {
  src: string;
  alt: string;
  showFullImage?: boolean;
  rounded?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-black",
        rounded && "rounded-xl"
      )}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ paddingBottom: IMAGE_ASPECT_PADDING }}
      >
        <Image
          src={src}
          alt={alt}
          width={imgW}
          height={imgH}
          sizes="(max-width: 768px) 100vw, 320px"
          className={cn(
            "absolute inset-0 h-full w-full",
            showFullImage ? "object-contain" : "object-cover"
          )}
        />
      </div>
    </div>
  );
}

const cardHoverStyles =
  "border-2 border-[#9F956C]/25 transition-all duration-300 hover:border-[#9F956C] hover:shadow-[0_0_0_1px_#9F956C,0_12px_32px_rgba(159,149,108,0.2)]";

export function ProjectCard({
  project,
  variant = "list",
  layoutClassName,
  isElevated = false,
  onMouseEnter,
  onMouseLeave,
}: ProjectCardProps) {
  const router = useRouter();

  const handleProjectClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (variant !== "gallery") return;
      event.preventDefault();
      const href = `/projects/${project.slug}`;
      scheduleTransitionNavigation(href, prepareHomeToProjectNavigation, (target) => {
        router.push(target, { scroll: false });
      });
    },
    [project.slug, router, variant],
  );

  if (variant === "gallery") {
    return (
      <Link
        href={`/projects/${project.slug}`}
        scroll={false}
        onClick={handleProjectClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cn(
          "group pointer-events-auto mx-auto block w-full max-w-[22rem] overflow-hidden rounded-2xl bg-black p-1 md:mx-0 md:w-[17rem] md:max-w-none lg:w-[19rem] xl:w-[21rem]",
          cardHoverStyles,
          "hover:scale-[1.02] active:scale-[0.99] md:active:scale-100",
          isElevated && "!z-50",
          layoutClassName
        )}
      >
        <ProjectCardImage
          src={project.imageUrl}
          alt={project.title}
          showFullImage
          rounded
        />
        <div className="space-y-1 px-1.5 pb-1.5 pt-1.5">
          <time
            dateTime={project.date}
            className="font-sans text-[10px] tracking-wide text-[#9F956C] md:text-xs"
          >
            {project.date}
          </time>
          <h2 className="font-serif text-lg text-white transition-colors duration-300 group-hover:text-[#9F956C] md:text-xl">
            {project.title}
          </h2>
          <p className="line-clamp-2 font-sans text-[11px] leading-relaxed text-[#888888] md:text-xs">
            {project.shortDescription}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-black sm:flex-row",
        cardHoverStyles,
        "hover:scale-[1.01]"
      )}
    >
      <div className="relative aspect-[2476/1864] w-full shrink-0 overflow-hidden rounded-t-2xl bg-black sm:w-1/2 sm:rounded-l-2xl sm:rounded-tr-none">
        <Image
          src={project.imageUrl}
          alt={project.title}
          width={imgW}
          height={imgH}
          sizes="(max-width: 640px) 100vw, 384px"
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-col justify-center gap-3 p-6 sm:w-1/2 sm:p-8">
        <time
          dateTime={project.date}
          className="font-sans text-xs tracking-wide text-[#9F956C]"
        >
          {project.date}
        </time>
        <h2 className="font-serif text-2xl text-white transition-colors duration-300 group-hover:text-[#9F956C] sm:text-3xl">
          {project.title}
        </h2>
        <p className="font-sans text-sm leading-relaxed text-[#888888] sm:text-base">
          {project.shortDescription}
        </p>
      </div>
    </Link>
  );
}
