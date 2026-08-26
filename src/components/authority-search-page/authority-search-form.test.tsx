import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    <MemoryRouter initialEntries={[initialEntry]}>
      <SearchPageProvider>
        <AuthoritySearchForm />
        <LocationProbe />
      </SearchPageProvider>
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  queryClient.clear();
});

describe("AuthoritySearchForm", () => {
  it("Hook Form 값을 조회 URL로 반영한다", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.selectOptions(screen.getByLabelText("전거유형"), "1");
    await user.selectOptions(screen.getByLabelText("전거지역"), "한국");
    await user.type(screen.getByLabelText("전거제어번호"), " KAC001 ");
    await user.type(screen.getByLabelText("전거조회표목"), " 김소월 ");

    expect(screen.getByLabelText("전거유형")).toHaveValue("1");
    expect(screen.getByLabelText("전거지역")).toHaveValue("한국");
    expect(screen.getByLabelText("전거제어번호")).toHaveValue(" KAC001 ");
    expect(screen.getByLabelText("전거조회표목")).toHaveValue(" 김소월 ");

    await user.click(screen.getByRole("button", { name: "찾기" }));

    await waitFor(() => {
      const params = new URLSearchParams(
        screen.getByTestId("location-search").textContent ?? "",
      );
      expect(Object.fromEntries(params)).toEqual({
        acType: "1",
        acRegionCode: "한국",
        acControlNo: "KAC001",
        searchKeyword: "김소월",
      });
    });
  });

  it("화면 초기화는 조회를 다시 만들지 않고 폼과 URL을 비운다", async () => {
    const user = userEvent.setup();
    const cancelSpy = vi
      .spyOn(queryClient, "cancelQueries")
      .mockResolvedValue(undefined);
    renderForm(
      "/?acType=1&acRegionCode=%ED%95%9C%EA%B5%AD&acControlNo=KAC001&searchKeyword=%EA%B9%80%EC%86%8C%EC%9B%94",
    );

    await user.click(screen.getByRole("button", { name: "화면초기화" }));

    await waitFor(() => {
      expect(screen.getByLabelText("전거유형")).toHaveValue("0");
      expect(screen.getByLabelText("전거지역")).toHaveValue("all");
      expect(screen.getByLabelText("전거제어번호")).toHaveValue("");
      expect(screen.getByLabelText("전거조회표목")).toHaveValue("");
      expect(screen.getByTestId("location-search").textContent).toBe("");
    });
    expect(cancelSpy).toHaveBeenCalledWith({
      queryKey: ["authority-search"],
    });
  });
});
