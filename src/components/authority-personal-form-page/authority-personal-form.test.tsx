import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import MarcEditor from "@/components/ui/marc-editor";
import MarcEditorProvider from "@/components/ui/marc-editor-provider";

import AuthorityPersonalForm from "./authority-personal-form";
import { createEmptyPersonalAuthorityFormValues } from "./personal-form.mapper";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

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

  it("저장할 때 입력된 공통 항목을 MARC 레코드와 함께 출력한다", async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const initialValues = {
      ...createEmptyPersonalAuthorityFormValues(),
      authorityType: "100",
      region: "1",
      activityField: "문학",
      createdAt: "2026-08-25T10:00:00",
      createdBy: "tester",
    };

    render(
      <MarcEditorProvider>
        <AuthorityPersonalForm initialValues={initialValues} />
        <MarcEditor fontSize="16px" />
      </MarcEditorProvider>,
    );

    await user.click(screen.getByRole("button", { name: "저장" }));

    expect(consoleSpy).toHaveBeenCalledWith("전거 생성 최종 데이터", {
      acType: "0",
      acRegionCode: "1",
      firstInputDate: "2026-08-25T10:00:00",
      firstWorker: "tester",
      record: {
        leader: "",
        control_fields: [],
        data_fields: [],
      },
    });
  });

  it("학력과 전기를 각각 667, 678 필드로 추가한다", async () => {
    const user = userEvent.setup();
    render(
      <MarcEditorProvider>
        <AuthorityPersonalForm />
        <MarcEditor fontSize="16px" />
      </MarcEditorProvider>,
    );

    await user.type(screen.getByLabelText("학력(667)"), "배재고등보통학교");
    await user.click(screen.getByRole("button", { name: "학력(667) 추가" }));
    await user.type(screen.getByLabelText("전기(678)"), "시인; 1920년 등단");
    await user.click(screen.getByRole("button", { name: "전기(678) 추가" }));

    const educationRow = screen
      .getByText("배재고등보통학교")
      .closest<HTMLElement>(".marc-line");
    const biographyRow = screen
      .getByText("시인; 1920년 등단")
      .closest<HTMLElement>(".marc-line");

    expect(within(educationRow!).getByText("667")).toBeVisible();
    expect(within(biographyRow!).getByText("678")).toBeVisible();
  });
});
