import { Client as Appwrite, Account, Databases } from "appwrite";
import { atom } from "recoil";
import type { User, Page } from "./types";

export const Server: {
  endpoint: string;
  project: string;
  databaseID: string;
} = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "",
  project: process.env.NEXT_PUBLIC_APPWRITE_PROJECT ?? "",
  databaseID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "",
};

export const client = new Appwrite()
  .setEndpoint(Server.endpoint)
  .setProject(Server.project);
const account = new Account(client);
const database = new Databases(client);

export const appwrite = { account, database };

export const userState = atom<User | null>({
  key: "user",
  default: null,
});

export const pagesState = atom<Page[]>({
  key: "pages",
  default: [],
});
