import React from "react";
import { MemoryRouter } from "react-router-dom";

import { render, screen, cleanup, waitFor } from "@testing-library/react";
import Error from "../pages/Error";

afterEach(cleanup);

const error = (initialEntries) => (
  <MemoryRouter initialEntries={initialEntries}>
    <Error />
  </MemoryRouter>
);

describe("<Error />", () => {
  it("should render error with error message when specific error state given", async () => {
    await waitFor(() =>
      render(
        error([
          {
            pathname: "/error",
            state: {
              error: { code: 500, message: "Internal Server Error" },
            },
          },
        ]),
      ),
    );

    expect(screen.getByText("500 Internal Server Error")).toBeInTheDocument();
    expect(screen.getByText("메인 페이지로")).toBeInTheDocument();
  });

  it("should render error with default error message when no error state given", async () => {
    await waitFor(() =>
      render(
        error([
          {
            pathname: "/error",
            state: {},
          },
        ]),
      ),
    );

    expect(screen.getByText("404 Not Found")).toBeInTheDocument();
    expect(screen.getByText("메인 페이지로")).toBeInTheDocument();
  });
});
