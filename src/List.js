import * as React from "react";
import { useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import { useLongPress } from "use-long-press";

import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";

import IconButton from "@mui/material/IconButton";
import DateTimePicker from "react-datetime-picker";

import { Stack } from "@mui/material";

import { listState, LS_KEY_NAME, DAYJS_FORMAT } from "./state";
import dayjs from "dayjs";

const Checkbox = styled.div`
  display: grid;
  gap: 6px;
  grid-auto-flow: column;
  align-content: center;
  justify-content: space-around;
  align-items: center;
`;

const Item = styled.div`
  display: flex;
  justify-content: flex-start;
  height: 42px;
  min-width: 225px;
  margin: 0;

  &:hover {
    background-color: aliceblue;
  }
`;

const DateTimeWrapper = styled.div`
  display: flex;
  padding: 8px 0;

  .react-datetime-picker__wrapper {
    border: none;
  }
`;

const fadeIn = keyframes`
   from {
        opacity: 0;
        transform: translateY(100%);
    }
    to { opacity: 1 }
`;

const fadeInStyles = css`
  animation: ${fadeIn} 450ms cubic-bezier(0.25, 0.21, 0.21, 0.8);
`;

const FadeIn = styled.div`
  ${fadeInStyles}
`;

const DateTimePortal = styled.div`
  position: fixed;
  bottom: 10%;
  left: 50%;
  transform: translate(-50%, 0%);

  .react-calendar {
    border: none;

    ${fadeInStyles}

    padding: 24px;
    border-radius: 24px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  }
`;

export default function List() {
  const [list, setList] = useRecoilState(listState);

  // This is so we can get the reference of the portal element
  const [portalContainerEl, setPortalContainerEl] = useState(null);
  const handleContainerRef = useCallback((node) => {
    setPortalContainerEl(node);

    return node;
  }, []);

  const handleCheckBoxChange = useCallback(
    (e) => {
      setList((curr) => {
        const checked = e.target.checked;
        const label = e.target.labels[0].innerText;

        const next = curr.map((item) => ({
          ...item,
          checked: item.label === label ? checked : item.checked,
        }));

        window.localStorage.setItem(LS_KEY_NAME, JSON.stringify(next));

        return next;
      });
    },
    [setList]
  );

  const handleEdit = (context) => {
    setList((curr) => {
      const key = context;

      const next = curr.map((item) => ({
        ...item,
        label: item.label,
        editing: item.key === key ? !item.editing : item.editing,
      }));

      window.localStorage.setItem(LS_KEY_NAME, JSON.stringify(next));

      return next;
    });
  };

  const handleEditLongPress = useLongPress((e, { context }) => {
    handleEdit(context);
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
    <>
      <Stack spacing={1}>
        {list.map((item) => {
          return (
            <Item key={item.key} {...handleEditLongPress(item.key)}>
              {item.editing ? (
                <DateTimeWrapper>
                  <DateTimePicker
                    onChange={(e) => handleDateTimeChange(e, item.key)}
                    value={dayjs(item.time).toDate()}
                    calendarIcon={null}
                    clearIcon={null}
                    portalContainer={portalContainerEl}
                    disableClock
                    closeWidgets={false}
                  />
                  <IconButton
                    color="primary"
                    aria-label="Confirm date time change"
                    component="label"
                    onClick={() => handleEdit(item.key)}
                  >
                    👌
                  </IconButton>
                </DateTimeWrapper>
              ) : (
                <Checkbox>
                  <input
                    type="checkbox"
                    id={item.label}
                    name={item.label}
                    checked={item.checked}
                    onChange={handleCheckBoxChange}
                  />
                  <label htmlFor={item.label}>{item.label}</label>
                </Checkbox>
              )}
            </Item>
          );
        })}
      </Stack>
      <DateTimePortal ref={handleContainerRef} />
    </>
  );
}
