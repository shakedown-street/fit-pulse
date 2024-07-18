import { Diet } from './Diet';

export type User = {
  id: string;
  last_login: string | null;
  is_superuser: boolean;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  created_at: string;
  updated_at: string;
  image: string | null;
  is_verified: boolean;
  groups: string[];
  user_permissions: string[];
  diet: Diet;
};
