import {INITIAL_STATE} from "@/context/AuthContext.tsx";
import {Models} from "appwrite";

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type IContextType = typeof INITIAL_STATE

export interface User extends Models.Document {
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
  imageId: string;
  save: Save[];
  accountId: string
}

export interface Save extends Models.Document {
  post: Post,
  user: User
}

export interface Post extends Models.Document {
  creator: User;
  likes: User[],
  caption: string,
  tags: string[],
  imageUrl: string;
  imageId: string;
  location: string;
}