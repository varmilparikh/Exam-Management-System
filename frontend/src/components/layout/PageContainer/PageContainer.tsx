// PageContainer.tsx
import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export default function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <main id="main-content" className="mx-auto w-full max-w-[1680px] flex-1 px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
      {children}
    </main>
  );
}
