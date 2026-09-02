import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import MarcRecordPreview from "./record-preview";

afterEach(cleanup);

const previousRecord = {
  leader: "00000nz  a2200000n  4500",
  controlFields: [
    { tag: "001", value: "KAS202600001" },
    { tag: "005", value: "20260901120000.0" },
  ],
  dataFields: [
    {
      tag: "150",
      ind1: " ",
      ind2: " ",
      subfields: [{ code: "a", value: "변경 전 주제명" }],
    },
    {
      tag: "670",
      ind1: " ",
      ind2: " ",
      subfields: [{ code: "a", value: "동일한 정보원" }],
    },
    {
      tag: "680",
      ind1: " ",
      ind2: " ",
      subfields: [{ code: "a", value: "삭제된 일반주기" }],
    },
  ],
};

const currentRecord = {
  leader: "00000nz  a2200000n  4500",
  controlFields: [
    { tag: "001", value: "KAS202600001" },
    { tag: "005", value: "20260902120000.0" },
  ],
  dataFields: [
    {
      tag: "150",
      ind1: " ",
      ind2: " ",
      subfields: [{ code: "a", value: "변경 후 주제명" }],
    },
    {
      tag: "550",
      ind1: " ",
      ind2: " ",
      subfields: [{ code: "a", value: "추가된 참조표목" }],
    },
    {
      tag: "670",
      ind1: " ",
      ind2: " ",
      subfields: [{ code: "a", value: "동일한 정보원" }],
    },
  ],
};

describe("MarcRecordPreview diff", () => {
  it("변경·삭제·추가된 MARC 행을 이전과 현재 행으로 구분한다", () => {
    render(
      <MarcRecordPreview
        previousRecord={previousRecord}
        record={currentRecord}
        fontSize="16px"
      />,
    );

    expect(screen.getByLabelText("005 삭제 행")).toHaveClass(
      "bg-danger-subtle",
    );
    expect(screen.getByLabelText("005 추가 행")).toHaveClass(
      "bg-success-subtle",
    );

    expect(screen.getByLabelText("150 삭제 행")).toHaveTextContent(
      "변경 전 주제명",
    );
    expect(screen.getByLabelText("150 삭제 행")).toHaveClass(
      "bg-danger-subtle",
    );
    expect(screen.getByLabelText("150 추가 행")).toHaveTextContent(
      "변경 후 주제명",
    );
    expect(screen.getByLabelText("150 추가 행")).toHaveClass(
      "bg-success-subtle",
    );

    expect(screen.getByLabelText("550 추가 행")).toHaveTextContent(
      "추가된 참조표목",
    );
    expect(screen.getByLabelText("680 삭제 행")).toHaveTextContent(
      "삭제된 일반주기",
    );

    const unchangedRow = screen
      .getByText("동일한 정보원")
      .closest(".marc-line");
    expect(unchangedRow).toHaveTextContent("동일한 정보원");
    expect(unchangedRow).not.toHaveClass(
      "bg-danger-subtle",
      "bg-success-subtle",
    );
  });

  it("이전 레코드가 없으면 현재 레코드만 일반 행으로 표시한다", () => {
    render(<MarcRecordPreview record={currentRecord} fontSize="16px" />);

    const preview = screen.getByText("LDR").closest(".marc-record-view");
    expect(preview).toHaveTextContent("변경 후 주제명");
    expect(screen.queryByLabelText("150 삭제 행")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("150 추가 행")).not.toBeInTheDocument();
  });
});
