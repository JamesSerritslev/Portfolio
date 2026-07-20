"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";

type ProjectReleasesContextValue = {
  openModal: () => void;
};

const ProjectReleasesContext = createContext<ProjectReleasesContextValue | null>(
  null,
);

export function useProjectReleasesModal() {
  return useContext(ProjectReleasesContext);
}

interface ProjectReleasesProviderProps {
  releasesUrl: string;
  children: ReactNode;
}

export function ProjectReleasesProvider({
  releasesUrl,
  children,
}: ProjectReleasesProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const goToReleases = useCallback(() => {
    window.open(releasesUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  }, [releasesUrl]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, isOpen]);

  return (
    <ProjectReleasesContext.Provider value={{ openModal }}>
      {children}

      {isOpen ? (
        <div className="project-releases-modal fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-6">
          <button
            type="button"
            className="project-releases-modal__backdrop absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close download instructions"
            onClick={closeModal}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="project-releases-modal__panel relative z-10 w-full max-w-lg rounded-2xl border border-[#9F956C]/25 bg-surface p-6 shadow-[0_24px_64px_rgba(0,0,0,0.55)] sm:p-8"
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-[#9F956C]/25 font-sans text-xl leading-none text-text-muted transition-colors hover:border-[#9F956C] hover:text-foreground sm:right-6 sm:top-6"
              aria-label="Close download instructions"
            >
              <span aria-hidden>×</span>
            </button>

            <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-[#9F956C]">
              Download
            </p>
            <h2
              id={titleId}
              className="mt-3 pr-10 font-serif text-2xl text-foreground sm:text-3xl"
            >
              Get the Windows app
            </h2>
            <p className="mt-4 font-sans text-sm leading-relaxed text-text-muted sm:text-base">
              On the GitHub releases page, scroll to{" "}
              <span className="text-foreground">Assets</span> and click{" "}
              <span className="text-foreground">Projects-Portable.exe</span> to
              download the Windows version.
            </p>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={goToReleases}
                className="bubble-btn inline-flex min-w-[8rem]"
              >
                <span className="bubble-btn__label font-medium text-gold">Ok</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ProjectReleasesContext.Provider>
  );
}
