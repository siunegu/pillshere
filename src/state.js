import { atom } from "recoil";
import dayjs from "dayjs";

const DAYJS_FORMAT = "MMMM D, h:mm A";

const INTERVAL_LENGTH_HOURS = 6;

export const LS_KEY_NAME = "lamer/listState";

// By default, get the last 1 interval entries.
const startTimeStamp = dayjs(new Date())
  .subtract(INTERVAL_LENGTH_HOURS, "hours")
  .format(DAYJS_FORMAT);

const nextTimestamps = Array(4)
  .fill(0)
  .reduce(
    (acc, curr, i) => {
      const next = dayjs(acc[i])
        .add(INTERVAL_LENGTH_HOURS, "hours")
        .format(DAYJS_FORMAT);
      return [...acc, next];
    },
    [startTimeStamp]
  );

const defaultValue = nextTimestamps.map((timestamp) => ({
  label: timestamp,
  checked: false
}));

const localStorageValue = JSON.parse(window.localStorage.getItem(LS_KEY_NAME));

export const listState = atom({
  key: "list", // unique ID (with respect to other atoms/selectors)
  default: localStorageValue ?? defaultValue
});
