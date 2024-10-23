# FTask Management

This is a bilateral dashboard to dev's contribution with another dev's.

## How does it work?

When you do your login, you can create projects, and tasks to theses projects.
For each project you can create tasks and assignee (by sending invites) another accounts.
And you also be invited to contribute to the project from another account.

# Technology

It's a monorepo using `npm workspaces` to handle this following packages:

- `/apps`
  - `/api` - Code about all backend rules, such authentication, routes, database, etc.
  - `/web` - Code about Frontend layouts, screens, etc.
- `/packages`
  - `/eslint-config` - ESLint configs to backend api and frontend app.
  - `/prettier` - Prettier rules.
  - `/typescript-config` - Typescript configs.

## Backend

The backend core was developed with:

- NodeJS - As JS development platform
- Express - Framework to handle HTTP requests
- DDD - Code design
- Clean Architecture - Code design
- TDD - Code methodology
- Typescript - Superset to type JS
- Prisma - NodeJS ORM
- PostgreSQL - Database
- SOLID - Good principles of software development

Of course, there is another technologies in the backend, like:

- Redis - Caching
- Event Driver Communication - Communication between Aggregate Roots (DDD)
- Authentication - Authentication using JWT
- AWS S3 - Uploading static files
- Zod - Schema validation
- Pino - Logging
- Docker - Create containers of all used services
- Vitest - Tool used to create testing (unit, integration and E2E)

### Folder structures

I tried to follow good practices of software development, so here are some examples:

- I separated all boundaries contexts by modules. So there are a module to handle everything about `projects`, another module to handle everything about `tasks`, etc.
- All core rules are located in the folder `/apps/api/src/modules/**/domain/entity` (DDD and clean architecture). This folder containing the rules of entities, aggregate rules and domain events.
- All application rules are located in the folder `/apps/api/src/modules/**/application`. This folder containing rules about application and it does not depends from real implementation of services, for example:
  - I created the `repositories` to handle entities about `projects`, so the use case that creates the project (for example) will not store the entities in the database, instead, it will just call an interface of database methods. The responsibility of store the entities in the database will be delegated to the class/method caller.
- All real implementations of services is in the folder `/apps/api/src/infra`. There are code about real implementations from some interfaces (to call the database), there are all routes from API, E2E testing, communication with AWS sdk, etc.

## Frontend

The frontend core was developed with:

- ReactJS - Frontend library to build reactive ui
- Vite - Tool to build
- Typescript - Superset to type JS
- Zod - Schema validation
- React Hook Form - Library to handle forms in React
- Tailwind - CSS framework
- shadcn/ui - Pre built components styleless
