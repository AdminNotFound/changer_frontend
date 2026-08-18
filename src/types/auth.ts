export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponseData = {
  user: User;
  accessToken: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  password: string;
};

export type ResendVerificationRequest = {
  email: string;
};
