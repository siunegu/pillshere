import * as React from "react";
import { RecoilRoot } from "recoil";
import { useRecoilState } from "recoil";
import { useDoubleTap } from "use-double-tap";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

import List from "./List";

import { listState, LS_KEY_NAME } from "./state";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://www.linkedin.com/in/siunegu/">
        Eugene Lai
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function Reminder() {
  return (
    <Typography
      variant="body2"
      noWrap={false}
      color="text.secondary"
      align="center"
      sx={{
        margin: "0 auto 64px",
        maxWidth: "250px",
      }}
    >
      <em>
        Pills <strong>HERE</strong>!
      </em>{" "}
      <span role="img" aria-label="pill-emoji">
        💊
      </span>{" "}
      <br />
      Remember to take your medication!
    </Typography>
  );
}

function ConnectedApp() {
  const [_, setList] = useRecoilState(listState);

  const blurEdit = useDoubleTap(() => {
    setList((curr) => {
      const next = curr.map((item) => ({
        ...item,
        editing: false,
      }));

      window.localStorage.setItem(LS_KEY_NAME, JSON.stringify(next));

      return next;
    });
  });

  return (
    <>
      <Box
        sx={{
          padding: 8,
          margin: 0,
          display: "flex",
          justifyContent: "center",
        }}
        {...blurEdit}
      >
        <List />
      </Box>
      <Reminder />
      <Copyright />
    </>
  );
}

export default function App() {
  return (
    <RecoilRoot>
      <ConnectedApp />
    </RecoilRoot>
  );
}
