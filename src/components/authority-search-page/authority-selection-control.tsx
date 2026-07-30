export default function AuthoritySelectionControl() {
  return (
    <span className="text-muted">
      <label htmlFor="checkAll" className="visually-hidden">
        전체 선택
      </label>
      <input type="checkbox" id="checkAll" /> 전체{" "}
      <strong id="listTotalCount">0</strong>건 / 선택{" "}
      <strong className="text-primary" id="listCheckedCount">
        0
      </strong>
      건
    </span>
  );
}
