export const STEP = {
  ONE: "selectSpeechTone",
  TWO: "getUserPitch",
  THREE: "inputSpeechSettings",
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
      NODE: "C",
    },
    {
      TEXT: "레 - 회의, 보고, 제안, 권유",
      NODE: "D",
    },
    {
      TEXT: "미 - 일상 대화",
      NODE: "E",
    },
    {
      TEXT: "파 - 연설, 프레젠테이션 주장 강조",
      NODE: "F",
    },
    {
      TEXT: "솔 - 인사, 칭찬, 감사",
      NODE: "G",
    },
  ],
  TWO: ["목소리 샘플 녹음하기", "스피치 설정 페이지로"],
};
