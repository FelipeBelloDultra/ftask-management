interface UserProps {
  id: string;
  name: string;
  email: string;
  pictureUrl: string | null;
}

export class User {
  private readonly props: UserProps;

  public get id() {
    return this.props.id;
  }

  public get name() {
    return this.props.name;
  }

  public get email() {
    return this.props.email;
  }

  public get pictureUrl() {
    return this.props.pictureUrl;
  }

  private constructor(props: UserProps) {
    this.props = props;
  }

  public static create(props: UserProps) {
    return new User(props);
  }
}
