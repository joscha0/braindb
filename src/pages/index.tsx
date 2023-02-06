import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import List from "../components/list";
import { appwrite, pagesState, Server, userState } from "../server/global";
import type { Page, User } from "../server/types";

const Home: NextPage = () => {
  const [isLoading, setLoading] = useState(true);

  const [pages, setPages] = useRecoilState(pagesState);
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    if (user?.$id) {
      const promise = appwrite.database.listDocuments(
        Server.databaseID,
        user.$id
      );

      promise.then(
        function (response) {
          setPages(response.documents as unknown as Page[]);
          setLoading(false);
        },
        function (error) {
          console.log(error); // Failure
          setLoading(false);
        }
      );
    }
  }, [user, setPages]);

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
          {user ? (
            isLoading ? (
              <CircularProgress />
            ) : (
              <List pages={pages} user={user} setPages={setPages} />
            )
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                gap: 2,
              }}
            >
              <Typography variant="h3">NoteTaky</Typography>
              <Typography variant="h5">Simple Note Taking</Typography>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button variant="outlined" component={Link} href="/login">
                  Login
                </Button>
                <Button variant="contained" component={Link} href="/signup">
                  Sign Up
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </main>
    </>
  );
};

export default Home;
