import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthorityReferenceHeadingSearchModalBody } from "./authority-reference-heading-search-modal";

vi.mock("@/hooks/use-authority-search", () => ({
  useAuthoritySearch: () => ({
    data: {
      data: {
        page: 1,
        display: 10,
        total: 1,
        totalPages: 1,
        items: [
          {
            recKey: "1",
            acType: "1",
            acControlNo: "KAC000000001",
            headingName: "한국. 문화부",
          },
        ],
      },
    },
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

vi.mock("@/hooks/use-authority-detail", () => ({
  useAuthorityDetail: () => ({
    data: {
      data: {
        recKey: "1",
        acType: "1",
        acControlNo: "KAC000000001",
        record: {
          leader: "",
          controlFields: [{ tag: "001", value: "KAC000000001" }],
          dataFields: [
            {
              tag: "110",
              ind1: " ",
              ind2: " ",
              subfields: [
                { code: "a", value: "한국" },
                { code: "b", value: "문화부" },
              ],
            },
          ],
        },
      },
    },
    isFetching: false,
    isError: false,
  }),
}));

afterEach(cleanup);

describe("AuthorityReferenceHeadingSearchModalBody", () => {
  it("복사한 510 필드는 확인 전까지 부모에 전달하지 않는다", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onHide = vi.fn();

    render(
      <AuthorityReferenceHeadingSearchModalBody
        onConfirm={onConfirm}
        onHide={onHide}
      />,
    );

    await user.click(screen.getByRole("radio", { name: /한국\. 문화부 선택/ }));
    await user.click(screen.getByRole("button", { name: "5XX로 복사" }));

    const temporaryTable = screen.getByRole("table", {
      name: "5XX 필드 목록",
    });
    expect(within(temporaryTable).getByText("510")).toBeInTheDocument();
    expect(within(temporaryTable).getByText("한국")).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "확인" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm.mock.calls[0][0]).toEqual([
      expect.objectContaining({
        type: "data",
        tag: "510",
        indicator1: " ",
        indicator2: " ",
        subfields: expect.arrayContaining([
          { code: "a", value: "한국" },
          { code: "b", value: "문화부" },
          { code: "0", value: "KAC000000001" },
        ]),
      }),
    ]);
    expect(onHide).toHaveBeenCalledTimes(1);
  });

  it("선택한 임시 510 필드를 삭제할 수 있다", async () => {
    const user = userEvent.setup();

    render(
      <AuthorityReferenceHeadingSearchModalBody
        onConfirm={vi.fn()}
        onHide={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("radio", { name: /한국\. 문화부 선택/ }));
    await user.click(screen.getByRole("button", { name: "5XX로 복사" }));
    await user.click(screen.getByRole("checkbox", { name: /510 한국 문화부 선택/ }));
    await user.click(screen.getByRole("button", { name: "삭제" }));

    expect(screen.getByText("복사한 5XX 필드가 없습니다.")).toBeInTheDocument();
  });

  it("호출한 전거 유형과 대상 5XX 태그를 적용한다", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <AuthorityReferenceHeadingSearchModalBody
        defaultAuthorityType="5"
        referenceTag="551"
        onConfirm={onConfirm}
        onHide={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("전거유형")).toHaveValue("5");
    await user.click(screen.getByRole("radio", { name: /한국\. 문화부 선택/ }));
    await user.click(screen.getByRole("button", { name: "5XX로 복사" }));

    const temporaryTable = screen.getByRole("table", {
      name: "5XX 필드 목록",
    });
    expect(within(temporaryTable).getByText("551")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "확인" }));
    expect(onConfirm.mock.calls[0][0]).toEqual([
      expect.objectContaining({ tag: "551" }),
    ]);
  });
});
