import { Box, Button, Typography } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";
import router from "next/router";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { appwrite, userState } from "../server/global";
import type { User } from "../server/types";

const Account: NextPage = () => {
  const [user, setUser] = useRecoilState(userState);

  const logout = async () => {
    await appwrite.account.deleteSession("current");
    setUser(null);
    window.localStorage.removeItem("jwt");
    window.localStorage.removeItem("jwt_expire");
    await router.push("/login");
  };
  useEffect(() => {
    if (user) return;

    appwrite.account
      .get()
      .then((response: User) => setUser(response))
      .catch(() => router.push("/login"));
  }, [user, setUser]);

  return (
    <>
      <Head>
        <title>Account - BrainDB</title>
        <meta name="description" content="Smart Notes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          <Typography>Account</Typography>
          <Typography>{user?.email}</Typography>
          <Button onClick={() => void logout()}>Logout</Button>
        </Box>
      </main>
    </>
  );
};

export default Account;
