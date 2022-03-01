import { NOTES } from "../constants/newPractice";

// Find the biggest value in a buffer, set that value to 1.0,
// and scale every other value by the same amount.
export function normalize(data) {
  const biggestVal = Math.abs(Math.max(...data));
  return data.map((val) => val / biggestVal);
}

// Calculate the fundamental frequency of a buffer
// by finding the peaks, and counting the distance
// between peaks in samples, and converting that
// number of samples to a frequency value.
export function findFrequency(autocorr, sampleRate) {
  const nSamples = autocorr.length;
  let valOfLargestPeakSoFar = 0;
  let indexOfLargestPeakSoFar = -1;

  for (let i = 1; i < nSamples; i++) {
    const valL = autocorr[i - 1];
    const valC = autocorr[i];
    const valR = autocorr[i + 1];

    const bIsPeak = valL < valC && valR < valC;
    if (bIsPeak) {
      if (valC > valOfLargestPeakSoFar) {
        valOfLargestPeakSoFar = valC;
        indexOfLargestPeakSoFar = i;
      }
    }
  }

  const distanceToNextLargestPeak = indexOfLargestPeakSoFar - 0;
  const fundamentalFrequency = sampleRate / distanceToNextLargestPeak;

  return fundamentalFrequency;
}

export function findClosestNote(freqArr) {
  const avgFreqency =
    freqArr.reduce((pre, curr) => pre + curr) / freqArr.length;
  let low = -1;
  let high = NOTES.length;

  while (high - low > 1) {
    const pivot = Math.round((low + high) / 2);
    if (NOTES[pivot].frequency <= avgFreqency) {
      low = pivot;
    } else {
      high = pivot;
    }
  }

  if (
    Math.abs(NOTES[high].frequency - avgFreqency) <=
    Math.abs(NOTES[low].frequency - avgFreqency)
  )
    return NOTES[high];

  return NOTES[low];
}
