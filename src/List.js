import * as React from "react";
import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { useLongPress } from "use-long-press";

import styled from "@emotion/styled";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

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

  const handleCheckBoxChange = useCallback(
    (e) => {
      setList((curr) => {
        const checked = e.target.checked;
        const label = e.target.labels[0].innerText;

        const next = curr.map((item) => ({
          ...item,
          label: item.label,
          checked: item.label === label ? checked : item.checked,
        }));

        window.localStorage.setItem(LS_KEY_NAME, JSON.stringify(next));

        return next;
      });
    },
    [setList]
  );

  const handleEdit = useLongPress((e, { context }) => {
    console.log("Long pressed!", e, context);
    setList((curr) => {
      const label = context;
      const editing = true;

      const next = curr.map((item) => ({
        ...item,
        label: item.label,
        editing: item.label === label ? editing : item.editing,
      }));
      console.info("state ", next);
      return next;
    });
  });

  const handleDateTimeChange = useCallback((e, label) => {
    console.info("handleDateTimeChange ", e);
    setList((curr) => {
      const editing = false;

      const next = curr.map((item) => ({
        ...item,
        label: item.label,
        editing: item.label === label ? editing : item.editing,
      }));
      console.info("state ", next);
      return next;
    });
  }, []);

  return (
    <Stack spacing={1}>
      {list.map((item) => {
        return (
          <Item key={item.label}>
            {item.editing ? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Date&Time picker"
                  value={item.label}
                  onChange={(e) => handleDateTimeChange(e, item.label)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            ) : (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.checked}
                    onChange={handleCheckBoxChange}
                    inputProps={{
                      "aria-label": "controlled",
                    }}
                  />
                }
                label={item.label}
                {...handleEdit(item.label)}
              />
            )}
          </Item>
        );
      })}
    </Stack>
  );
}
