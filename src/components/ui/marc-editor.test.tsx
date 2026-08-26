import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import MarcEditor from "./marc-editor";
import { parseLeaderData } from "./marc-editor-context";
import MarcEditorProvider from "./marc-editor-provider";
import type {
  AuthorityCreateMetadata,
  MarcField,
} from "@/types/marc-editor.types";

const initialFields: MarcField[] = [
  { type: "control", tag: "001", value: "AUTH0001" },
  { type: "control", tag: "003", value: "011001" },
  { type: "control", tag: "005", value: "20260804120000.0" },
  {
    type: "control",
    tag: "008",
    value: "260804n| azannaabn          |a aaa     c",
  },
  {
    type: "data",
    tag: "100",
    indicator1: "1",
    indicator2: " ",
    subfields: [{ code: "a", value: "김소월" }],
  },
];

function renderEditor(
  initialAuthorityCreateMetadata?: AuthorityCreateMetadata,
) {
  return render(
    <MarcEditorProvider
      initialFields={initialFields}
      initialLeader={parseLeaderData("00000nz  a2200000n  4500")}
      initialAuthorityCreateMetadata={initialAuthorityCreateMetadata}
    >
      <MarcEditor fontSize="16px" />
    </MarcEditorProvider>,
  );
}

function getRowByText(text: string) {
  const row = screen.getByText(text).closest<HTMLElement>(".marc-line");
  if (!row) {
    throw new Error(`${text}가 포함된 MARC 행을 찾을 수 없습니다.`);
  }
  return row;
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("MarcEditor", () => {
  it("항상 보이는 행 추가 버튼으로 빈 행을 만들고 태그 입력에 포커스한다", async () => {
    const user = userEvent.setup();
    renderEditor();

    await user.click(screen.getByRole("button", { name: "MARC 행 추가" }));

    const tagInput = await screen.findByRole("textbox", { name: "MARC 태그" });
    expect(tagInput).toHaveFocus();
  });

  it("제어필드와 데이터필드를 각각 폼 모드에서 수정한다", async () => {
    const user = userEvent.setup();
    renderEditor();

    expect(screen.queryByText("LDR")).not.toBeInTheDocument();

    const controlRow = getRowByText("AUTH0001");
    await user.click(within(controlRow).getByText("AUTH0001"));
    const controlContent = within(controlRow).getByRole("textbox", {
      name: "MARC 지시기와 서브필드",
    });
    expect(controlContent).toHaveFocus();
    await user.clear(controlContent);
    await user.type(controlContent, "AUTH0002");
    await user.keyboard("{Enter}");
    expect(within(controlRow).getByText("AUTH0002")).toBeVisible();

    const dataRow = getRowByText("김소월");
    await user.click(within(dataRow).getByText("김소월"));
    const dataContent = within(dataRow).getByRole("textbox", {
      name: "MARC 지시기와 서브필드",
    });
    expect(dataContent).toHaveFocus();
    await user.clear(dataContent);
    await user.type(dataContent, "1\\$a윤동주");
    await user.keyboard("{Enter}");
    expect(within(dataRow).getByText("윤동주")).toBeVisible();
  });

  it("텍스트 모드에서 mnemonic 한 행 전체를 수정한다", async () => {
    const user = userEvent.setup();
    renderEditor();

    await user.click(screen.getByRole("button", { name: "편집:폼" }));
    const dataRow = getRowByText("김소월");
    await user.click(dataRow);

    const lineInput = within(dataRow).getByRole("textbox", {
      name: "MARC 행 텍스트",
    });
    await user.clear(lineInput);
    await user.type(lineInput, "=100  1\\$a윤동주");
    await user.keyboard("{Enter}");

    expect(within(dataRow).getByText("윤동주")).toBeVisible();
  });

  it("태그가 수정되면 전체 필드를 태그 오름차순으로 정렬한다", async () => {
    const user = userEvent.setup();
    const { container } = renderEditor();

    const controlRow = getRowByText("AUTH0001");
    await user.click(within(controlRow).getByText("001"));
    const tagInput = within(controlRow).getByRole("textbox", {
      name: "MARC 태그",
    });
    expect(tagInput).toHaveFocus();
    await user.clear(tagInput);
    await user.type(tagInput, "006");
    await user.keyboard("{Enter}");

    const tags = [...container.querySelectorAll(".marc-tag")].map(
      (element) => element.textContent,
    );
    expect(tags).toEqual(["003", "005", "006", "008", "100"]);
  });

  it("저장 버튼을 누르면 context의 최종 MARC 레코드를 출력한다", async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    renderEditor({
      acType: "0",
      acRegionCode: "1",
      firstInputDate: "2026-08-25T10:00:00",
      firstWorker: "tester",
    });

    await user.click(screen.getByRole("button", { name: "저장" }));

    expect(consoleSpy).toHaveBeenCalledWith("전거 생성 최종 데이터", {
      acType: "0",
      acRegionCode: "1",
      firstInputDate: "2026-08-25T10:00:00",
      firstWorker: "tester",
      record: {
        leader: "00000nz  a2200000n  4500",
        control_fields: initialFields
          .filter((field) => field.type === "control")
          .map(({ tag, value }) => ({ tag, value })),
        data_fields: initialFields
          .filter((field) => field.type === "data")
          .map(({ tag, indicator1, indicator2, subfields }) => ({
            tag,
            ind1: indicator1,
            ind2: indicator2,
            subfields,
          })),
      },
    });
  });
});
