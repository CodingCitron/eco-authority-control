import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import MarcEditorProvider from "./marc-editor-provider";
import { MarcEditorWorkspace } from "./marc-editor";

function renderMarcEditor() {
  return render(
    <MarcEditorProvider>
      <div className="card">
        <MarcEditorWorkspace fontSize="16px" />
      </div>
    </MarcEditorProvider>,
  );
}

async function addMarcRow() {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "MARC 행 추가" }));
  const tagInput = await screen.findByRole("combobox", { name: "MARC 태그" });

  return { user, tagInput };
}

afterEach(cleanup);

describe("MarcEditorWorkspace 태그 가이드", () => {
  it("빈 태그 입력창에 포커스하면 marc-eco의 전체 태그를 표시한다", async () => {
    renderMarcEditor();
    await addMarcRow();

    expect(
      screen.getByRole("listbox", { name: "사용 가능한 MARC 태그" }),
    ).toBeVisible();
    expect(screen.getAllByRole("option").length).toBeGreaterThan(100);
    expect(screen.getByRole("option", { name: /001.*제어번호/ })).toBeVisible();
    expect(screen.getByRole("option", { name: /374.*직업/ })).toBeVisible();
  });

  it("태그 번호와 필드명으로 목록을 검색하고 선택할 수 있다", async () => {
    renderMarcEditor();
    const { user, tagInput } = await addMarcRow();

    await user.type(tagInput, "37");
    expect(screen.getByRole("option", { name: /374.*직업/ })).toBeVisible();
    expect(screen.queryByRole("option", { name: /100.*개인명/ })).toBeNull();

    await user.clear(tagInput);
    await user.type(tagInput, "직업");
    await user.click(screen.getByRole("option", { name: /374.*직업/ }));

    expect(tagInput).toHaveValue("374");
    expect(screen.getByLabelText("MARC 지시기와 서브필드")).toHaveFocus();
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("추천 목록을 선택하지 않고 정의되지 않은 태그도 직접 입력한다", async () => {
    renderMarcEditor();
    const { user, tagInput } = await addMarcRow();

    await user.type(tagInput, "999");
    expect(
      screen.getByText(/marc-eco에 정의되지 않은 태그입니다/),
    ).toBeVisible();

    await user.tab();
    const contentInput = screen.getByLabelText("MARC 지시기와 서브필드");
    expect(contentInput).toHaveFocus();
    await user.type(contentInput, "$a직접 입력{Enter}");

    expect(await screen.findByLabelText("999 행")).toHaveTextContent(
      "직접 입력",
    );
  });

  it("방향키와 Enter로 태그를 선택한다", async () => {
    renderMarcEditor();
    const { user, tagInput } = await addMarcRow();

    await user.keyboard("{ArrowDown}{Enter}");

    expect(tagInput).toHaveValue("001");
    expect(screen.getByLabelText("MARC 지시기와 서브필드")).toHaveFocus();
  });

  it("추천 목록의 스크롤 영역을 눌러도 목록을 닫지 않는다", async () => {
    renderMarcEditor();
    await addMarcRow();
    const listbox = screen.getByRole("listbox", {
      name: "사용 가능한 MARC 태그",
    });

    fireEvent.mouseDown(listbox);

    expect(listbox).toHaveFocus();
    expect(listbox).toBeVisible();

    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});
