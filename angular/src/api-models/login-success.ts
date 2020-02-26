import {User} from "./user";

export interface LoginSuccess {
  token: string;
  tokenExpiresAt: string;
  user: User;
}
