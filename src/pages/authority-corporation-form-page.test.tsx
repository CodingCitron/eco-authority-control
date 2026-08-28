import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchAuthorityCreate } from "@/api/authority-create";
import { fetchAuthorityUpdate } from "@/api/authority-update";
import {
  authorityDetailKeys,
  useAuthorityDetail,
} from "@/hooks/use-authority-detail";

import AuthorityCorporationFormPage from "./authority-corporation-form-page";

vi.mock("@/api/authority-create", () => ({
  fetchAuthorityCreate: vi.fn(),
}));
vi.mock("@/api/authority-update", () => ({
  fetchAuthorityUpdate: vi.fn(),
}));
vi.mock("@/hooks/use-authority-detail", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/hooks/use-authority-detail")>();

  return {
    ...actual,
    useAuthorityDetail: vi.fn(() => ({ data: undefined })),
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.mocked(useAuthorityDetail).mockReturnValue({ data: undefined } as never);
});

function CurrentLocationProbe() {
  const location = useLocation();
  return (
    <output data-testid="current-location">
      {location.pathname}
      {location.search}
    </output>
  );
}

function createDetailResponse(recKey = "corporation-1") {
  return {
    data: {
      recKey,
      acType: "1",
      acControlNo: "KAB202600001",
      acRegionCode: "1",
      activityField: "법학",
      hanjaName: null,
      headingName: "한국헌법재판소. 헌법재판연구원",
      birthDeathDate: null,
      firstInputDate: "2026-08-28T10:00:00.000Z",
      firstWorker: "creator",
      lastUpdateDate: "2026-08-28T11:00:00.000Z",
      lastWorker: "editor",
      sourceControlNo: null,
      sourceDataFound: null,
      record: {
        leader: "00000nz  a2200000n  4500",
        controlFields: [{ tag: "001", value: "KAB202600001" }],
        dataFields: [
          {
            tag: "046",
            ind1: " ",
            ind2: " ",
            subfields: [{ code: "s", value: "20110101" }],
          },
          {
            tag: "110",
            ind1: " ",
            ind2: " ",
            subfields: [
              { code: "a", value: "한국헌법재판소." },
              { code: "b", value: "헌법재판연구원" },
            ],
          },
        ],
      },
    },
  };
}

function renderCreatePage(queryClient = new QueryClient()) {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/corporation/new"]}>
        <AuthorityCorporationFormPage mode="create" />
        <CurrentLocationProbe />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("AuthorityCorporationFormPage", () => {
  it("참조표목조회 없이 빈 단체명 입력 화면을 표시한다", () => {
    renderCreatePage();

    expect(screen.getByRole("heading")).toHaveTextContent(
      "단체명 전거관리 - 입력",
    );
    expect(screen.getByLabelText("채택표목(110)")).toHaveValue("");
    expect(
      screen.queryByRole("button", { name: /참조표목조회/ }),
    ).not.toBeInTheDocument();
  });

  it("단체명 폼의 각 항목을 MARC 레코드에 추가한다", async () => {
    const user = userEvent.setup();
    renderCreatePage();

    await user.type(
      screen.getByLabelText("채택표목(110)"),
      "한국헌법재판소. 헌법재판연구원",
    );
    await user.click(
      screen.getByRole("button", { name: "채택표목(110) 추가" }),
    );
    expect(screen.getByLabelText("110 행")).toHaveTextContent(
      "$a 한국헌법재판소.",
    );
    expect(screen.getByLabelText("110 행")).toHaveTextContent(
      "$b 헌법재판연구원",
    );

    await user.type(screen.getByLabelText("설립일"), "20110101");
    await user.type(screen.getByLabelText("종료일"), "20261231");
    await user.click(
      screen.getByRole("button", { name: "설립일/종료일(046) 추가" }),
    );
    expect(screen.getByLabelText("046 행")).toHaveTextContent("$s 20110101");
    expect(screen.getByLabelText("046 행")).toHaveTextContent("$t 20261231");

    await user.type(screen.getByLabelText("참조표목(410)"), "헌법재판연구원");
    await user.click(
      screen.getByRole("button", { name: "참조표목(410) 추가" }),
    );
    await user.type(
      screen.getByLabelText("원어명(410)"),
      "Constitutional Research Institute",
    );
    await user.click(
      screen.getByRole("button", { name: "원어명(410) 추가" }),
    );
    expect(screen.getAllByLabelText("410 행")).toHaveLength(2);

    await user.type(screen.getByLabelText("연혁참조(665)"), "2011년 개원");
    await user.click(
      screen.getByRole("button", { name: "연혁참조(665) 추가" }),
    );
    expect(screen.getByLabelText("665 행")).toHaveTextContent("$a 2011년 개원");

    await user.type(screen.getByLabelText("단체유형(368)"), "연구기관");
    await user.click(
      screen.getByRole("button", { name: "단체유형(368) 추가" }),
    );
    expect(screen.getByLabelText("368 행")).toHaveTextContent("$a 연구기관");

    await user.type(screen.getByLabelText("관련장소(370)"), "서울특별시");
    await user.click(
      screen.getByRole("button", { name: "관련장소(370) 추가" }),
    );
    expect(screen.getByLabelText("370 행")).toHaveTextContent("$e 서울특별시");

    await user.selectOptions(screen.getByLabelText("주소(371) 유형"), "email");
    await user.type(screen.getByLabelText("주소(371) 입력"), "info@example.com");
    await user.click(
      screen.getByRole("button", { name: "주소(371) 추가" }),
    );
    expect(screen.getByLabelText("371 행")).toHaveTextContent(
      "$m info@example.com",
    );

    await user.type(screen.getByLabelText("분야(372)"), "법학");
    await user.click(
      screen.getByRole("button", { name: "분야(372) 추가" }),
    );
    expect(screen.getByLabelText("372 행")).toHaveTextContent("$a 법학");

    await user.type(screen.getByLabelText("관련단체(373)"), "헌법재판소");
    await user.click(
      screen.getByRole("button", { name: "관련단체(373) 추가" }),
    );
    expect(screen.getByLabelText("373 행")).toHaveTextContent("$a 헌법재판소");

    await user.type(screen.getByLabelText("언어(377)"), "한국어");
    await user.click(
      screen.getByRole("button", { name: "언어(377) 추가" }),
    );
    expect(screen.getByLabelText("377 행")).toHaveTextContent("$l 한국어");

    await user.type(screen.getByLabelText("정보원(670)"), "헌법 연구 자료");
    await user.click(
      screen.getByRole("button", { name: "정보원(670) 추가" }),
    );
    expect(screen.getByLabelText("670 행")).toHaveTextContent(
      "$a 헌법 연구 자료",
    );
  });

  it("생성 성공 시 캐시를 저장하고 생성한 단체명의 수정 화면으로 이동한다", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const response = createDetailResponse("created-corporation");
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(fetchAuthorityCreate).mockResolvedValue(response);
    renderCreatePage(queryClient);

    await user.selectOptions(screen.getByLabelText("전거지역구분"), "1");
    await user.type(screen.getByLabelText("채택표목(110)"), "헌법재판연구원");
    await user.click(
      screen.getByRole("button", { name: "채택표목(110) 추가" }),
    );
    await user.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => {
      expect(fetchAuthorityCreate).toHaveBeenCalledWith({
        leaderStatus: "",
        leaderType: "",
        leaderInputLevel: "",
        acRegionCode: "1",
        biographyPrivateYn: "N",
        copyrightBlanketAgreeYn: "N",
        record: {
          controlFields: [],
          dataFields: [
            {
              tag: "110",
              ind1: " ",
              ind2: " ",
              subfields: [{ code: "a", value: "헌법재판연구원" }],
            },
          ],
        },
      });
      expect(alertSpy).toHaveBeenCalledWith("단체명 전거가 생성되었습니다.");
    });
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/corporation/edit?recKey=created-corporation",
    );
    expect(
      queryClient.getQueryData(
        authorityDetailKeys.detail("created-corporation"),
      ),
    ).toEqual(response);
    alertSpy.mockRestore();
  });

  it("수정 화면에서 상세 데이터를 불러와 단체명 수정 API에 전달한다", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const response = createDetailResponse();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(useAuthorityDetail).mockReturnValue({ data: response } as never);
    vi.mocked(fetchAuthorityUpdate).mockResolvedValue(response);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/corporation/edit?recKey=corporation-1"]}>
          <AuthorityCorporationFormPage mode="edit" />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByLabelText("채택표목(110)")).toHaveValue(
      "한국헌법재판소. 헌법재판연구원",
    );
    expect(screen.getByLabelText("설립일")).toHaveValue("20110101");

    await user.click(screen.getByRole("button", { name: "수정" }));

    await waitFor(() => {
      expect(fetchAuthorityUpdate).toHaveBeenCalledWith({
        recKey: "corporation-1",
        leaderStatus: "n",
        leaderType: "z",
        leaderInputLevel: "n",
        acRegionCode: "1",
        biographyPrivateYn: "N",
        copyrightBlanketAgreeYn: "N",
        record: {
          leader: "00000nz  a2200000n  4500",
          controlFields: [{ tag: "001", value: "KAB202600001" }],
          dataFields: response.data.record.dataFields,
        },
      });
      expect(alertSpy).toHaveBeenCalledWith("단체명 전거가 수정되었습니다.");
    });
    expect(
      queryClient.getQueryData(authorityDetailKeys.detail("corporation-1")),
    ).toEqual(response);
    alertSpy.mockRestore();
  });
});
