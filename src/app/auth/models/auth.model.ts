import { User } from 'src/app/pages/users/models/users.model';
import { TimeStamp } from 'src/app/shared/model/shared.model';

export enum AuthenticationStatus {
  AUTHENTICATED,
  UNAUTHENTICATED,
}
export interface LoginRequest {
  field: string;
  password: string;
  type: string;
}


export interface LogedInUser extends TimeStamp, User {
  role: any;
  permissions: any;
  token: string;
}
