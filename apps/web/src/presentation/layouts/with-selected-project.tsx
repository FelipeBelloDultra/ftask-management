import { Link, Outlet } from "react-router-dom";

import { Button } from "../components/ui/button";

export function WithSelectedProjectLayout() {
  return (
    <div>
      <nav>
        <ul className="flex items-center gap-4">
          <li>
            <Button asChild variant="link">
              <Link to="/">Kanban</Link>
            </Button>
          </li>

          <li>
            <Button asChild variant="link">
              <Link to="/">Tasks</Link>
            </Button>
          </li>

          <li>
            <Button asChild variant="link">
              <Link to="/">Members</Link>
            </Button>
          </li>

          {/* TODO::: If authenticated is the project owner, show the button to create new tasks and add members - see layout references */}
        </ul>
      </nav>

      <Outlet />
    </div>
  );
}
