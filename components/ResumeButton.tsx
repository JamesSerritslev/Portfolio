"use client";

import { useRouter } from "next/navigation";
import { useNavigationStore } from "@/store/navigationStore";

export function ResumeButton() {
  const router = useRouter();
  const setNavigatedFromHome = useNavigationStore(
    (state) => state.setNavigatedFromHome,
  );

  return (
    <button
      type="button"
      onClick={() => {
        setNavigatedFromHome(true);
        router.push("/resume", { scroll: false });
      }}
      className="animate-fade-in mt-4 inline-block rounded-lg border-2 border-gold-border px-5 py-2.5 font-sans text-sm text-gold transition-all [animation-delay:200ms] hover:border-gold hover:text-white active:scale-[0.98] sm:mt-5 md:py-2"
    >
      Resume
    </button>
  );
}
