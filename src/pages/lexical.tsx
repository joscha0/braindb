import { Box, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("../components/lexical/Editor"), {
  ssr: false,
});

const Lexical: NextPage = () => {
  return (
    <>
      <Head>
        <title>BrainDB - Lexical</title>
        <meta name="description" content="Smart Notes" />
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

export default Lexical;
