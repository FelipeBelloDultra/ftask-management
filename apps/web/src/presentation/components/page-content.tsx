import { ReactNode } from "react";

interface PageContentProps {
  children: ReactNode;
}

export function PageContent({ children }: PageContentProps) {
  return (
    <section className="flex-1 h-[calc(100vh-3.5rem)] overflow-scroll">
      <main className="py-10 px-8">{children}</main>
    </section>
  );
}
