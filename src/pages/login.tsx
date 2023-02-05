import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { appwrite, userState } from "../server/global";
import { User } from "../server/types";
import { NextPage } from "next";
import Head from "next/head";
import { Alert, Box, Link, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { ID } from "appwrite";

type FormProps = {
  name: string;
  email: string;
  password: string;
};

const Login: NextPage = () => {
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();

  const signup = async (values: FormProps) => {
    try {
      setLoading(true);
      setUser(
        (await appwrite.account.createEmailSession(
          values.email,
          values.password
        )) as unknown as User
      );
      setLoading(false);
      router.push("/");
    } catch (error) {
      setAlert((error as Error).message);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>SignUp - NoteTaky</title>
        <meta name="description" content="Simple Note Taking" />
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
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1">
            Login
          </Typography>

          {alert && <Alert severity="error">{alert}</Alert>}

          <FormContainer onSuccess={signup}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextFieldElement
                label="Email"
                type="email"
                name="email"
                required
              />
              <TextFieldElement
                type="password"
                label="Password"
                name="password"
                required
              />
              <Typography>
                Don't have an account?{" "}
                <Link component={NextLink} href="/signup">
                  Sign Up
                </Link>
              </Typography>
              <LoadingButton
                loading={loading}
                type="submit"
                variant="contained"
                sx={{
                  py: "0.8rem",
                  mt: 2,
                  width: "80%",
                  marginInline: "auto",
                }}
              >
                Login
              </LoadingButton>
            </Box>
          </FormContainer>
        </Box>
      </main>
    </>
  );
};

export default Login;
