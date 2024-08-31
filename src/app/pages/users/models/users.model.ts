import { TimeStamp } from 'src/app/shared/model/shared.model';

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
  active: string | number;
  is_premium: string | number;
  code: string;
  verified_at: string;
  country: Country;
  country_name?: string;
}
export interface Country {
  id: number;
  name_ar: string;
  name_en: string;
  iso2: string;
  phonecode: string;
  name: string;
}
export interface UserFilters {
  gender: string | undefined;
  type: string | undefined;
  is_permium: number | undefined;
}
