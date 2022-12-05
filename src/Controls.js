import * as React from "react";
import { useCallback, useState } from "react";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";

import { useRecoilState } from "recoil";

import {
  listState,
  getNextTimeValues,
  LS_KEY_NAME,
  DAYJS_FORMAT,
} from "./state";
import { Typography } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Controls() {
  const [list, setList] = useRecoilState(listState);

  const restartList = useCallback(() => {
    setList([]);
    window.localStorage.clear(LS_KEY_NAME);
  }, []);

  const clearList = useCallback(() => {
    const startTimes = getNextTimeValues();
    setList(startTimes);
    window.localStorage.setItem(LS_KEY_NAME, JSON.stringify(startTimes));
  }, []);

  return (
    <Box sx={{ maxWidth: "250px" }}>
      <Button variant="text" onClick={clearList}>
        ✨ All done
      </Button>
      <Button variant="text" onClick={restartList} disabled>
        🧹 Restart
      </Button>
    </Box>
  );
}
