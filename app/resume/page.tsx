import type { Metadata } from "next";
import { ResumeContent } from "@/components/ResumeContent";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume for James Serritslev, full-stack developer.",
};

export default function ResumePage() {
  return <ResumeContent />;
}
