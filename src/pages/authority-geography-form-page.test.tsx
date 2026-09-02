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

import AuthorityGeographyFormPage from "./authority-geography-form-page";

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

function createDetailResponse(recKey = "geography-1", heading = "울릉도") {
  return {
    data: {
      recKey,
      acType: "5",
      acControlNo: "KAG202600001",
      acRegionCode: "1",
      activityField: null,
      biographyPrivateYn: "N" as const,
      hanjaName: null,
      headingName: heading,
      birthDeathDate: null,
      birthDeathDatePrivateYn: "N" as const,
      firstInputDate: "2026-09-02T10:00:00.000Z",
      firstWorker: "creator",
      lastUpdateDate: "2026-09-02T11:00:00.000Z",
      lastWorker: "editor",
      sourceControlNo: null,
      sourceDataFound: null,
      record: {
        leader: "00000nz  a2200000n  4500",
        controlFields: [{ tag: "001", value: "KAG202600001" }],
        dataFields: [
          {
            tag: "151",
            ind1: " ",
            ind2: " ",
            subfields: [{ code: "a", value: heading }],
          },
          {
            tag: "451",
            ind1: " ",
            ind2: " ",
            subfields: [{ code: "a", value: "무릉도" }],
          },
          {
            tag: "670",
            ind1: " ",
            ind2: " ",
            subfields: [{ code: "a", value: "국토지리정보원" }],
          },
          {
            tag: "680",
            ind1: " ",
            ind2: " ",
            subfields: [{ code: "i", value: "경상북도 울릉군의 섬" }],
          },
        ],
      },
    },
  };
}

function renderPage(
  mode: "create" | "edit",
  initialEntry: string,
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  }),
) {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <AuthorityGeographyFormPage mode={mode} />
        <CurrentLocationProbe />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("AuthorityGeographyFormPage", () => {
  it("지리명 폼의 각 항목을 MARC 레코드에 추가한다", async () => {
    const user = userEvent.setup();
    renderPage("create", "/geography/new");

    expect(screen.getByRole("heading")).toHaveTextContent(
      "지리명 전거관리 - 입력",
    );

    await user.type(screen.getByLabelText("채택표목(151)"), "울릉도");
    await user.click(
      screen.getByRole("button", { name: "채택표목(151) 추가" }),
    );
    expect(screen.getByLabelText("151 행")).toHaveTextContent("$a 울릉도");

    await user.type(screen.getByLabelText("참조표목(451)"), "무릉도");
    await user.click(
      screen.getByRole("button", { name: "참조표목(451) 추가" }),
    );
    expect(screen.getByLabelText("451 행")).toHaveTextContent("$a 무릉도");

    await user.type(screen.getByLabelText("정보원(670)"), "국토지리정보원");
    await user.click(
      screen.getByRole("button", { name: "정보원(670) 추가" }),
    );
    expect(screen.getByLabelText("670 행")).toHaveTextContent(
      "$a 국토지리정보원",
    );

    await user.type(
      screen.getByLabelText("일반주기(680)"),
      "경상북도 울릉군의 섬",
    );
    await user.click(
      screen.getByRole("button", { name: "일반주기(680) 추가" }),
    );
    expect(screen.getByLabelText("680 행")).toHaveTextContent(
      "$i 경상북도 울릉군의 섬",
    );
  });

  it("생성 성공 시 지리명 수정 화면으로 이동하고 상세 캐시를 저장한다", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const response = createDetailResponse("created-geography");
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(fetchAuthorityCreate).mockResolvedValue(response);
    renderPage("create", "/geography/new", queryClient);

    await screen.findByRole("option", { name: "1 : 한국" });
    await user.selectOptions(screen.getByLabelText("전거지역구분"), "1");
    await user.type(screen.getByLabelText("채택표목(151)"), "울릉도");
    await user.click(
      screen.getByRole("button", { name: "채택표목(151) 추가" }),
    );
    await user.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => {
      expect(fetchAuthorityCreate).toHaveBeenCalledWith({
        leaderStatus: "",
        leaderType: "",
        leaderInputLevel: "",
        acRegionCode: "1",
        birthDeathDatePrivateYn: "N",
        biographyPrivateYn: "N",
        copyrightBlanketAgreeYn: "N",
        record: {
          controlFields: [],
          dataFields: [
            {
              tag: "151",
              ind1: " ",
              ind2: " ",
              subfields: [{ code: "a", value: "울릉도" }],
            },
          ],
        },
      });
      expect(alertSpy).toHaveBeenCalledWith("지리명 전거가 생성되었습니다.");
    });
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/geography/edit?recKey=created-geography",
    );
    expect(
      queryClient.getQueryData(
        authorityDetailKeys.detail("created-geography"),
      ),
    ).toEqual(response);
    alertSpy.mockRestore();
  });

  it("수정 화면에서 상세 데이터를 폼과 수정 API에 연결한다", async () => {
    const user = userEvent.setup();
    const response = createDetailResponse();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(useAuthorityDetail).mockReturnValue({ data: response } as never);
    vi.mocked(fetchAuthorityUpdate).mockResolvedValue(response);
    renderPage("edit", "/geography/edit?recKey=geography-1");

    expect(screen.getByLabelText("채택표목(151)")).toHaveValue("울릉도");
    expect(screen.getByLabelText("참조표목(451)")).toHaveValue("");
    expect(screen.getByLabelText("정보원(670)")).toHaveValue("");
    expect(screen.getByLabelText("일반주기(680)")).toHaveValue("");
    expect(screen.getByLabelText("최초입력자")).toHaveValue("creator");
    expect(screen.getByLabelText("마지막수정자")).toHaveValue("editor");

    await user.click(screen.getByRole("button", { name: "수정" }));

    await waitFor(() => {
      expect(fetchAuthorityUpdate).toHaveBeenCalledWith({
        recKey: "geography-1",
        leaderStatus: "n",
        leaderType: "z",
        leaderInputLevel: "n",
        acRegionCode: "1",
        birthDeathDatePrivateYn: "N",
        biographyPrivateYn: "N",
        copyrightBlanketAgreeYn: "N",
        record: {
          leader: "00000nz  a2200000n  4500",
          controlFields: [{ tag: "001", value: "KAG202600001" }],
          dataFields: response.data.record.dataFields,
        },
      });
      expect(alertSpy).toHaveBeenCalledWith("지리명 전거가 수정되었습니다.");
    });
    alertSpy.mockRestore();
  });

  it("여러 수정 대상에서는 current 값으로 이전·다음 레코드를 이동한다", async () => {
    const user = userEvent.setup();
    vi.mocked(useAuthorityDetail).mockImplementation((recKey) => ({
      data: recKey
        ? createDetailResponse(recKey, recKey === "geo-1" ? "서울" : "부산")
        : undefined,
    }) as never);
    renderPage("edit", "/geography/edit?recKeys=geo-1,geo-2");

    expect(screen.getByLabelText("채택표목(151)")).toHaveValue("서울");
    await user.click(screen.getByRole("button", { name: "다음" }));

    await waitFor(() => {
      expect(screen.getByTestId("current-location")).toHaveTextContent(
        "/geography/edit?recKeys=geo-1%2Cgeo-2&current=1",
      );
      expect(screen.getByLabelText("채택표목(151)")).toHaveValue("부산");
    });
  });
});
