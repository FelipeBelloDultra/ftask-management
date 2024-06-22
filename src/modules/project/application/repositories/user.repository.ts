import { User } from "~/modules/project/domain/entity/user";

export abstract class UserRepository {
  public abstract findById(userId: string): Promise<User | null>;
  public abstract findByEmail(email: string): Promise<User | null>;
  public abstract create(user: User): Promise<void>;
}
