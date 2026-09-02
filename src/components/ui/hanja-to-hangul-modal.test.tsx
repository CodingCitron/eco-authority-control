import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  HanjaToHangulModalBody,
  HanjaToHangulModalButton,
  MarcEditorHanjaToHangulModalButton,
} from "./hanja-to-hangul-modal";
import { useMarcEditor } from "./marc-editor-context";
import MarcEditorProvider from "./marc-editor-provider";

function CurrentRecordHarness() {
  const { setVariableFields } = useMarcEditor();

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setVariableFields([
            {
              type: "data",
              tag: "100",
              indicator1: "1",
              indicator2: " ",
              subfields: [{ code: "g", value: "尹東柱" }],
            },
          ])
        }
      >
        편집값 변경
      </button>
      <MarcEditorHanjaToHangulModalButton />
    </>
  );
}

describe("HanjaToHangulModal", () => {
  afterEach(() => {
    cleanup();
  });

  const mockRecord = {
    leader: "00000nz a2200000n 4500",
    controlFields: [
      { tag: "001", value: "KAB000000001" },
      { tag: "008", value: "260831n azaannnnaaan a aaa " },
    ],
    dataFields: [
      {
        tag: "100",
        ind1: "1",
        ind2: " ",
        subfields: [
          { code: "a", value: "윤동주" },
          { code: "g", value: "尹東柱" },
        ],
      },
      {
        tag: "670",
        ind1: " ",
        ind2: " ",
        subfields: [
          { code: "a", value: "정보원" },
          { code: "b", value: "詩人" },
        ],
      },
    ],
  };

  it("한자가 포함된 필드와 한글 대응을 테이블에 표시한다", () => {
    const handleHide = vi.fn();
    render(<HanjaToHangulModalBody record={mockRecord} onHide={handleHide} />);

    // 모달 타이틀
    expect(screen.getByRole("heading", { name: /한자 -> 한글 변환/ })).toBeInTheDocument();

    // 100 필드 태그 및 한자/한글 표시
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("尹東柱")).toBeInTheDocument();
    expect(screen.getByText("윤동주")).toBeInTheDocument();

    // 글자별 대응 확인 (尹, 東, 柱)
    expect(screen.getByText("尹")).toBeInTheDocument();
    expect(screen.getByText("윤")).toBeInTheDocument();
    expect(screen.getByText("東")).toBeInTheDocument();
    expect(screen.getByText("동")).toBeInTheDocument();
    expect(screen.getByText("柱")).toBeInTheDocument();
    expect(screen.getByText("주")).toBeInTheDocument();

    // 670 필드 태그 및 한자/한글 표시
    expect(screen.getByText("670")).toBeInTheDocument();
    expect(screen.getByText("詩人")).toBeInTheDocument();
    expect(screen.getByText("시인")).toBeInTheDocument();
  });

  it("한자가 없는 레코드인 경우 안내 문구를 표시한다", () => {
    const handleHide = vi.fn();
    const noHanjaRecord = {
      leader: "00000nz a2200000n 4500",
      controlFields: [],
      dataFields: [
        {
          tag: "100",
          ind1: "1",
          ind2: " ",
          subfields: [{ code: "a", value: "홍길동" }],
        },
      ],
    };

    render(
      <HanjaToHangulModalBody record={noHanjaRecord} onHide={handleHide} />
    );
    expect(
      screen.getByText("전거 레코드에 포함된 한자가 없습니다.")
    ).toBeInTheDocument();
  });

  it("버튼 클릭 시 모달이 열린다", async () => {
    const user = userEvent.setup();
    render(<HanjaToHangulModalButton record={mockRecord} />);

    const button = screen.getByRole("button", { name: /한자 -> 한글/ });
    await user.click(button);

    expect(screen.getByRole("heading", { name: /한자 -> 한글 변환/ })).toBeInTheDocument();
    expect(screen.getByText("尹東柱")).toBeInTheDocument();
  });

  it("MARC 에디터에서 현재 작성 중인 레코드를 사용한다", async () => {
    const user = userEvent.setup();
    render(
      <MarcEditorProvider>
        <CurrentRecordHarness />
      </MarcEditorProvider>,
    );

    await user.click(screen.getByRole("button", { name: "편집값 변경" }));
    await user.click(screen.getByRole("button", { name: /한자 -> 한글/ }));

    expect(
      screen.getByRole("heading", { name: /한자 -> 한글 변환/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("尹東柱")).toBeInTheDocument();
    expect(screen.getByText("윤동주")).toBeInTheDocument();
  });
});
