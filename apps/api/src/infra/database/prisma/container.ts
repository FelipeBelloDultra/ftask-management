import { container, Lifecycle } from "tsyringe";

import { AccountRepository } from "@/modules/account/application/repositories/account.repository";
import { NotificationMetadataRepository } from "@/modules/notification/application/repositories/notification-metadata.repository";
import { NotificationRepository } from "@/modules/notification/application/repositories/notification.repository";
import { InviteRepository } from "@/modules/project/application/repositories/invite.repository";
import { ParticipantRepository } from "@/modules/project/application/repositories/participant.repository";
import { ProjectRepository } from "@/modules/project/application/repositories/project.repository";
import { TaskRepository } from "@/modules/project/application/repositories/task.repository";

import { PrismaConnection } from "./prisma-connection";
import { PrismaAccountRepository } from "./repositories/prisma-account.repository";
import { PrismaInviteRepository } from "./repositories/prisma-invite.repository";
import { PrismaNotificationMetadataRepository } from "./repositories/prisma-notification-metadata.repository";
import { PrismaNotificationRepository } from "./repositories/prisma-notification.repository";
import { PrismaParticipantRepository } from "./repositories/prisma-participant.repository";
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
container.register<ParticipantRepository>(
  "ParticipantRepository",
  {
    useClass: PrismaParticipantRepository,
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
container.register<NotificationRepository>(
  "NotificationRepository",
  {
    useClass: PrismaNotificationRepository,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);
container.register<NotificationMetadataRepository>(
  "NotificationMetadataRepository",
  {
    useClass: PrismaNotificationMetadataRepository,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);
container.register<InviteRepository>(
  "InviteRepository",
  {
    useClass: PrismaInviteRepository,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);
