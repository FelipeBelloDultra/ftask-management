import { Entity } from "~/core/entity/entity";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Optional } from "~/core/types/optional";

import { Status } from "./value-objects/status";
import { Slug } from "./value-objects/slug";

export interface ProjectProps {
  name: string;
  slug: Slug;
  description: string | null;
  ownerId: UniqueEntityID;
  dueDate: Date | null;
  status: Status;
  deletedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
}

export class Project extends Entity<ProjectProps> {
  private update() {
    this.props.updatedAt = new Date();
  }

  public isExpired() {
    if (!this.props.dueDate) {
      return false;
    }

    const date = new Date();
    return this.props.dueDate.getTime() < date.getTime();
  }

  public reactivate() {
    if (!this.props.status.canActivate()) {
      return;
    }

    this.props.status.setActive();
    this.update();
  }

  public archive() {
    if (!this.props.status.canArchive()) {
      return;
    }

    this.props.status.setArchived();
    this.update();
  }

  public delete() {
    this.props.status.setDeleted();
    this.props.deletedAt = new Date();
    this.update();
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
        status: props.status ?? Status.create(),
        slug: props.slug ?? Slug.createFromText(props.name),
      },
      id,
    );
  }
}
