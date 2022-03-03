export function formatMin(min) {
  return min < 10 ? `0${min}` : min;
}

export function formatSec(sec) {
  return sec < 10 ? `0${sec}` : sec;
}

export function convertToSec(min, sec) {
  return min * 60 + sec;
}
