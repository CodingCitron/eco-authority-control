import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
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
    expect(
      screen.queryByRole("listbox", { name: "사용 가능한 MARC 태그" }),
    ).toBeNull();
    expect(
      screen.getByRole("dialog", { name: "374 MARC 입력 가이드" }),
    ).toBeVisible();
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

  it("우측 입력을 사용한 뒤 태그를 다시 입력해도 왼쪽 포커스를 유지한다", async () => {
    renderMarcEditor();
    const { user, tagInput } = await addMarcRow();

    await user.type(tagInput, "100");
    await user.click(screen.getByRole("option", { name: /100.*개인명/ }));
    expect(screen.getByLabelText("MARC 지시기와 서브필드")).toHaveFocus();

    await user.click(tagInput);
    await user.clear(tagInput);
    await user.type(tagInput, "374");

    expect(tagInput).toHaveValue("374");
    expect(tagInput).toHaveFocus();
    expect(screen.getByRole("option", { name: /374.*직업/ })).toBeVisible();
  });

  it("방향키와 Enter로 태그를 선택한다", async () => {
    renderMarcEditor();
    const { user, tagInput } = await addMarcRow();

    await user.keyboard("{ArrowDown}{Enter}");

    expect(tagInput).toHaveValue("001");
    expect(screen.getByLabelText("MARC 지시기와 서브필드")).toHaveFocus();
  });

  it("제어필드에서는 길이와 고정길이편집 기능을 안내한다", async () => {
    renderMarcEditor();
    const { user, tagInput } = await addMarcRow();

    await user.type(tagInput, "008");
    await user.click(screen.getByRole("option", { name: /008.*부호화정보/ }));

    expect(screen.getByLabelText("MARC 지시기와 서브필드")).toHaveValue("");
    const guide = screen.getByRole("dialog", {
      name: "008 MARC 입력 가이드",
    });
    expect(within(guide).getByText("입력 길이: 40자리")).toBeVisible();
    expect(
      within(guide).getByText(/고정길이편집 기능을 이용할 수 있습니다/),
    ).toBeVisible();
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

  it("선택한 태그의 지시기호와 식별기호를 우측 입력에서 안내한다", async () => {
    renderMarcEditor();
    const { user, tagInput } = await addMarcRow();

    await user.type(tagInput, "100");
    await user.click(screen.getByRole("option", { name: /100.*개인명/ }));

    expect(
      screen.getByRole("dialog", { name: "100 MARC 입력 가이드" }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", {
        name: "제1지시기호 1 성으로 시작하는 이름 선택",
      }),
    ).toBeVisible();
    const subfieldList = screen.getByRole("listbox", {
      name: "100 사용 가능한 식별기호",
    });
    expect(
      within(subfieldList).getByRole("option", {
        name: /\$a.*개인명.*필수/,
      }),
    ).toBeVisible();
    expect(
      within(subfieldList).getByRole("option", { name: /\$d.*생몰년/ }),
    ).toBeVisible();
  });

  it("가이드에서 지시기호와 식별기호를 선택해 커서 위치에 입력한다", async () => {
    renderMarcEditor();
    const { user, tagInput } = await addMarcRow();

    await user.type(tagInput, "100");
    await user.click(screen.getByRole("option", { name: /100.*개인명/ }));
    const contentInput = screen.getByRole("combobox", {
      name: "MARC 지시기와 서브필드",
    });

    await user.click(
      screen.getByRole("button", {
        name: "제1지시기호 1 성으로 시작하는 이름 선택",
      }),
    );
    await user.click(screen.getByRole("option", { name: /\$a.*개인명/ }));

    expect(contentInput).toHaveValue("1\\$a");
    expect(contentInput).toHaveFocus();

    await user.type(contentInput, "김소월");
    expect(
      screen.getByRole("option", { name: /\$a.*개인명.*이미 사용 중/ }),
    ).toBeVisible();

    await user.click(screen.getByRole("option", { name: /\$d.*생몰년/ }));
    expect(contentInput).toHaveValue("1\\$a김소월$d");
  });

  it("식별기호 명칭을 입력해 검색하고 키보드로 삽입할 수 있다", async () => {
    renderMarcEditor();
    const { user, tagInput } = await addMarcRow();

    await user.type(tagInput, "100");
    await user.click(screen.getByRole("option", { name: /100.*개인명/ }));
    const contentInput = screen.getByRole("combobox", {
      name: "MARC 지시기와 서브필드",
    });

    await user.type(contentInput, "$생몰년");
    const subfieldList = screen.getByRole("listbox", {
      name: "100 사용 가능한 식별기호",
    });
    expect(within(subfieldList).getAllByRole("option")).toHaveLength(1);
    expect(
      within(subfieldList).getByRole("option", { name: /\$d.*생몰년/ }),
    ).toBeVisible();

    await user.keyboard("{ArrowDown}{Enter}");
    expect(contentInput).toHaveValue("\\\\$d");
  });

  it("우측 가이드의 스크롤 영역을 눌러도 편집 행과 가이드를 유지한다", async () => {
    renderMarcEditor();
    const { user, tagInput } = await addMarcRow();

    await user.type(tagInput, "100");
    await user.click(screen.getByRole("option", { name: /100.*개인명/ }));
    const subfieldList = screen.getByRole("listbox", {
      name: "100 사용 가능한 식별기호",
    });

    fireEvent.mouseDown(subfieldList);

    expect(subfieldList).toHaveFocus();
    expect(
      screen.getByRole("dialog", { name: "100 MARC 입력 가이드" }),
    ).toBeVisible();
    expect(screen.getByLabelText("새 MARC 행")).toHaveClass(
      "marc-line-editing",
    );
  });
});
