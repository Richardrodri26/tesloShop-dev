import { Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: string;
  user?: IUser;
  _id?: Types.ObjectId | string;

  createdAt?: string;
  updatedAt?:string;
}