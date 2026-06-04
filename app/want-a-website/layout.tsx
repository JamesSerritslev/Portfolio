import { ProjectInnerPageChrome } from "@/components/ProjectInnerPageChrome";
import type { ReactNode } from "react";

export default function WantWebsiteLayout({ children }: { children: ReactNode }) {
  return <ProjectInnerPageChrome>{children}</ProjectInnerPageChrome>;
}
