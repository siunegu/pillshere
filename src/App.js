import * as React from "react";
import { RecoilRoot } from "recoil";
import { useRecoilState } from "recoil";
import { useDoubleTap } from "use-double-tap";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

import styled from "@emotion/styled";

import List from "./List";

import { listState, LS_KEY_NAME } from "./state";

const Background = styled.div`
  height: 100vh;
`;

const ColoredGradientText = styled.span`
  background: rgb(63, 94, 251);
  background: linear-gradient(
    270deg,
    rgba(63, 94, 251, 1) 0%,
    rgba(252, 70, 107, 1) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

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
      align="left"
      sx={{
        margin: "0 auto 64px",
        maxWidth: "235px",
      }}
    >
      <span role="img" aria-label="pill-emoji">
        💊
      </span>{" "}
      <ColoredGradientText>
        <em>
          PILLS <strong>HERE!</strong>
        </em>
      </ColoredGradientText>{" "}
      <br />
      This tool aims to give you a hand at remembering you have taken any
      medications last.
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
    <Background>
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
    </Background>
  );
}

export default function App() {
  return (
    <RecoilRoot>
      <ConnectedApp />
    </RecoilRoot>
  );
}
