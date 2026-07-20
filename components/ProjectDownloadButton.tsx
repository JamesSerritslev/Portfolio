"use client";

import { useProjectReleasesModal } from "@/components/ProjectReleasesProvider";
import { cn } from "@/lib/utils";

interface ProjectDownloadButtonProps {
  label?: string;
  className?: string;
}

export function ProjectDownloadButton({
  label = "Download",
  className,
}: ProjectDownloadButtonProps) {
  const releases = useProjectReleasesModal();

  if (!releases) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={releases.openModal}
      className={cn("bubble-btn inline-flex w-full sm:w-auto", className)}
    >
      <span className="bubble-btn__label font-medium text-gold">{label}</span>
    </button>
  );
}
