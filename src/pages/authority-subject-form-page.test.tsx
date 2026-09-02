import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchAuthorityCreate } from "@/api/authority-create";
import { fetchAuthorityUpdate } from "@/api/authority-update";
import {
  authorityDetailKeys,
  useAuthorityDetail,
} from "@/hooks/use-authority-detail";

import AuthoritySubjectFormPage from "./authority-subject-form-page";

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

function createDetailResponse(recKey = "subject-1", heading = "부작위") {
  return {
    data: {
      recKey,
      acType: "4",
      acControlNo: "KAS202600001",
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
        controlFields: [{ tag: "001", value: "KAS202600001" }],
        dataFields: [
          {
            tag: "150",
            ind1: " ",
            ind2: " ",
            subfields: [{ code: "a", value: heading }],
          },
          {
            tag: "450",
            ind1: " ",
            ind2: " ",
            subfields: [
              { code: "w", value: "r" },
              { code: "a", value: "nonfeasance" },
              { code: "i", value: "영어" },
            ],
          },
          {
            tag: "670",
            ind1: " ",
            ind2: " ",
            subfields: [{ code: "a", value: "법률용어사전" }],
          },
          {
            tag: "680",
            ind1: " ",
            ind2: " ",
            subfields: [{ code: "a", value: "법률상 의무를 이행하지 않음" }],
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
        <AuthoritySubjectFormPage mode={mode} />
        <CurrentLocationProbe />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("AuthoritySubjectFormPage", () => {
  it("주제명 폼의 각 항목을 MARC 레코드에 추가한다", async () => {
    const user = userEvent.setup();
    renderPage("create", "/subject/new");

    expect(screen.getByRole("heading")).toHaveTextContent(
      "주제명 전거관리 - 입력",
    );

    await user.type(screen.getByLabelText("채택표목(150)"), "부작위");
    await user.click(
      screen.getByRole("button", { name: "채택표목(150) 추가" }),
    );
    expect(screen.getByLabelText("150 행")).toHaveTextContent("$a 부작위");

    await user.click(screen.getByLabelText("관계부호(r)"));
    await user.type(screen.getByLabelText("참조표목 언어명"), "영어");
    await user.type(
      screen.getByLabelText("참조표목(450)"),
      "nonfeasance",
    );
    await user.click(
      screen.getByRole("button", { name: "참조표목(450) 추가" }),
    );
    const referenceRow = screen.getByLabelText("450 행");
    expect(referenceRow).toHaveTextContent("$w r");
    expect(referenceRow).toHaveTextContent("$a nonfeasance");
    expect(referenceRow).toHaveTextContent("$i 영어");

    await user.type(screen.getByLabelText("정보원(670)"), "법률용어사전");
    await user.click(
      screen.getByRole("button", { name: "정보원(670) 추가" }),
    );
    expect(screen.getByLabelText("670 행")).toHaveTextContent(
      "$a 법률용어사전",
    );

    await user.type(
      screen.getByLabelText("일반주기(680)"),
      "법률상 의무를 이행하지 않음",
    );
    await user.click(
      screen.getByRole("button", { name: "일반주기(680) 추가" }),
    );
    expect(screen.getByLabelText("680 행")).toHaveTextContent(
      "$a 법률상 의무를 이행하지 않음",
    );
  });

  it("참조표목조회 모달은 주제명을 기본 검색 유형으로 사용한다", async () => {
    const user = userEvent.setup();
    renderPage("create", "/subject/new");

    await user.click(
      screen.getByRole("button", { name: "참조표목조회(5XX) 추가" }),
    );
    const dialog = await screen.findByRole("dialog");

    expect(within(dialog).getByLabelText("전거유형")).toHaveValue("4");
  });

  it("생성 성공 시 주제명 수정 화면으로 이동하고 상세 캐시를 저장한다", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const response = createDetailResponse("created-subject");
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(fetchAuthorityCreate).mockResolvedValue(response);
    renderPage("create", "/subject/new", queryClient);

    await screen.findByRole("option", { name: "1 : 한국" });
    await user.selectOptions(screen.getByLabelText("전거지역구분"), "1");
    await user.type(screen.getByLabelText("채택표목(150)"), "부작위");
    await user.click(
      screen.getByRole("button", { name: "채택표목(150) 추가" }),
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
              tag: "150",
              ind1: " ",
              ind2: " ",
              subfields: [{ code: "a", value: "부작위" }],
            },
          ],
        },
      });
      expect(alertSpy).toHaveBeenCalledWith("주제명 전거가 생성되었습니다.");
    });
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/subject/edit?recKey=created-subject",
    );
    expect(
      queryClient.getQueryData(authorityDetailKeys.detail("created-subject")),
    ).toEqual(response);
    alertSpy.mockRestore();
  });

  it("수정 화면에서 상세 데이터를 폼과 수정 API에 연결한다", async () => {
    const user = userEvent.setup();
    const response = createDetailResponse();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(useAuthorityDetail).mockReturnValue({ data: response } as never);
    vi.mocked(fetchAuthorityUpdate).mockResolvedValue(response);
    renderPage("edit", "/subject/edit?recKey=subject-1");

    expect(screen.getByLabelText("채택표목(150)")).toHaveValue("부작위");
    expect(screen.getByLabelText("참조표목(450)")).toHaveValue("");
    expect(screen.getByLabelText("정보원(670)")).toHaveValue("");
    expect(screen.getByLabelText("일반주기(680)")).toHaveValue("");
    expect(screen.getByLabelText("최초입력자")).toHaveValue("creator");

    await user.click(screen.getByRole("button", { name: "수정" }));

    await waitFor(() => {
      expect(fetchAuthorityUpdate).toHaveBeenCalledWith({
        recKey: "subject-1",
        leaderStatus: "n",
        leaderType: "z",
        leaderInputLevel: "n",
        acRegionCode: "1",
        birthDeathDatePrivateYn: "N",
        biographyPrivateYn: "N",
        copyrightBlanketAgreeYn: "N",
        record: {
          leader: "00000nz  a2200000n  4500",
          controlFields: [{ tag: "001", value: "KAS202600001" }],
          dataFields: response.data.record.dataFields,
        },
      });
      expect(alertSpy).toHaveBeenCalledWith("주제명 전거가 수정되었습니다.");
    });
    alertSpy.mockRestore();
  });

  it("여러 수정 대상에서는 current 값으로 이전·다음 레코드를 이동한다", async () => {
    const user = userEvent.setup();
    vi.mocked(useAuthorityDetail).mockImplementation((recKey) => ({
      data: recKey
        ? createDetailResponse(
            recKey,
            recKey === "subject-1" ? "법률" : "행정",
          )
        : undefined,
    }) as never);
    renderPage("edit", "/subject/edit?recKeys=subject-1,subject-2");

    expect(screen.getByLabelText("채택표목(150)")).toHaveValue("법률");
    await user.click(screen.getByRole("button", { name: "다음" }));

    await waitFor(() => {
      expect(screen.getByTestId("current-location")).toHaveTextContent(
        "/subject/edit?recKeys=subject-1%2Csubject-2&current=1",
      );
      expect(screen.getByLabelText("채택표목(150)")).toHaveValue("행정");
    });
  });
});
