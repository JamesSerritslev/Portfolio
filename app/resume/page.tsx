import type { Metadata } from "next";
import Link from "next/link";
import {
  resumeContact,
  resumeDownloadPath,
  resumeEducation,
  resumeExperience,
  resumeProjects,
  resumeSkills,
  resumeSummary,
} from "@/data/resume";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume for James Serritslev — full-stack developer.",
};

export default function ResumePage() {
  return (
    <main className="mx-auto max-w-3xl overflow-x-hidden px-4 py-10 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-16 md:py-24">
      <Link
        href="/"
        className="inline-block min-h-[44px] py-2 font-sans text-sm text-[#9F956C] transition-colors hover:text-white active:text-white"
      >
        ← Back
      </Link>

      <header className="mt-6 border-b border-[#9F956C]/20 pb-6 sm:mt-8 sm:pb-8">
        <h1 className="font-serif text-3xl text-white sm:text-4xl md:text-5xl">
          {resumeContact.name}
        </h1>
        <ul className="mt-4 flex flex-col gap-2 font-sans text-sm text-[#9F956C] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
          <li>
            <a
              href={`tel:${resumeContact.phone}`}
              className="inline-flex min-h-[44px] items-center py-2 hover:text-white active:text-white sm:min-h-0 sm:py-0"
            >
              {resumeContact.phone}
            </a>
          </li>
          <li className="hidden text-[#888888] sm:list-item">|</li>
          <li>
            <a
              href={`mailto:${resumeContact.email}`}
              className="inline-flex min-h-[44px] items-center break-all py-2 hover:text-white active:text-white sm:min-h-0 sm:py-0"
            >
              {resumeContact.email}
            </a>
          </li>
          <li className="hidden text-[#888888] sm:list-item">|</li>
          <li className="inline-flex min-h-[44px] items-center py-2 text-[#888888] sm:min-h-0 sm:py-0">
            {resumeContact.location}
          </li>
          <li className="hidden text-[#888888] sm:list-item">|</li>
          <li>
            <a
              href={resumeContact.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center py-2 hover:text-white active:text-white sm:min-h-0 sm:py-0"
            >
              LinkedIn
            </a>
          </li>
          <li className="hidden text-[#888888] sm:list-item">|</li>
          <li>
            <a
              href={resumeContact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center py-2 hover:text-white active:text-white sm:min-h-0 sm:py-0"
            >
              GitHub
            </a>
          </li>
        </ul>
        <a
          href={resumeDownloadPath}
          download
          className="mt-4 inline-block rounded-lg border-2 border-[#9F956C]/25 px-5 py-2.5 font-sans text-sm text-[#9F956C] transition-all hover:border-[#9F956C] hover:text-white active:scale-[0.98] sm:mt-6"
        >
          Download .docx
        </a>
      </header>

      <ResumeSection title="Professional Summary">
        <p className="font-sans text-base leading-relaxed text-white sm:text-lg">
          {resumeSummary}
        </p>
      </ResumeSection>

      <ResumeSection title="Projects">
        {resumeProjects.map((project) => (
          <article key={project.title} className="mb-8 last:mb-0">
            <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2 sm:gap-y-1">
              <h3 className="font-serif text-lg text-white sm:text-xl">
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#9F956C] active:text-[#9F956C]"
                  >
                    {project.title}
                  </a>
                ) : (
                  project.title
                )}
              </h3>
              <span className="hidden font-sans text-sm text-[#888888] sm:inline">
                |
              </span>
              <span className="font-sans text-sm text-[#9F956C]">
                {project.subtitle}
              </span>
            </div>
            <p className="mt-1 font-sans text-xs text-[#888888]">
              {project.period}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 font-sans text-sm leading-relaxed text-[#888888] marker:text-[#9F956C]">
              {project.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </ResumeSection>

      <ResumeSection title="Work Experience">
        {resumeExperience.map((job) => (
          <article key={job.title} className="mb-8 last:mb-0">
            <h3 className="font-serif text-lg text-white sm:text-xl">
              {job.title}
            </h3>
            <p className="mt-1 font-sans text-sm leading-relaxed text-[#9F956C]">
              {job.companies.map((company, index) => (
                <span key={company.url}>
                  {index > 0 && " & "}
                  <a
                    href={company.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white active:text-white"
                  >
                    {company.name}
                  </a>
                </span>
              ))}{" "}
              <span className="text-[#888888]">
                ({job.location}) · {job.period}
              </span>
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 font-sans text-sm leading-relaxed text-[#888888] marker:text-[#9F956C]">
              {job.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </ResumeSection>

      <ResumeSection title="Education">
        <h3 className="font-serif text-lg text-white sm:text-xl">
          {resumeEducation.degree}
        </h3>
        <p className="mt-1 font-sans text-sm text-[#9F956C]">
          {resumeEducation.school} · {resumeEducation.year}
        </p>
        <p className="mt-3 font-sans text-sm leading-relaxed text-[#888888]">
          <span className="text-white">Relevant Coursework: </span>
          {resumeEducation.coursework}
        </p>
      </ResumeSection>

      <ResumeSection title="Technical Skills">
        <dl className="space-y-4">
          {resumeSkills.map((group) => (
            <div key={group.category}>
              <dt className="font-sans text-xs font-medium uppercase tracking-[0.15em] text-[#9F956C]">
                {group.category}
              </dt>
              <dd className="mt-1 font-sans text-sm leading-relaxed text-[#888888]">
                {group.items}
              </dd>
            </div>
          ))}
        </dl>
      </ResumeSection>
    </main>
  );
}

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 sm:mt-12">
      <h2 className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-[#9F956C]">
        {title}
      </h2>
      <div className="mt-4 sm:mt-6">{children}</div>
    </section>
  );
}
