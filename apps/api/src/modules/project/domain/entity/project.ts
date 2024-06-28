import { Entity } from "~/core/entity/entity";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Optional } from "~/core/types/optional";

import { DueDate } from "./value-objects/due-date";
import { ProjectStatus } from "./value-objects/project-status";
import { Slug } from "./value-objects/slug";

export interface ProjectProps {
  name: string;
  slug: Slug;
  description: string | null;
  ownerId: UniqueEntityID;
  dueDate: DueDate | null;
  status: ProjectStatus;
  deletedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
}

export class Project extends Entity<ProjectProps> {
  private edited() {
    this.props.updatedAt = new Date();
  }

  public isExpired() {
    if (!this.props.dueDate) {
      return false;
    }

    return this.props.dueDate.isExpired();
  }

  public reactivate() {
    if (!this.props.status.canActivate()) return;

    this.props.status.setActive();
    this.edited();
  }

  public archive() {
    if (!this.props.status.canArchive()) return;

    this.props.status.setArchived();
    this.edited();
  }

  public delete() {
    this.props.status.setDeleted();
    this.props.deletedAt = new Date();
    this.edited();
  }

  public static create(
    props: Optional<ProjectProps, "createdAt" | "updatedAt" | "status" | "slug" | "deletedAt">,
    id?: UniqueEntityID,
  ): Project {
    return new Project(
      {
        ...props,
        deletedAt: props.deletedAt ?? null,
        updatedAt: props.updatedAt ?? new Date(),
        createdAt: props.updatedAt ?? new Date(),
        status: props.status ?? ProjectStatus.create(),
        slug: props.slug ?? Slug.createFromText(props.name),
      },
      id,
    );
  }
}
