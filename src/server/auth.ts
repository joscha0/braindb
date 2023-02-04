import { Client as Appwrite, Account, Databases } from "appwrite";

export const Server: {
  endpoint: string;
  project: string;
  databaseID: string;
} = {
  endpoint: process.env.REACT_APP_ENDPOINT ?? "",
  project: process.env.REACT_APP_PROJECT ?? "",
  databaseID: process.env.REACT_APP_DATABASE_ID ?? "",
};

export const client = new Appwrite()
  .setEndpoint(Server.endpoint)
  .setProject(Server.project);
const account = new Account(client);
const database = new Databases(client);

export const appwrite = { account, database };
