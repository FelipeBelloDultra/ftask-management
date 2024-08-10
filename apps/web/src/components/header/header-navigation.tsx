"use client";

import { ChevronRight as ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

const mapping = {
  dash: {
    label: "Dashboard",
  },
  notifications: {
    label: "Notifications",
  },
  profile: {
    label: "Profile",
  },
  settings: {
    label: "Settings",
  },
} as {
  [key: string]: {
    label: string;
  };
};

export function HeaderNavigation() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lastIndex = segments.length - 1;

    return segments.map((segment, index) => {
      const isLastSegment = index === lastIndex;
      const segmentLabel = mapping[segment]?.label || segment;
      const href = `/${segments.slice(0, index + 1).join("/")}`;

      return (
        <BreadcrumbItem key={segment}>
          {index > 0 ? <ChevronRightIcon size={18} /> : null}

          {isLastSegment ? (
            <BreadcrumbPage className="px-2">{segmentLabel}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Button asChild variant="link" className="text-muted-foreground px-2 py-0">
                <Link href={href} prefetch={false}>
                  {segmentLabel}
                </Link>
              </Button>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      );
    });
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList>{breadcrumbs}</BreadcrumbList>
    </Breadcrumb>
  );
}
