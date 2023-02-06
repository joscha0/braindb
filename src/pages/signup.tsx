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
import { ID } from "appwrite";
import { object, string, type TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type FormProps = {
  name: string;
  email: string;
  password: string;
};

const signupSchema = object({
  name: string().min(1, "Name is required").max(70),
  email: string().min(1, "Email is required").email("Email is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  passwordConfirm: string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Passwords do not match",
});

type ISignUp = TypeOf<typeof signupSchema>;

const SignUp: NextPage = () => {
  const [alert, setAlert] = useState("");

  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();

  const defaultValues: ISignUp = {
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  };

  const formContext = useForm<ISignUp>({
    resolver: zodResolver(signupSchema),
    defaultValues,
  });

  const { handleSubmit } = formContext;

  const signup = async (values: FormProps) => {
    try {
      await appwrite.account.create(
        ID.unique(),
        values.email,
        values.password,
        values.name
      );
      setUser(
        (await appwrite.account.createEmailSession(
          values.email,
          values.password
        )) as unknown as User
      );
      await router.push("/");
    } catch (error) {
      setAlert((error as Error).message);
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
            Sign Up
          </Typography>

          {alert && <Alert severity="error">{alert}</Alert>}

          <FormContainer
            formContext={formContext}
            handleSubmit={handleSubmit(signup)}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextFieldElement label="Name" type="text" name="name" required />
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
              <TextFieldElement
                type="password"
                label="Confirm Password"
                name="passwordConfirm"
                required
              />
              <Typography>
                Already have an account?{" "}
                <Link component={NextLink} href="/login">
                  Login
                </Link>
              </Typography>
              <LoadingButton
                loading={false}
                type="submit"
                variant="contained"
                sx={{
                  py: "0.8rem",
                  mt: 2,
                  width: "80%",
                  marginInline: "auto",
                }}
              >
                Sign Up
              </LoadingButton>
            </Box>
          </FormContainer>
        </Box>
      </main>
    </>
  );
};

export default SignUp;
