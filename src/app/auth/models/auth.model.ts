import { TimeStamp } from 'src/app/shared/shared/model/shared.model';

export enum AuthenticationStatus {
  AUTHENTICATED,
  UNAUTHENTICATED,
}
export interface LoginRequest {
  field: string;
  password: string;
  type: string;
}
export interface LoginResponse {
  code: number;
  status: number;
  errors: any;
  message: string;
  data: User;
}

export interface User extends TimeStamp {
  id: number;
  name: string;
  father_name: string;
  grandfather_name: string;
  family_branch_name: string;
  tribe: any;
  image: any;
  gender: 'male' | 'female';
  date_of_birth: string;
  country_id: number;
  phone: string;
  phone_code: string;
  country_code: string;
  email: string;
  type: string;
  active: number;
  is_premium: number;
  code: string;
  verified_at: string;
  role: any;
  permissions: any;
  token: string;
}
