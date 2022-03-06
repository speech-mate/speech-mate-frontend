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

export function findClosestNote(freq) {
  let low = -1;
  let high = NOTES.length;

  while (high - low > 1) {
    const pivot = Math.round((low + high) / 2);
    if (NOTES[pivot]?.frequency <= freq) {
      low = pivot;
    } else {
      high = pivot;
    }
  }

  if (
    Math.abs(NOTES[high]?.frequency - freq) <=
    Math.abs(NOTES[low]?.frequency - freq)
  )
    return NOTES[high];

  return NOTES[low];
}

export function getNoteRange(pitchStatus) {
  let index;
  const [dominantFreq] = Object.entries(pitchStatus)
    .sort((a, b) => a[1] - b[1])
    .pop();
  const adjustedNotes = ["C", "D", "E", "F", "G"];

  NOTES.forEach((note, i) => {
    if (note.frequency === Number(dominantFreq)) {
      index = i;
    }
  });

  return NOTES.slice(index - 2, index + 3).map((prevNote, i) => {
    return {
      ...prevNote,
      note: adjustedNotes[i],
    };
  });
}

export function findNoteInRange(freq, range) {
  let low = 0;
  let high = range.length;

  while (high - low > 1) {
    const pivot = Math.round((low + high) / 2);
    if (range[pivot]?.frequency <= freq) {
      low = pivot;
    } else {
      high = pivot;
    }
  }

  if (
    Math.abs(range[high]?.frequency - freq) <=
    Math.abs(range[low]?.frequency - freq)
  )
    return range[high];

  return range[low];
}
