import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { Account } from "@/modules/account/domain/entity/account";

export class CompleteAccountProfileEvent implements DomainEvent {
  public ocurredAt: Date;
  public account: Account;

  public constructor(account: Account) {
    this.account = account;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityID {
    return this.account.id;
  }
}
