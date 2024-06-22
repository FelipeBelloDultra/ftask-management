import { UserRepository } from "~/modules/project/application/repositories/user.repository";
import { User } from "~/modules/project/domain/entity/user";

export class FakeUserRepository implements UserRepository {
  public readonly users: User[] = [];

  public async findById(userId: string): Promise<User | null> {
    const user = this.users.find((user) => user.id.toValue() === userId);

    return user || null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.values.email === email);

    return user || null;
  }

  public async create(user: User): Promise<void> {
    this.users.push(user);
  }
}
