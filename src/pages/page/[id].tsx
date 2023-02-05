import { Box, CircularProgress } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RemirrorJSON } from "remirror";
import { useRecoilState } from "recoil";
import { appwrite, pagesState, Server, userState } from "../../server/global";
import type { User, Page } from "../../server/types";

const Editor = dynamic(() => import("../../components/editor"), {
  ssr: false,
});

const Page: NextPage = () => {
  const [initialContent, setInitialContent] = useState<
    RemirrorJSON | undefined | null
  >(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useRecoilState(userState);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (user?.$id) {
      const promise = appwrite.database.getDocument(
        Server.databaseID,
        user.$id,
        id as string
      );

      promise.then(
        function (response) {
          const page = response as unknown as Page;
          const json = page.content
            ? (JSON.parse(page.content) as RemirrorJSON)
            : undefined;
          setInitialContent(json);
          setName(page.name);
          console.log(json);
          setIsLoading(false);
        },
        function (error) {
          console.log(error); // Failure
          setIsLoading(false);
        }
      );
    }
  }, [user]);

  useEffect(() => {
    if (user) return;
    appwrite.account
      .get()
      .then((response: User) => setUser(response))
      .catch((error: Error) => console.log(error));
  }, [user, setUser]);

  return (
    <>
      <Head>
        <title>NoteTaky</title>
        <meta name="description" content="Simple Note Taking" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Editor
              initialContent={initialContent!}
              pageId={id as string}
              name={name}
            />
          )}
        </Box>
      </main>
    </>
  );
};

export default Page;
