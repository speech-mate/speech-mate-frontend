const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;

export function getAudioContext() {
  return audioCtx;
}

export function getAnalyser() {
  return analyser;
}
