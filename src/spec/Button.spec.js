import React from "react";
import { screen, render, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ButtonLarge from "../components/Button/ButtonLarge";
import ButtonSmall from "../components/Button/ButtonSmall";

afterEach(cleanup);

const buttonLarge = (
  <ButtonLarge type="button" onClick={() => console.log("click")} text="test" />
);
const buttonSmall = (
  <ButtonSmall type="button" onClick={() => console.log("click")} text="test" />
);

describe("<ButtonLarge />", () => {
  it("matches snapshot", () => {
    const { container } = render(buttonLarge);

    expect(container).toMatchSnapshot();
  });

  it("should render without crashing", () => {
    const { getByText } = render(buttonLarge);

    expect(getByText("test")).toBeInTheDocument();
  });

  it("should occur an event", () => {
    jest.spyOn(global.console, "log");

    render(buttonLarge);

    const button = screen.getByText("test");

    userEvent.click(button);

    expect(console.log).toHaveBeenCalledWith("click");
  });
});

describe("<ButtonSmall />", () => {
  it("matches snapshot", () => {
    const { container } = render(buttonSmall);

    expect(container).toMatchSnapshot();
  });

  it("should render without crashing", () => {
    const { getByText } = render(buttonSmall);

    expect(getByText("test")).toBeInTheDocument();
  });

  it("should occur an event", () => {
    jest.spyOn(global.console, "log");

    render(buttonSmall);

    const button = screen.getByText("test");

    userEvent.click(button);

    expect(console.log).toHaveBeenCalledWith("click");
  });
});
