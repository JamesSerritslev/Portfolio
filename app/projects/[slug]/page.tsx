import { ProjectInnerMobileTopBar } from "@/components/ProjectInnerMobileTopBar";
import { ProjectScrollNav } from "@/components/ProjectScrollNav";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailCard } from "@/components/ProjectDetailCard";
import { ProjectDownloadButton } from "@/components/ProjectDownloadButton";
import { ProjectReleasesProvider } from "@/components/ProjectReleasesProvider";
import { getNextProject, getProjectBySlug, projects } from "@/data/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: project.shortDescription,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const nextProject = getNextProject(slug);
  const externalLinkLabel = project.liveUrlLabel ?? "Live Site";
  const showExternalLink = project.showExternalLink !== false;

  const heroContent = (
    <div className="flex w-full min-w-0 flex-col items-center gap-6 text-center md:mt-8 md:flex-row md:items-start md:justify-between md:gap-10 md:text-left">
      <div className="min-w-0 md:flex-1">
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl md:text-5xl">
          {project.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-sm text-[#9F956C] sm:mt-4 md:justify-start md:gap-x-6">
          <time dateTime={project.date} className="leading-none">
            {project.date}
          </time>
          {project.inProgress && (
            <>
              <span className="hidden text-text-muted md:inline" aria-hidden>
                ·
              </span>
              <span className="rounded-full border border-[#9F956C]/40 px-3 py-1 font-sans text-xs uppercase tracking-wider text-foreground">
                In Progress
              </span>
            </>
          )}
          {showExternalLink ? (
            <>
              <span className="hidden text-text-muted md:inline" aria-hidden>
                ·
              </span>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center py-2 leading-none transition-colors hover:text-foreground active:text-foreground md:min-h-0 md:py-0"
              >
                {externalLinkLabel}
              </a>
            </>
          ) : null}
        </div>
        {project.releasesUrl ? (
          <div className="mt-6 flex justify-center md:justify-start">
            <ProjectDownloadButton label={project.downloadLabel} />
          </div>
        ) : null}
      </div>
      <div className="mx-auto w-full max-w-[22rem] shrink-0 sm:max-w-none md:mx-0 md:w-[min(100%,32rem)] md:max-w-[32rem] md:pt-1 lg:max-w-[36rem]">
        <ProjectDetailCard project={project} compact />
      </div>
    </div>
  );

  return (
    <main
      data-project-page=""
      className="mx-auto w-full min-w-0 max-w-4xl overflow-x-clip px-4 pt-3 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-16 md:py-24"
    >
      <ProjectInnerMobileTopBar />
      <section className="relative min-w-0">
        {project.releasesUrl ? (
          <ProjectReleasesProvider releasesUrl={project.releasesUrl}>
            {heroContent}
          </ProjectReleasesProvider>
        ) : (
          heroContent
        )}
      </section>

      <p className="mt-8 font-sans text-base leading-relaxed text-foreground sm:mt-12 sm:text-lg">
        {project.fullDescription}
      </p>

      {project.sections?.map((section) => (
        <section key={section.title} className="mt-8 sm:mt-12">
          <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
            {section.title}
          </h2>
          {section.paragraphs?.map((paragraph) => (
            <p
              key={paragraph.slice(0, 48)}
              className="mt-4 font-sans text-base leading-relaxed text-foreground sm:text-lg"
            >
              {paragraph}
            </p>
          ))}
          {section.bullets ? (
            <ul className="mt-4 space-y-3 font-sans text-base leading-relaxed text-foreground sm:text-lg">
              {section.bullets.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9F956C]"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      {project.highlights ? (
        <section className="mt-8 sm:mt-12">
          <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-[#9F956C]">
            Highlights
          </p>
          <ul className="mt-4 space-y-3 font-sans text-base leading-relaxed text-foreground sm:mt-6 sm:text-lg">
            {project.highlights.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9F956C]"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-8 sm:mt-12">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-[#9F956C]">
          Stack
        </p>
        <div className="mt-4 grid gap-6 sm:mt-6 sm:grid-cols-2 sm:gap-8">
          {project.stack.map((group) => (
            <div key={group.category}>
              <p className="mb-3 font-sans text-xs text-text-muted">
                {group.category}
              </p>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-[#9F956C]/40 px-3 py-1 font-sans text-xs text-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {project.metaLine ? (
        <p className="mt-8 font-sans text-sm leading-relaxed text-text-muted sm:mt-12 sm:text-base">
          {project.metaLine}
        </p>
      ) : null}

      {nextProject ? (
        <ProjectScrollNav currentSlug={slug} nextProject={nextProject} />
      ) : null}
    </main>
  );
}
