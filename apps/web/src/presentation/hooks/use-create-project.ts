import { useNavigate } from "react-router-dom";

export function useCreateProject() {
  const navigate = useNavigate();

  function navigateToRoute() {
    navigate("/dash/projects/new");
  }

  return {
    navigateToRoute,
  };
}
