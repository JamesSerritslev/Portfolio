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
  "border-2 border-[#9F956C]/25 transition-all duration-300 hover:border-[#9F956C] hover:shadow-[0_0_0_1px_#9F956C,0_12px_32px_rgba(159,149,108,0.2)]";

export function ProjectDetailCard({
  project,
  compact = false,
}: ProjectDetailCardProps) {
  return (
    <a
      href={project.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group block overflow-hidden bg-black",
        compact ? "rounded-2xl p-1" : "rounded-lg",
        cardHoverStyles,
        compact
          ? "hover:scale-[1.01] active:scale-[0.99] md:active:scale-100"
          : "hover:-translate-y-0.5 active:translate-y-0"
      )}
    >
      <div
        className={cn(
          "overflow-hidden bg-black",
          compact ? "rounded-xl" : ""
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
      {!compact && (
        <p className="px-6 py-4 font-sans text-sm text-[#9F956C] transition-colors group-hover:text-white">
          View Live Site
        </p>
      )}
    </a>
  );
}
