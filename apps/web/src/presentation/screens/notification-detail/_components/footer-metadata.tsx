import { Link } from "react-router-dom";

import { Button } from "@/presentation/components/ui/button";

interface FooterMetadataProps {
  metadata: {
    key: string;
    value: string;
  };
}

const PROJECT_ID = "project_id";
const SETUP_PROFILE_PICTURE_URL = "setup_profile_picture_url";

export function FooterMetadata({ metadata }: FooterMetadataProps) {
  const value = metadata.value;

  switch (metadata.key) {
    case PROJECT_ID:
      return (
        <Button key={value} variant="link" asChild>
          <Link to={`/dash/projects/${value}`}>See project</Link>
        </Button>
      );

    case SETUP_PROFILE_PICTURE_URL:
      return (
        <Button key={value} variant="link" asChild>
          <Link to={`/dash${value}`}>Complete my profile</Link>
        </Button>
      );
  }
}
