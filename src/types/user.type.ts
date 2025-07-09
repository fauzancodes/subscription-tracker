export interface UserRequest {
  name?: string;
  email?: string;
  password?: string;
  isAdmin?: boolean;
}

export interface UserResponse {
  id?: string;
  name?: string;
  email?: string;
  isAdmin?: boolean;
}

export interface UsersParams {
  search?: string;
  name?: string;
  email?: string;
  offset?: number;
  limit?: number;
  order?: 'asc' | 'desc';
  sort?: keyof UserResponse;
}