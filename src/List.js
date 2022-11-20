import * as React from "react";
import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { useLongPress } from "use-long-press";

import styled from "@emotion/styled";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import DateTimePicker from "react-datetime-picker";

import { Stack } from "@mui/material";

import { listState, LS_KEY_NAME, DAYJS_FORMAT } from "./state";
import dayjs from "dayjs";

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
    setList((curr) => {
      const key = context;

      const next = curr.map((item) => ({
        ...item,
        label: item.label,
        editing: item.key === key ? !item.editing : item.editing,
      }));

      return next;
    });
  });

  const handleDateTimeChange = useCallback((value, key) => {
    setList((curr) => {
      const next = curr.map((item) => ({
        ...item,
        ...(item.key === key
          ? {
              time: dayjs(value),
              label: dayjs(value).format(DAYJS_FORMAT),
            }
          : null),
      }));

      window.localStorage.setItem(LS_KEY_NAME, JSON.stringify(next));

      return next;
    });
  }, []);

  return (
    <Stack spacing={1}>
      {list.map((item) => {
        return (
          <Item key={item.key} {...handleEdit(item.key)}>
            {item.editing ? (
              <DateTimePicker
                onChange={(e) => handleDateTimeChange(e, item.key)}
                value={dayjs(item.time).toDate()}
                disableClock
              />
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
              />
            )}
          </Item>
        );
      })}
    </Stack>
  );
}
