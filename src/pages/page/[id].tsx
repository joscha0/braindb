import { Box } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const Editor = dynamic(() => import("../../components/editor"), {
  ssr: false,
});

const Page: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
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
          <Editor pageId={id as string} />
        </Box>
      </main>
    </>
  );
};

export default Page;
