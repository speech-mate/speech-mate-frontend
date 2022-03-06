export const STEP = {
  ONE: "selectSpeechTone",
  TWO: "getUserPitch",
  THREE: "inputSpeechSettings",
  FOUR: "recordSpeech",
};

export const TEXT_CONTENTS = {
  ONE: {
    TITLE: "어떤 스피치를 연습하시나요?",
    INSTRUCTION: `Speech Mate는 피아노에 '도레미파솔' 높낮이가 있는 것처럼 생각과 감정을
    표현할 때 목소리의 높낮이를 다르게 해서 표현할 수 있게 도와드려요.`,
  },
  TWO: {
    INSTRUCTION:
      "먼저 자신의 목소리를 편안하게 5초간 내어볼까요? 지금 목소리가 '미'정도의 톤이라고 가정하고 스피치 연습을 시작해 볼게요.",
  },
};

export const SELECTIONS = {
  ONE: [
    {
      TEXT: "도 - 위로, 힘든 일 말할 때",
      NOTE: "C",
    },
    {
      TEXT: "레 - 회의, 보고, 제안, 권유",
      NOTE: "D",
    },
    {
      TEXT: "미 - 일상 대화",
      NOTE: "E",
    },
    {
      TEXT: "파 - 연설, 프레젠테이션 주장 강조",
      NOTE: "F",
    },
    {
      TEXT: "솔 - 인사, 칭찬, 감사",
      NOTE: "G",
    },
  ],
  TWO: ["목소리 샘플 녹음하기", "스피치 설정 페이지로"],
};

export const NOTES = [
  {
    note: "E",
    frequency: 82.41,
    octave: 2,
  },
  {
    note: "F",
    frequency: 87.31,
    octave: 2,
  },
  {
    note: "G",
    frequency: 98.0,
    octave: 2,
  },
  {
    note: "A",
    frequency: 110.0,
    octave: 2,
  },
  {
    note: "B",
    frequency: 123.5,
    octave: 2,
  },
  {
    note: "C",
    frequency: 130.8,
    octave: 3,
  },
  {
    note: "D",
    frequency: 146.8,
    octave: 3,
  },
  {
    note: "E",
    frequency: 164.8,
    octave: 3,
  },
  {
    note: "F",
    frequency: 174.6,
    octave: 3,
  },
  {
    note: "G",
    frequency: 196.0,
    octave: 3,
  },
  {
    note: "A",
    frequency: 220.0,
    octave: 3,
  },
  {
    note: "B",
    frequency: 246.9,
    octave: 3,
  },
  {
    note: "C",
    frequency: 261.6,
    octave: 4,
  },
  {
    note: "D",
    frequency: 293.7,
    octave: 4,
  },
  {
    note: "E",
    frequency: 329.6,
    octave: 4,
  },
  {
    note: "F",
    frequency: 349.2,
    octave: 4,
  },
  {
    note: "G",
    frequency: 392.0,
    octave: 4,
  },
  {
    note: "A",
    frequency: 440.0,
    octave: 4,
  },
  {
    note: "B",
    frequency: 493.9,
    octave: 4,
  },
];
