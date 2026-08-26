import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, useLocation } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import queryClient from "@/lib/query-client";
import { SearchPageProvider } from "./authority-search-page-provider";
import AuthoritySearchForm from "./authority-search-form";

function LocationProbe() {
  const location = useLocation();

  return <output data-testid="location-search">{location.search}</output>;
}

function renderForm(initialEntry = "/") {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <SearchPageProvider>
          <AuthoritySearchForm />
          <LocationProbe />
        </SearchPageProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  queryClient.clear();
});

describe("AuthoritySearchForm", () => {
  it("설정 옵션이 비동기로 추가되어도 기본 선택값을 유지한다", async () => {
    renderForm();

    await screen.findByRole("option", { name: "한국" });

    expect(screen.getByLabelText("전거지역")).toHaveValue("0");
    expect(screen.getByLabelText("조회표목 절단방식")).toHaveValue(
      "CONTAINS",
    );
  });

  it("Hook Form 값을 조회 URL로 반영한다", async () => {
    const user = userEvent.setup();
    renderForm();

    await screen.findByRole("option", { name: "한국" });
    await user.selectOptions(screen.getByLabelText("전거유형"), "1");
    await user.selectOptions(screen.getByLabelText("전거지역"), "1");
    await user.selectOptions(
      screen.getByLabelText("조회표목 절단방식"),
      "CONTAINS",
    );
    await user.type(screen.getByLabelText("전거제어번호"), " KAC001 ");
    await user.type(screen.getByLabelText("전거조회표목"), " 김소월 ");

    expect(screen.getByLabelText("전거유형")).toHaveValue("1");
    expect(screen.getByLabelText("전거지역")).toHaveValue("1");
    expect(screen.getByLabelText("조회표목 절단방식")).toHaveValue(
      "CONTAINS",
    );
    expect(screen.getByLabelText("전거제어번호")).toHaveValue(" KAC001 ");
    expect(screen.getByLabelText("전거조회표목")).toHaveValue(" 김소월 ");

    await user.click(screen.getByRole("button", { name: "찾기" }));

    await waitFor(() => {
      const params = new URLSearchParams(
        screen.getByTestId("location-search").textContent ?? "",
      );
      expect(Object.fromEntries(params)).toEqual({
        acType: "1",
        acRegionCode: "1",
        acControlNo: "KAC001",
        searchKeyword: "김소월",
        searchType: "CONTAINS",
      });
    });
  });

  it("화면 초기화는 조회를 다시 만들지 않고 폼과 URL을 비운다", async () => {
    const user = userEvent.setup();
    const cancelSpy = vi
      .spyOn(queryClient, "cancelQueries")
      .mockResolvedValue(undefined);
    renderForm(
      "/?acType=1&acRegionCode=1&acControlNo=KAC001&searchKeyword=%EA%B9%80%EC%86%8C%EC%9B%94&searchType=EXACT",
    );

    await screen.findByRole("option", { name: "한국" });
    expect(screen.getByLabelText("전거지역")).toHaveValue("1");
    expect(screen.getByLabelText("조회표목 절단방식")).toHaveValue("EXACT");
    await user.click(screen.getByRole("button", { name: "화면초기화" }));

    await waitFor(() => {
      expect(screen.getByLabelText("전거유형")).toHaveValue("0");
      expect(screen.getByLabelText("전거지역")).toHaveValue("0");
      expect(screen.getByLabelText("전거제어번호")).toHaveValue("");
      expect(screen.getByLabelText("전거조회표목")).toHaveValue("");
      expect(screen.getByLabelText("조회표목 절단방식")).toHaveValue(
        "CONTAINS",
      );
      expect(screen.getByTestId("location-search").textContent).toBe("");
    });
    expect(cancelSpy).toHaveBeenCalledWith({
      queryKey: ["authority-search"],
    });
  });
});
