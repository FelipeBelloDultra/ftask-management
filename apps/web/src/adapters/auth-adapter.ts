import { User } from "@/domain/user";
import { HttpClient, HttpMethods } from "@/infra/http";
import { PersistenceUser, UserMapper } from "@/infra/mappers/user-mapper";

interface SignInData {
  email: string;
  password: string;
}

interface SignInResponse {
  token: string;
}

interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface AuthAdapter {
  signIn(data: SignInData): Promise<SignInResponse>;
  signUp(data: SignUpData): Promise<User>;
  getAuthenticated(): Promise<User>;
}

enum AuthRoutes {
  SignIn = "/account/session",
  SignUp = "/account",
  GetAuthenticated = "/account/session/me",
}

export class AuthHttpAdapter implements AuthAdapter {
  public constructor(private readonly http: HttpClient) {}

  public async getAuthenticated(): Promise<User> {
    const response = await this.http.sendRequest<PersistenceUser>({
      method: HttpMethods.GET,
      url: AuthRoutes.GetAuthenticated,
    });

    return UserMapper.toDomain(response);
  }

  public async signIn(data: SignInData): Promise<SignInResponse> {
    const response = await this.http.sendRequest<SignInResponse, SignInData>({
      method: HttpMethods.POST,
      url: AuthRoutes.SignIn,
      body: data,
    });

    return response;
  }

  public async signUp(data: SignUpData): Promise<User> {
    const response = await this.http.sendRequest<PersistenceUser, SignUpData>({
      method: HttpMethods.POST,
      url: AuthRoutes.SignUp,
      body: data,
    });

    return UserMapper.toDomain({
      id: response.id,
      picture_url: response.picture_url,
      email: response.email,
      name: response.name,
    });
  }
}
