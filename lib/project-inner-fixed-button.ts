import { cn } from "@/lib/utils";

export const PROJECT_INNER_FIXED_BUTTON_BASE =
  "top-under-nav fixed z-[99] inline-flex min-h-[44px] items-center rounded-full border border-[#9F956C]/40 bg-black/75 px-4 py-2 font-sans text-sm text-[#9F956C] shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md";

export function projectInnerFixedButtonClassName(positionClassName: string) {
  return cn(PROJECT_INNER_FIXED_BUTTON_BASE, positionClassName);
}
