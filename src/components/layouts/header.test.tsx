import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { authQueryKeys } from "@/hooks/use-auth";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/auth-token";
import Header from "./header";

afterEach(() => {
  cleanup();
  clearAccessToken();
});

describe("Header", () => {
  it("로그아웃하면 토큰과 프로필을 정리하고 로그인 화면으로 이동한다", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    queryClient.setQueryData(authQueryKeys.profile(), {
      userId: "admin",
      name: "홍길동",
      userClassCode: "ADMIN",
    });
    setAccessToken("mock-authority-access-token");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Header />} />
            <Route path="/sign-in" element={<div>로그인 화면</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("홍길동(admin)")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "로그아웃" }));

    expect(await screen.findByText("로그인 화면")).toBeInTheDocument();
    expect(getAccessToken()).toBeNull();
    await waitFor(() => {
      expect(queryClient.getQueryData(authQueryKeys.profile())).toBeUndefined();
    });
  });
});
