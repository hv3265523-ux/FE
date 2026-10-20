export interface LoginPayload {
  email: string;
  matKhau: string;
}

export interface RegisterPayload {
  hoTen: string;
  email: string;
  matKhau: string;
  soDienThoai?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    hoTen: string;
    email: string;
  };
}