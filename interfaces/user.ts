export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: string;

  createdAt?: string;
  updatedAt?:string;
}