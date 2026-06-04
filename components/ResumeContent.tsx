"use client";

import { TransitionLink } from "@/components/TransitionLink";
import type { ReactNode, RefObject } from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ResumeAnimationNote } from "@/components/ResumeAnimationNote";
import { RevealLine, RevealText } from "@/components/RevealText";
import { prepareResumeToHomeNavigation } from "@/lib/navigation-transition";
import {
  resumeContact,
  resumeDownloadPath,
  resumeEducation,
  resumeExperience,
  resumeProjects,
  resumeSkills,
  resumeSummary,
} from "@/data/resume";
import { useNavigationStore } from "@/store/navigationStore";

const STAGGER = 0.05;
const AUTO_SCROLL_DURATION_MS = 2500;

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function useResumeAutoScroll(
  animate: boolean,
  contentEndRef: RefObject<HTMLDivElement | null>,
  showLandingSpacer: boolean,
  onAnimationComplete: () => void,
  onLandingReady: () => void,
) {
  useLayoutEffect(() => {
    if (!animate) return;

    window.scrollTo({
      top: document.documentElement.scrollHeight - window.innerHeight,
      left: 0,
      behavior: "instant",
    });
    onLandingReady();
  }, [animate, onLandingReady]);

  useEffect(() => {
    if (!animate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onAnimationComplete();
      return;
    }

    let cancelled = false;
    let animationId = 0;
    let isAnimating = true;
    let programmaticScrollY = window.scrollY;

    const blockScrollInput = (event: Event) => {
      if (isAnimating) event.preventDefault();
    };

    const blockScrollKeys = (event: KeyboardEvent) => {
      if (!isAnimating) return;
      const scrollKeys = [
        " ",
        "PageDown",
        "PageUp",
        "ArrowDown",
        "ArrowUp",
        "Home",
        "End",
      ];
      if (scrollKeys.includes(event.key)) {
        event.preventDefault();
      }
    };

    const lockScrollPosition = () => {
      if (isAnimating && window.scrollY !== programmaticScrollY) {
        window.scrollTo(0, programmaticScrollY);
      }
    };

    const scrollToLanding = () => {
      window.scrollTo({
        top: document.documentElement.scrollHeight - window.innerHeight,
        left: 0,
        behavior: "instant",
      });
      programmaticScrollY = window.scrollY;
    };

    const finishAnimation = () => {
      isAnimating = false;
      window.scrollTo(0, 0);
      programmaticScrollY = 0;
      onAnimationComplete();
    };

    const startAutoScroll = () => {
      if (cancelled) return;

      const startY = window.scrollY;
      if (startY <= 0) {
        finishAnimation();
        return;
      }

      const startTime = performance.now();

      const tick = (now: number) => {
        if (cancelled) return;

        const progress = Math.min((now - startTime) / AUTO_SCROLL_DURATION_MS, 1);
        programmaticScrollY = Math.max(0, startY * (1 - easeOutCubic(progress)));
        window.scrollTo(0, programmaticScrollY);

        if (progress < 1) {
          animationId = requestAnimationFrame(tick);
        } else {
          finishAnimation();
        }
      };

      animationId = requestAnimationFrame(tick);
    };

    window.addEventListener("wheel", blockScrollInput, { passive: false });
    window.addEventListener("touchmove", blockScrollInput, { passive: false });
    window.addEventListener("keydown", blockScrollKeys);
    window.addEventListener("scroll", lockScrollPosition, { passive: true });

    requestAnimationFrame(() => {
      scrollToLanding();
      startAutoScroll();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationId);
      window.removeEventListener("wheel", blockScrollInput);
      window.removeEventListener("touchmove", blockScrollInput);
      window.removeEventListener("keydown", blockScrollKeys);
      window.removeEventListener("scroll", lockScrollPosition);
    };
  }, [animate, onAnimationComplete]);

  useEffect(() => {
    if (!animate || showLandingSpacer) return;

    const clampToContent = () => {
      const end = contentEndRef.current;
      if (!end) return;
      const maxScrollY = Math.max(0, end.offsetTop - window.innerHeight);
      if (window.scrollY > maxScrollY) {
        window.scrollTo(0, maxScrollY);
      }
    };

    clampToContent();
    window.addEventListener("scroll", clampToContent, { passive: true });
    window.addEventListener("resize", clampToContent, { passive: true });

    return () => {
      window.removeEventListener("scroll", clampToContent);
      window.removeEventListener("resize", clampToContent);
    };
  }, [animate, showLandingSpacer, contentEndRef]);
}

function useRevealHelpers(animate: boolean, revealReady: boolean) {
  const revealText = (
    lines: string[],
    className?: string,
    lineClassName?: string,
  ) => (
    <RevealText
      lines={lines}
      className={className}
      lineClassName={lineClassName}
      stagger={STAGGER}
      animate={animate}
      revealReady={revealReady}
    />
  );

  const revealLine = (
    children: ReactNode,
    className?: string,
    staggerIndex = 0,
  ) => (
    <RevealLine
      animate={animate}
      revealReady={revealReady}
      delay={staggerIndex * STAGGER}
      className={className}
    >
      {children}
    </RevealLine>
  );

  return { revealText, revealLine };
}

export function ResumeContent() {
  const [animate] = useState(() => {
    const { navigatedFromHome, setNavigatedFromHome } =
      useNavigationStore.getState();
    if (navigatedFromHome) {
      setNavigatedFromHome(false);
      return true;
    }
    return false;
  });

  const [showLandingSpacer, setShowLandingSpacer] = useState(animate);
  const [revealReady, setRevealReady] = useState(!animate);
  const contentEndRef = useRef<HTMLDivElement>(null);
  const onAnimationComplete = useCallback(() => setShowLandingSpacer(false), []);
  const onLandingReady = useCallback(() => setRevealReady(true), []);
  const recalcScrollBounds = useCallback(() => {
    window.dispatchEvent(new Event("resize"));
  }, []);
  const { revealText, revealLine } = useRevealHelpers(animate, revealReady);

  useResumeAutoScroll(
    animate,
    contentEndRef,
    showLandingSpacer,
    onAnimationComplete,
    onLandingReady,
  );

  return (
    <main
      data-resume-page=""
      className="mx-auto w-full min-w-0 max-w-3xl overflow-x-clip px-4 py-10 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-16 md:py-24"
    >
      <TransitionLink
        href="/"
        prepare={prepareResumeToHomeNavigation}
        className="inline-block min-h-[44px] py-2 font-sans text-sm text-gold transition-colors hover:text-white active:text-white"
      >
        ← Back
      </TransitionLink>

      <header className="mt-6 border-b border-gold-border pb-6 sm:mt-8 sm:pb-8">
        {revealText(
          [resumeContact.name],
          "font-serif text-3xl text-white sm:text-4xl md:text-5xl",
        )}

        <div className="mt-4 flex flex-col gap-2 font-sans text-sm text-gold sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
          {revealLine(
            <a
              href={`tel:${resumeContact.phone}`}
              className="inline-flex min-h-[44px] items-center py-2 hover:text-white active:text-white sm:min-h-0 sm:py-0"
            >
              {resumeContact.phone}
            </a>,
            "inline-block sm:inline-block",
            0,
          )}
          {revealLine(
            <a
              href={`mailto:${resumeContact.email}`}
              className="inline-flex min-h-[44px] items-center break-all py-2 hover:text-white active:text-white sm:min-h-0 sm:py-0"
            >
              {resumeContact.email}
            </a>,
            "inline-block sm:inline-block",
            1,
          )}
          {revealLine(
            <span className="inline-flex min-h-[44px] items-center py-2 text-text-muted sm:min-h-0 sm:py-0">
              {resumeContact.location}
            </span>,
            "inline-block sm:inline-block",
            2,
          )}
          {revealLine(
            <a
              href={resumeContact.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center py-2 hover:text-white active:text-white sm:min-h-0 sm:py-0"
            >
              LinkedIn
            </a>,
            "inline-block sm:inline-block",
            3,
          )}
          {revealLine(
            <a
              href={resumeContact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center py-2 hover:text-white active:text-white sm:min-h-0 sm:py-0"
            >
              GitHub
            </a>,
            "inline-block sm:inline-block",
            4,
          )}
        </div>

        {revealLine(
          <a
            href={resumeDownloadPath}
            download
            className="mt-4 inline-block rounded-lg border-2 border-gold-border px-5 py-2.5 font-sans text-sm text-gold transition-all hover:border-gold hover:text-white active:scale-[0.98] sm:mt-6"
          >
            Download .docx
          </a>,
        )}
      </header>

      <ResumeSection title="Professional Summary" revealText={revealText}>
        {revealText(
          [resumeSummary],
          "break-words font-sans text-base leading-relaxed text-white sm:text-lg",
        )}
      </ResumeSection>

      <ResumeSection title="Projects" revealText={revealText}>
        {resumeProjects.map((project) => (
          <article key={project.title} className="mb-8 last:mb-0">
            {revealLine(
              project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif text-lg text-white transition-colors hover:text-gold active:text-gold sm:text-xl"
                >
                  {project.title}
                </a>
              ) : (
                <span className="font-serif text-lg text-white sm:text-xl">
                  {project.title}
                </span>
              ),
            )}
            {revealText([project.subtitle], "font-sans text-sm text-gold")}
            {revealText(
              [project.period],
              "mt-1 font-sans text-xs text-text-muted",
            )}
            {revealText(
              project.bullets.map((bullet) => `• ${bullet}`),
              "mt-3 space-y-2 break-words font-sans text-sm leading-relaxed text-text-muted",
            )}
          </article>
        ))}
      </ResumeSection>

      <ResumeSection title="Work Experience" revealText={revealText}>
        {resumeExperience.map((job) => (
          <article key={job.title} className="mb-8 last:mb-0">
            {revealText(
              [job.title],
              "font-serif text-lg text-white sm:text-xl",
            )}
            {revealLine(
              <p className="mt-1 font-sans text-sm leading-relaxed text-gold">
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
                <span className="text-text-muted">
                  ({job.location}) · {job.period}
                </span>
              </p>,
            )}
            {revealText(
              job.bullets.map((bullet) => `• ${bullet}`),
              "mt-3 space-y-2 break-words font-sans text-sm leading-relaxed text-text-muted",
            )}
          </article>
        ))}
      </ResumeSection>

      <ResumeSection title="Education" revealText={revealText}>
        {revealText(
          [resumeEducation.degree],
          "font-serif text-lg text-white sm:text-xl",
        )}
        {revealText(
          [`${resumeEducation.school} · ${resumeEducation.year}`],
          "mt-1 font-sans text-sm text-gold",
        )}
        {revealLine(
          <p className="mt-3 break-words font-sans text-sm leading-relaxed text-text-muted">
            <span className="text-white">Relevant Coursework: </span>
            {resumeEducation.coursework}
          </p>,
        )}
      </ResumeSection>

      <ResumeSection title="Technical Skills" revealText={revealText}>
        <dl className="space-y-4">
          {resumeSkills.map((group) => (
            <div key={group.category}>
              {revealText(
                [group.category],
                "font-sans text-xs font-medium uppercase tracking-[0.15em] text-gold",
              )}
              {revealText(
                [group.items],
                "mt-1 break-words font-sans text-sm leading-relaxed text-text-muted",
              )}
            </div>
          ))}
        </dl>
      </ResumeSection>

      {animate && !showLandingSpacer ? (
        <>
          <div aria-hidden className="h-16 shrink-0 sm:h-24" />
          <ResumeAnimationNote onLayoutChange={recalcScrollBounds} />
          <div ref={contentEndRef} aria-hidden className="h-px shrink-0" />
        </>
      ) : null}

      {animate && showLandingSpacer ? (
        <>
          <div ref={contentEndRef} aria-hidden className="h-px shrink-0" />
          <div aria-hidden className="h-[80dvh] shrink-0" />
        </>
      ) : null}
    </main>
  );
}

function ResumeSection({
  title,
  children,
  revealText,
}: {
  title: string;
  children: ReactNode;
  revealText: (
    lines: string[],
    className?: string,
    lineClassName?: string,
  ) => ReactNode;
}) {
  return (
    <section className="mt-8 sm:mt-12">
      {revealText(
        [title],
        "font-sans text-xs font-medium uppercase tracking-[0.2em] text-gold",
      )}
      <div className="mt-4 sm:mt-6">{children}</div>
    </section>
  );
}
