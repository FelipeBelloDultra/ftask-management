import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import { ChevronRightIcon } from "@/presentation/components/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/presentation/components/ui/breadcrumb";
import { Button } from "@/presentation/components/ui/button";

export function HeaderNavigation() {
  const { pathname } = useLocation();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lastIndex = segments.length - 1;

    return segments.map((segment, index) => {
      const isLastSegment = index === lastIndex;
      const href = `/${segments.slice(0, index + 1).join("/")}`;

      return (
        <BreadcrumbItem key={segment}>
          {index > 0 ? <ChevronRightIcon size={18} /> : null}

          {isLastSegment ? (
            <BreadcrumbPage className="px-2">{segment}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Button asChild variant="link" className="text-muted-foreground px-2 py-0">
                <Link to={href}>{segment}</Link>
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
