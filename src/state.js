import { atom } from "recoil";
import dayjs from "dayjs";

export const DAYJS_FORMAT = "D MMMM YY, h:mm A";

const INTERVAL_LENGTH_HOURS = 6;

export const LS_KEY_NAME = "lamer/listState";

// By default, get the last 1 interval entries.
const startTimes = dayjs(new Date()).subtract(INTERVAL_LENGTH_HOURS, "hours");

const nextTimes = Array(4)
  .fill(0)
  .reduce(
    (acc, curr, i) => {
      const next = dayjs(acc[i]).add(INTERVAL_LENGTH_HOURS, "hours");

      return [...acc, next];
    },
    [startTimes]
  );

const defaultValue = nextTimes.map((time) => ({
  time,
  label: time.format(DAYJS_FORMAT),
  checked: false,
  editing: false,
  key: `${Math.random() * 100}-${time}`,
}));

const localStorageValue = JSON.parse(window.localStorage.getItem(LS_KEY_NAME));

export const listState = atom({
  key: "list", // unique ID (with respect to other atoms/selectors)
  default: localStorageValue ?? defaultValue,
});
