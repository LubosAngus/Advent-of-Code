import chalk from "chalk";
import formatTime from "./format-time";

const startTimes = new Map();
const finishedTimes = new Map();

function start(key: string) {
  startTimes.set(key, performance.now());
}

function stop(key: string) {
  const startTime = startTimes.get(key);
  const endTime = performance.now();

  startTimes.delete(key);
  finishedTimes.set(key, endTime - startTime);
}

function read(key: string) {
  return formatTime(finishedTimes.get(key));
}

const timer = {
  start,
  stop,
  read,
};

export default timer;
