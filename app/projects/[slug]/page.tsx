import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectDetailCard } from "@/components/ProjectDetailCard";
import { getProjectBySlug, projects } from "@/data/projects";

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

  return (
    <main className="mx-auto max-w-4xl overflow-x-hidden px-4 py-10 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-16 md:py-24">
      <Link
        href="/"
        className="inline-block min-h-[44px] py-2 font-sans text-sm text-[#9F956C] transition-colors hover:text-white active:text-white"
      >
        ← Back
      </Link>

      <div className="mt-6 flex flex-col items-center gap-6 text-center md:mt-8 md:flex-row md:items-start md:justify-between md:gap-10 md:text-left">
        <div className="min-w-0 md:flex-1">
          <h1 className="font-serif text-3xl text-white sm:text-4xl md:text-5xl">
            {project.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-sm text-[#9F956C] sm:mt-4 md:justify-start md:gap-x-6">
            <time dateTime={project.date} className="leading-none">
              {project.date}
            </time>
            {project.inProgress && (
              <>
                <span className="hidden text-[#888888] md:inline" aria-hidden>
                  ·
                </span>
                <span className="rounded-full border border-[#9F956C]/40 px-3 py-1 font-sans text-xs uppercase tracking-wider text-white">
                  In progress
                </span>
              </>
            )}
            <span className="hidden text-[#888888] md:inline" aria-hidden>
              ·
            </span>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center py-2 leading-none transition-colors hover:text-white active:text-white md:min-h-0 md:py-0"
            >
              Live Site
            </a>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[22rem] shrink-0 sm:max-w-none md:mx-0 md:w-[min(100%,32rem)] md:max-w-[32rem] md:pt-1 lg:max-w-[36rem]">
          <ProjectDetailCard project={project} compact />
        </div>
      </div>

      <p className="mt-8 font-sans text-base leading-relaxed text-white sm:mt-12 sm:text-lg">
        {project.fullDescription}
      </p>

      <section className="mt-8 sm:mt-12">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-[#9F956C]">
          Stack
        </p>
        <div className="mt-4 grid gap-6 sm:mt-6 sm:grid-cols-2 sm:gap-8">
          {project.stack.map((group) => (
            <div key={group.category}>
              <p className="mb-3 font-sans text-xs text-[#888888]">
                {group.category}
              </p>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-[#9F956C]/40 px-3 py-1 font-sans text-xs text-white"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
