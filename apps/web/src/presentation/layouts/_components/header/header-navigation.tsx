import { ChevronRight as ChevronRightIcon } from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/presentation/components/ui/breadcrumb";
import { Button } from "@/presentation/components/ui/button";

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
  const { pathname } = useLocation();

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
                <Link to={href}>{segmentLabel}</Link>
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
