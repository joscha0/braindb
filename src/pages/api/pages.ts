import { AppwriteException, ID, Role, Permission } from "appwrite";
import type { NextApiRequest, NextApiResponse } from "next";
import { appwrite, Server } from "../../server/global";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { jwt } = req.headers;
  const payload = JSON.parse(req.body || null);

  if (!jwt) {
    return;
  }

  appwrite.account.client.setJWT(jwt.toString());

  try {
    switch (req.method?.toUpperCase()) {
      case "GET":
        res
          .status(200)
          .json(
            await appwrite.database.listDocuments(
              Server.databaseID,
              payload.user
            )
          );
        break;

      case "POST":
        res
          .status(200)
          .json(
            await appwrite.database.createDocument(
              Server.databaseID,
              payload.user,
              ID.unique(),
              payload.page,
              [
                Permission.read(Role.user(payload.user)),
                Permission.update(Role.user(payload.user)),
                Permission.delete(Role.user(payload.user)),
                Permission.write(Role.user(payload.user)),
              ]
            )
          );
        break;

      case "PATCH":
        res
          .status(200)
          .json(
            await appwrite.database.updateDocument(
              Server.databaseID,
              payload.user,
              payload.todo.$id,
              payload.todo,
              [
                Permission.read(Role.user(payload.user)),
                Permission.update(Role.user(payload.user)),
                Permission.delete(Role.user(payload.user)),
                Permission.write(Role.user(payload.user)),
              ]
            )
          );
        break;

      case "DELETE":
        res
          .status(200)
          .json(
            await appwrite.database.deleteDocument(
              Server.databaseID,
              payload.user,
              payload.page.$id
            )
          );
        break;

      default:
        res.send(true);
        break;
    }
  } catch (error) {
    console.log((error as AppwriteException).message);
    res.status(401).json(error as AppwriteException);
  }
};
