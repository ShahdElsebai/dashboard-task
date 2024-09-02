export interface TimeStamp {
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  code: number;
  status: number;
  errors: any;
  message: string;
  data: {
    current_page: number;
    data: T;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: any;
    next_page_url: null | string;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}
export interface ResponseAPI<T> {
  code: number;
  status: number;
  errors: any;
  message: string;
  data: T;
}

export interface Country extends TimeStamp {
  id: number;
  name_en: string;
  name_ar: string;
  iso3: string;
  numeric_code: string;
  iso2: string;
  phonecode: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  subregion: string;
  timezones: string;
  translations: string;
  latitude: string;
  longitude: string;
  emoji: string;
  emojiU: string;
  flag: string;
  wikiDataId: number | null;
  is_active: number;
  deleted_at: string;
  name: string;
}
