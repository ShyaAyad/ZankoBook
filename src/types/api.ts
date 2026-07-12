export interface User{
  id: string;
  name: string;
}

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
}
