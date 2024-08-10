import { ReactNode } from "react";

interface PageContentProps {
  children: ReactNode;
}

export function PageContent({ children }: PageContentProps) {
  return (
    <section className="overflow-auto min-h-[calc(100vh-80px)]">
      <main>{children}</main>
    </section>
  );
}
