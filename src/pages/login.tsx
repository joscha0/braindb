import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { appwrite, userState } from "../server/global";
import type { User } from "../server/types";
import type { NextPage } from "next";
import Head from "next/head";
import { Alert, Box, Link, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui";
import { literal, object, string, type TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type FormProps = {
  email: string;
  password: string;
};

const loginSchema = object({
  email: string().min(1, "Email is required").email("Email is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  persistUser: literal(true).optional(),
});

type ILogin = TypeOf<typeof loginSchema>;

const Login: NextPage = () => {
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();

  const defaultValues: ILogin = {
    email: "",
    password: "",
  };

  const formContext = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const { handleSubmit } = formContext;

  const login = async (values: FormProps) => {
    try {
      setLoading(true);
      setUser(
        (await appwrite.account.createEmailSession(
          values.email,
          values.password
        )) as unknown as User
      );
      setLoading(false);
      await router.push("/");
    } catch (error) {
      setAlert((error as Error).message);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>SignUp - BrainDB</title>
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
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1">
            Login
          </Typography>

          {alert && <Alert severity="error">{alert}</Alert>}

          <FormContainer
            formContext={formContext}
            handleSubmit={handleSubmit(login)}
          >
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
                Don&apos;t have an account?{" "}
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
