import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { authQueryKeys } from "@/hooks/use-auth";
import { clearAccessToken, getAccessToken } from "@/lib/auth-token";
import SignInPage from "./sign-in-page";

afterEach(() => {
  cleanup();
  clearAccessToken();
});

describe("SignInPage", () => {
  it("로그인 성공 시 토큰과 프로필을 저장하고 메인으로 이동한다", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/sign-in"]}>
          <Routes>
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/" element={<div>메인 화면</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await user.type(screen.getByLabelText("아이디"), "admin");
    await user.type(screen.getByLabelText("비밀번호"), "password");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(await screen.findByText("메인 화면")).toBeInTheDocument();
    expect(getAccessToken()).toBe("mock-authority-access-token");
    await waitFor(() => {
      expect(queryClient.getQueryData(authQueryKeys.profile())).toEqual({
        userId: "admin",
        name: "홍길동",
        userClassCode: "ADMIN",
      });
    });
  });
});
