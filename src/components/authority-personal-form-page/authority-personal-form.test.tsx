import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import MarcEditor from "@/components/ui/marc-editor";
import MarcEditorProvider from "@/components/ui/marc-editor-provider";

import AuthorityPersonalForm from "./authority-personal-form";

afterEach(cleanup);

describe("AuthorityPersonalForm", () => {
  it("채택표목과 생몰년 추가 버튼으로 하나의 100 필드를 만든다", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MarcEditorProvider>
        <AuthorityPersonalForm />
        <MarcEditor fontSize="16px" />
      </MarcEditorProvider>,
    );

    await user.type(screen.getByLabelText("채택표목"), "김소월");
    await user.type(
      container.querySelector<HTMLInputElement>("#p-hanja")!,
      "金素月",
    );
    expect(screen.getByLabelText("채택표목")).toHaveValue("김소월");
    expect(container.querySelector("#p-hanja")).toHaveValue("金素月");
    await user.click(screen.getByRole("button", { name: "채택표목 추가" }));

    await user.type(screen.getByLabelText("출생일"), "1902");
    await user.type(screen.getByLabelText("사망일"), "1934");
    await user.click(screen.getByRole("button", { name: "생몰년 추가" }));

    const row = screen.getByText("김소월").closest<HTMLElement>(".marc-line");
    expect(row).not.toBeNull();
    expect(within(row!).getByText("100")).toBeVisible();
    expect(within(row!).getByText("金素月")).toBeVisible();
    expect(within(row!).getByText("1902-1934")).toBeVisible();
    expect(container.querySelectorAll(".marc-tag")).toHaveLength(1);
  });
});
