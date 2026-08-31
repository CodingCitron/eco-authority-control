import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation, useSearchParams } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchAuthorityCreate } from "@/api/authority-create";
import { fetchAuthorityUpdate } from "@/api/authority-update";
import {
  authorityDetailKeys,
  useAuthorityDetail,
} from "@/hooks/use-authority-detail";

import AuthorityPersonalFormPage from "./authority-personal-form-page";

function CurrentSearchParamProbe() {
  const [searchParams] = useSearchParams();

  return (
    <output data-testid="current-search-param">
      {searchParams.get("current") ?? "없음"}
    </output>
  );
}

function CurrentLocationProbe() {
  const location = useLocation();

  return (
    <output data-testid="current-location">
      {location.pathname}
      {location.search}
    </output>
  );
}

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

describe("AuthorityPersonalFormPage", () => {
  it("settings API의 전거지역 코드를 입력 옵션으로 표시한다", async () => {
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

    const regionSelect = screen.getByLabelText("전거지역구분");
    expect(regionSelect).toBeDisabled();
    expect(
      await screen.findByRole("option", { name: "2 : 중국" }),
    ).toBeInTheDocument();
    expect(regionSelect).toBeEnabled();
    expect(
      screen.queryByRole("option", { name: "0 : 전체" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "3 : 일본" })).toHaveValue(
      "3",
    );
    expect(screen.getByRole("option", { name: "4 : 기타" })).toHaveValue(
      "4",
    );
  });

  it("채택표목·한자명·생몰년을 하나의 100 필드로 추가한다", async () => {
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

    await user.type(screen.getByLabelText("채택표목(100)"), "김소월");
    await user.type(screen.getByLabelText("한자명"), "金素月");
    await user.type(screen.getByLabelText("출생일"), "1902");
    await user.type(screen.getByLabelText("사망일"), "1934");
    await user.click(
      screen.getByRole("button", {
        name: "채택표목 및 생몰년(100) 추가",
      }),
    );

    const headingRow = screen.getByLabelText("100 행");
    expect(headingRow).toHaveTextContent("$a 김소월");
    expect(headingRow).toHaveTextContent("$g 金素月");
    expect(headingRow).toHaveTextContent("$d 1902-1934");
    expect(screen.queryByLabelText("046 행")).not.toBeInTheDocument();
  });

  it("선택한 성별을 375 $a 필드로 추가한다", async () => {
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

    await user.click(screen.getByLabelText("남성"));
    await user.click(
      screen.getByRole("button", { name: "성별(375) 추가" }),
    );

    expect(screen.getByLabelText("375 행")).toHaveTextContent("$a 남성");
  });

  it("참조표목·한자명과 원어명을 각각 별도의 400 필드로 추가한다", async () => {
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

    await user.type(screen.getByLabelText("참조표목(400)"), "김소월");
    await user.type(screen.getByLabelText("한자명(400)"), "金素月");
    await user.type(screen.getByLabelText("원어명(400)"), "Kim, Sowol");

    await user.click(
      screen.getByRole("button", { name: "참조표목(400) 추가" }),
    );

    let referenceRows = screen.getAllByLabelText("400 행");
    expect(referenceRows).toHaveLength(1);
    expect(referenceRows[0]).toHaveTextContent("$a 김소월");
    expect(referenceRows[0]).toHaveTextContent("$g 金素月");
    expect(referenceRows[0]).not.toHaveTextContent("Kim, Sowol");

    await user.click(
      screen.getByRole("button", { name: "원어명(400) 추가" }),
    );

    referenceRows = screen.getAllByLabelText("400 행");
    expect(referenceRows).toHaveLength(2);
    expect(referenceRows[1]).toHaveTextContent("$a Kim, Sowol");
  });

  it("기타속성을 368 $c 필드로 MARC 레코드에 추가한다", async () => {
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

    await user.type(
      screen.getByLabelText("기타속성(368)"),
      "대한민국 문화예술인",
    );
    await user.click(
      screen.getByRole("button", { name: "기타속성(368) 추가" }),
    );

    expect(screen.getByLabelText("368 행")).toHaveTextContent(
      "$c 대한민국 문화예술인",
    );
  });

  it("수정 화면의 이전·다음 버튼으로 recKeys의 current 인덱스를 이동한다", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          initialEntries={["/personal/edit?recKeys=1226277,1238369,1238510"]}
        >
          <AuthorityPersonalFormPage mode="edit" />
          <CurrentSearchParamProbe />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const getPreviousButton = () =>
      screen.getByRole("button", { name: "이전" });
    const getNextButton = () => screen.getByRole("button", { name: "다음" });

    expect(screen.getByTestId("current-search-param")).toHaveTextContent(
      "없음",
    );
    expect(useAuthorityDetail).toHaveBeenLastCalledWith("1226277", {
      enabled: true,
    });
    expect(getPreviousButton()).toBeDisabled();
    expect(getNextButton()).toBeEnabled();

    await user.click(getNextButton());

    await waitFor(() => {
      expect(screen.getByTestId("current-search-param")).toHaveTextContent("1");
      expect(useAuthorityDetail).toHaveBeenLastCalledWith("1238369", {
        enabled: true,
      });
    });
    expect(getPreviousButton()).toBeEnabled();
    expect(getNextButton()).toBeEnabled();

    await user.click(getNextButton());

    await waitFor(() => {
      expect(screen.getByTestId("current-search-param")).toHaveTextContent("2");
      expect(useAuthorityDetail).toHaveBeenLastCalledWith("1238510", {
        enabled: true,
      });
    });
    expect(getPreviousButton()).toBeEnabled();
    expect(getNextButton()).toBeDisabled();

    await user.click(getPreviousButton());

    await waitFor(() => {
      expect(screen.getByTestId("current-search-param")).toHaveTextContent("1");
      expect(useAuthorityDetail).toHaveBeenLastCalledWith("1238369", {
        enabled: true,
      });
    });
  });

  it("고정길이 편집 모달의 라벨에 Leader와 008 위치를 표시한다", async () => {
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

    await user.click(screen.getByRole("button", { name: "고정길이편집" }));

    expect(screen.getByLabelText("상 태 (05)")).toBeVisible();
    expect(screen.getByLabelText("입력수준 (17)")).toBeVisible();
    expect(screen.getByLabelText("입력날짜 (0~5)")).toBeVisible();
    expect(screen.getByLabelText("지리구분 (6)")).toBeVisible();
    expect(screen.getByLabelText("참조평가 (29)")).toBeVisible();
    expect(screen.getByLabelText("목록작성기관 (39)")).toBeVisible();
  });

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

    await user.type(screen.getByLabelText("채택표목(100)"), "김소월");
    await user.click(
      screen.getByRole("button", {
        name: "채택표목 및 생몰년(100) 추가",
      }),
    );

    expect(screen.getByLabelText("채택표목(100)")).toHaveValue("김소월");
    expect(screen.getByLabelText("100 행")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "화면 초기화" }));

    expect(screen.getByLabelText("채택표목(100)")).toHaveValue("");
    expect(screen.queryByLabelText("100 행")).not.toBeInTheDocument();
  });

  it("저장 버튼을 누르면 개인명 등록 API에 MARC 데이터를 전달한다", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const createResponse = {
      data: {
        recKey: "created-record",
        acType: "0",
        acControlNo: "AUTH0002",
        acRegionCode: "1",
        activityField: null,
        hanjaName: null,
        headingName: "김소월",
        birthDeathDate: null,
        firstInputDate: "2026-08-28T10:00:00.000Z",
        firstWorker: "creator",
        lastUpdateDate: "2026-08-28T10:00:00.000Z",
        lastWorker: "creator",
        sourceControlNo: null,
        sourceDataFound: null,
        record: {
          leader: "00000nz  a2200000n  4500",
          controlFields: [],
          dataFields: [
            {
              tag: "100",
              ind1: "1",
              ind2: " ",
              subfields: [{ code: "a", value: "김소월" }],
            },
          ],
        },
      },
    };
    vi.mocked(fetchAuthorityCreate).mockResolvedValue(createResponse);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthorityPersonalFormPage mode="create" />
          <CurrentLocationProbe />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByRole("option", { name: "1 : 한국" });
    await user.selectOptions(screen.getByLabelText("전거지역구분"), "1");
    await user.type(screen.getByLabelText("채택표목(100)"), "김소월");
    await user.click(screen.getByLabelText("비공개"));
    expect(screen.getByLabelText("비공개")).toBeChecked();
    await user.click(
      screen.getByRole("button", {
        name: "채택표목 및 생몰년(100) 추가",
      }),
    );
    await user.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => {
      expect(fetchAuthorityCreate).toHaveBeenCalledWith({
        leaderStatus: "",
        leaderType: "",
        leaderInputLevel: "",
        acRegionCode: "1",
        birthDeathDatePrivateYn: "Y",
        biographyPrivateYn: "N",
        copyrightBlanketAgreeYn: "N",
        record: {
          controlFields: [],
          dataFields: [
            {
              tag: "100",
              ind1: "1",
              ind2: " ",
              subfields: [{ code: "a", value: "김소월" }],
            },
          ],
        },
      });
    });
    expect(fetchAuthorityUpdate).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("개인명 전거가 생성되었습니다.");
      expect(screen.getByTestId("current-location")).toHaveTextContent(
        "/personal/edit?recKey=created-record",
      );
    });
    expect(
      queryClient.getQueryData(
        authorityDetailKeys.detail("created-record"),
      ),
    ).toEqual(createResponse);
    alertSpy.mockRestore();
  });

  it("백엔드 MARC 검증 오류를 레코드 뷰의 행 추가 영역에 표시한다", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.mocked(fetchAuthorityCreate).mockRejectedValue({
      isAxiosError: true,
      response: {
        data: {
          error: {
            code: "MARC_VALIDATION_FAILED",
            message: "KORMARC validation failed.",
            details: [
              {
                severity: "error",
                code: "INVALID_CONTROL_FIELD_CODE",
                message: "Field 008 position 9 has an invalid value.",
                path: "controlFields[0].value",
                tag: "008",
                actual: "z",
              },
              {
                severity: "error",
                code: "MISSING_REQUIRED_FIELD",
                message: "Required field 003 is missing.",
                path: "controlFields",
                tag: "003",
              },
            ],
          },
        },
      },
    });

    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthorityPersonalFormPage mode="create" />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole("button", { name: "저장" }));

    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toHaveTextContent("KORMARC validation failed.");
    expect(errorAlert).toHaveTextContent("MARC_VALIDATION_FAILED");
    expect(errorAlert).toHaveTextContent(
      "Field 008 position 9 has an invalid value.",
    );
    expect(errorAlert).toHaveTextContent("Required field 003 is missing.");
    expect(errorAlert.closest(".marc-editor-card")).not.toBeNull();
    const messageToggle = screen.getByRole("button", {
      name: "메시지 2건",
    });
    expect(messageToggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "MARC 행 추가" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "오류 메시지 닫기" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(messageToggle).toHaveAttribute("aria-expanded", "false");

    await user.click(messageToggle);
    expect(await screen.findByRole("alert")).toBeVisible();
    expect(messageToggle).toHaveAttribute("aria-expanded", "true");

    rerender(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthorityPersonalFormPage mode="edit" />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: "메시지 없음" })).toBeDisabled();
  });

  it("수정 버튼을 누르면 recKey와 기존 Leader를 개인명 수정 API에 전달한다", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const leader = "00000nz  a2200000n  4500";
    const detailResponse = {
      data: {
        recKey: "record-1",
        acType: "0",
        acControlNo: "AUTH0001",
        acRegionCode: "1",
        activityField: "문학",
        hanjaName: "金素月",
        headingName: "김소월",
        birthDeathDate: "1902-1934",
        birthDeathDatePrivateYn: "Y" as const,
        firstInputDate: "2026-08-25T10:00:00.000Z",
        firstWorker: "creator",
        lastUpdateDate: "2026-08-26T10:00:00.000Z",
        lastWorker: "editor",
        sourceControlNo: "",
        sourceDataFound: "",
        record: {
          leader,
          controlFields: [{ tag: "001", value: "AUTH0001" }],
          dataFields: [
            {
              tag: "100",
              ind1: "1",
              ind2: " ",
              subfields: [{ code: "a", value: "김소월" }],
            },
          ],
        },
      },
    };
    vi.mocked(fetchAuthorityUpdate).mockResolvedValue(detailResponse);
    vi.mocked(useAuthorityDetail).mockReturnValue({
      data: detailResponse,
    } as never);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/personal/edit?recKey=record-1"]}>
          <AuthorityPersonalFormPage mode="edit" />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const updateButton = await screen.findByRole("button", { name: "수정" });
    await waitFor(() => expect(updateButton).toBeEnabled());
    expect(screen.getByLabelText("비공개")).toBeChecked();
    await user.click(updateButton);

    await waitFor(() => {
      expect(fetchAuthorityUpdate).toHaveBeenCalledWith({
        recKey: "record-1",
        leaderStatus: "n",
        leaderType: "z",
        leaderInputLevel: "n",
        acRegionCode: "1",
        birthDeathDatePrivateYn: "Y",
        biographyPrivateYn: "N",
        copyrightBlanketAgreeYn: "N",
        record: {
          leader,
          controlFields: [{ tag: "001", value: "AUTH0001" }],
          dataFields: [
            {
              tag: "100",
              ind1: "1",
              ind2: " ",
              subfields: [{ code: "a", value: "김소월" }],
            },
          ],
        },
      });
    });
    expect(fetchAuthorityCreate).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("개인명 전거가 수정되었습니다.");
    });
    expect(
      queryClient.getQueryData(authorityDetailKeys.detail("record-1")),
    ).toEqual(detailResponse);
    alertSpy.mockRestore();
  });
});
