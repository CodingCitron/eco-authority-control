import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import AuthorityPersonalFormPage from "./authority-personal-form-page";

afterEach(() => {
  cleanup();
});

describe("AuthorityPersonalFormPage", () => {
  it("입력 화면을 초기화하면 왼쪽 폼과 오른쪽 MARC 레코드를 함께 비운다", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthorityPersonalFormPage mode="create" />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await user.type(screen.getByLabelText("채택표목"), "김소월");
    await user.click(screen.getByRole("button", { name: "채택표목 추가" }));

    expect(screen.getByLabelText("채택표목")).toHaveValue("김소월");
    expect(screen.getByLabelText("100 행")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "화면 초기화" }));

    expect(screen.getByLabelText("채택표목")).toHaveValue("");
    expect(screen.queryByLabelText("100 행")).not.toBeInTheDocument();
  });
});
