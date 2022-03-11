import styled from "styled-components";

export const NewPracticeLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: inherit;

  button:disabled {
    background-color: var(--ice-grey-color);
    color: var(--dark-grey-blue-color);
  }
`;

export const StepOneBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: inherit;
  height: inherit;

  h3 {
    font-size: 25px;
    position: relative;
    top: 5%;
  }

  p {
    position: relative;
    top: 10%;
    width: 88%;
    font-size: 21px;
    line-height: 135%;
    text-align: left;
  }
`;

export const SelectToneBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  top: 12%;
  width: inherit;

  button {
    margin-top: 35px;
  }
`;

export const StepTwoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: inherit;
  height: inherit;

  p {
    position: relative;
    top: 10%;
    width: 83%;
    font-size: 21px;
    line-height: 140%;
    text-align: left;
  }

  span {
    position: relative;
    font-size: 40px;
    font-weight: 600;
    top: 15%;
  }

  button {
    position: relative;
    top: 31.8%;
  }
`;

export const FrequencyBox = styled.div`
  position: absolute;
  font-size: 27px;
  font-weight: 600;
  top: 25%;
`;

export const LogoBox = styled.div`
  position: relative;
  top: 15%;
`;

export const StepThreeBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: inherit;
  height: inherit;

  label {
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 88%;
    margin-top: 20px;
    font-size: 21px;

    div {
      margin: 10px 0px;

      input {
        height: 35px;
        font-size: 20px;
        border: none;
        border-radius: 4px;
      }

      div {
        margin: 0;
      }
    }
  }

  button {
    position: absolute;
    bottom: 11%;
  }

  input:focus {
    outline: none;
  }
`;

export const ValidationMessage = styled.span`
  display: ${(props) => props.validation && "none"};
  position: relative;
  margin-top: 5px;
`;

export const SpeechTimeBox = styled.div`
  display: flex;
  align-items: center;

  input {
    width: 30px;
    margin: 0px 5px;
    text-align: center;
  }
`;

export const ThemeBox = styled.div`
  width: 100%;

  input {
    width: 100%;
  }
`;

export const SubThemeBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  #subThemeMin,
  #subThemeSec {
    width: 30px;
    margin-right: 5px;
    text-align: center;
  }

  span {
    margin-right: 5px;
  }

  div {
    display: flex;
    align-items: center;
    width: 70%;
    border-radius: 4px;
    background-color: white;

    input {
      width: 75%;
      border: none;
    }

    button {
      position: relative;
      margin-right: 5px;
    }
  }
`;

export const SubThemeList = styled.ul`
  width: 88%;
  height: 35%;
  overflow-y: auto;

  ::-webkit-scrollbar {
    display: none;
  }

  li {
    display: flex;
    justify-content: center;
    width: 100%;
    border-bottom: 1px solid white;
    margin-top: 25px;

    span {
      display: inline-block;
      height: 35px;
      font-size: 21px;
      text-align: center;

      &:nth-child(1) {
        width: 25%;
      }

      &:nth-child(2) {
        width: 65%;
      }
    }

    i {
      font-size: 20px;
    }
  }
`;

export const StepFourBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: inherit;
  height: inherit;

  h1 {
    font-size: 30px;
    margin-top: 30px;
  }
`;

export const TimeBox = styled.div`
  margin-top: 15px;

  span {
    font-size: 24px;
  }
`;

export const FlashCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 25%;
  background: white;
  border-radius: 4px;
  margin-top: 22px;
  color: black;
  font-size: 21px;
`;

export const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 11%;
  width: inherit;

  button {
    &:nth-child(2) {
      margin-top: 20px;
    }
  }
`;

export const IndicatorBox = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  position: absolute;
  top: 60%;

  span {
    margin-bottom: 10px;
  }
`;
