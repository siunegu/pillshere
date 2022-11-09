import * as React from "react";
import { useCallback } from "react";
import { useRecoilState } from "recoil";
import styled from "@emotion/styled";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Stack } from "@mui/material";

import { listState, LS_KEY_NAME } from "./state";

const Item = styled.div`
  margin: 0;
  padding: 8;
  &:hover {
    background-color: aliceblue;
  }
`;

export default function List() {
  const [list, setList] = useRecoilState(listState);

  const handleChange = useCallback(
    (e) => {
      setList((curr) => {
        const checked = e.target.checked;
        const label = e.target.labels[0].innerText;

        const next = curr.map((item) => ({
          label: item.label,
          checked: item.label === label ? checked : item.checked
        }));

        window.localStorage.setItem(LS_KEY_NAME, JSON.stringify(next));

        return next;
      });
    },
    [setList]
  );

  return (
    <Stack spacing={1}>
      {list.map((item) => {
        return (
          <Item key={item.label}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={item.checked}
                  onChange={handleChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label={item.label}
            />
          </Item>
        );
      })}
    </Stack>
  );
}
