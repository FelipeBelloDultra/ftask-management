import { User } from "@/domain/user";
import { httpClientAdapter } from "@/infra/adapter/fetch-adapter-http";
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
}

export type BuildAuthAdapter = (http: HttpClient) => AuthAdapter;

enum AuthRoutes {
  SignIn = "/account/session",
  SignUp = "/account",
}

export const buildAuthAdapter: BuildAuthAdapter = (http = httpClientAdapter) => {
  async function signIn(data: SignInData): Promise<SignInResponse> {
    const response = await http.sendRequest<SignInResponse, SignInData>({
      method: HttpMethods.POST,
      url: AuthRoutes.SignIn,
      body: data,
    });

    return response;
  }

  async function signUp(data: SignUpData): Promise<User> {
    const response = await http.sendRequest<PersistenceUser, SignUpData>({
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

  return {
    signIn,
    signUp,
  };
};
