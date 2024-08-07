"use client";

import { ChevronRight as ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";

// TODO: Fix the mapping rules AND add ellipsis dropdown
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
  edit: {
    label: "Edit",
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
            <BreadcrumbPage>{segmentLabel}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href={href} prefetch={false}>
                {segmentLabel}
              </Link>
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
