import { projectsAppDownloads } from "@/data/projects-app-downloads";

const downloadLinkClassName =
  "inline-flex min-h-[40px] items-center whitespace-nowrap rounded-lg border-2 border-gold-border bg-surface-elevated/95 px-4 py-2 font-sans text-xs text-gold shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all hover:border-gold hover:text-foreground active:scale-[0.98] sm:text-sm";

export function ProjectsDownloadHover() {
  return (
    <div
      className="projects-download-hover fixed z-[98] hidden md:block"
      aria-label="App downloads"
    >
      <div className="projects-download-hover__zone">
        <div className="projects-download-hover__panel" role="menu">
          <p className="projects-download-hover__label font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-gold">
            Hidden TODO Project download experiment
          </p>
          {projectsAppDownloads.map((download) => (
            <a
              key={download.href}
              href={download.href}
              className={downloadLinkClassName}
              role="menuitem"
              target="_blank"
              rel="noopener noreferrer"
            >
              {download.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
