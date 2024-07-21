import { container, Lifecycle } from "tsyringe";

import { AccountRepository } from "~/modules/account/application/repositories/account.repository";
import { MemberRepository } from "~/modules/account/application/repositories/member.repository";
import { ProjectMemberRepository } from "~/modules/project/application/repositories/project-member.repository";
import { ProjectRepository } from "~/modules/project/application/repositories/project.repository";
import { TaskRepository } from "~/modules/project/application/repositories/task.repository";

import { PrismaConnection } from "./prisma-connection";
import { PrismaAccountRepository } from "./repositories/prisma-account.repository";
import { PrismaMemberRepository } from "./repositories/prisma-member.repository";
import { PrismaProjectMemberRepository } from "./repositories/prisma-project-member.repository";
import { PrismaProjectRepository } from "./repositories/prisma-project.repository";
import { PrismaTaskRepository } from "./repositories/prisma-task.repository";

container.register<PrismaConnection>(
  "PrismaConnection",
  {
    useClass: PrismaConnection,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);
container.register<AccountRepository>(
  "AccountRepository",
  {
    useClass: PrismaAccountRepository,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);
container.register<MemberRepository>(
  "MemberRepository",
  {
    useClass: PrismaMemberRepository,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);
container.register<ProjectMemberRepository>(
  "ProjectMemberRepository",
  {
    useClass: PrismaProjectMemberRepository,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);
container.register<ProjectRepository>(
  "ProjectRepository",
  {
    useClass: PrismaProjectRepository,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);
container.register<TaskRepository>(
  "TaskRepository",
  {
    useClass: PrismaTaskRepository,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);
