export type User = {
  id: number;
  email: string;
  password: string;
  confirmPassWord: string;
};

export type LoginUser = {
  email: string;
  password: string;
};
