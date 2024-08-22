import { User } from "@/domain/user";

export interface PersistenceUser {
  id: string;
  picture_url: string | null;
  email: string;
  name: string;
}

export class UserMapper {
  public static toDomain(raw: PersistenceUser): User {
    return User.create({
      id: raw.id,
      email: raw.email,
      name: raw.name,
      pictureUrl: raw.picture_url,
    });
  }

  public static toPersistence(user: User): PersistenceUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      picture_url: user.pictureUrl,
    };
  }
}
