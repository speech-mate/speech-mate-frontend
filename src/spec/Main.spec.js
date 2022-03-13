import React from "react";
import { MemoryRouter } from "react-router-dom";

import { render, screen, cleanup } from "@testing-library/react";
import Main from "../pages/Main";

jest.mock("../hooks/useAuth", () => ({
  __esModule: true,
  default: () => {
    return {
      auth: {
        user: {
          photo: "test-user-photo",
          nickname: "test user",
        },
      },
    };
  },
}));

afterEach(cleanup);

const main = (
  <MemoryRouter initialEntries={[{ pathname: "/" }]}>
    <Main />
  </MemoryRouter>
);

describe("<Main />", () => {
  it("matches snapshot", () => {
    const { container } = render(main);

    expect(container).toMatchSnapshot();
  });

  it("should render profile photo and greeting message", async () => {
    render(main);

    const profilePhoto = screen.getByAltText("user-profile-photo");

    expect(profilePhoto).toBeInTheDocument();
    expect(profilePhoto.src).toContain("test-user-photo");
    expect(screen.getByText("test user님 안녕하세요!")).toBeInTheDocument();
  });
});
