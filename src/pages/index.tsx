import { Box } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("../components/editor"), {
  ssr: false,
});

const Home: NextPage = () => {
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
          <Editor />
        </Box>
      </main>
    </>
  );
};

export default Home;
