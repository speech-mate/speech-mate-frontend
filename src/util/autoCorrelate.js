import { normalize, findFrequency } from "./helpers";

function autoCorrelate(buffer, sampleRate) {
  const nSamples = buffer.length;
  let rms = 0;

  for (let i = 0; i < nSamples; i++) {
    const val = buffer[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / nSamples);
  if (rms < 0.01) return false;

  const autoCorrBuffer = [];

  for (let lag = 0; lag < nSamples; lag++) {
    let sum = 0;

    for (let i = 0; i < nSamples - lag; i++) {
      let sound1 = buffer[i];
      let sound2 = buffer[i + lag];
      let product = sound1 * sound2;
      sum += product;
    }

    autoCorrBuffer[lag] = sum / nSamples;
  }

  const fundamentalFrequency = findFrequency(
    normalize(autoCorrBuffer),
    sampleRate,
  );

  return fundamentalFrequency;
}

export default autoCorrelate;
