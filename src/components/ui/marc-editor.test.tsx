import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import MarcEditor from "./marc-editor";
import type { MarcField } from "./marc-editor-context";
import MarcEditorProvider from "./marc-editor-provider";

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

function renderEditor() {
  return render(
    <MarcEditorProvider initialFields={initialFields}>
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

afterEach(cleanup);

describe("MarcEditor", () => {
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
});
