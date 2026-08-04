import clsx from "clsx";
import { css } from "styled-system/css";

export interface AuthorityRecord {
  controlNumber: string;
  type: string;
  heading: string;
  source?: string;
  marcPreview?: string;
}

const keyToTag = {
  controlNumber: "001",
  heading: "150",
  source: "670",
};

// 태그 기준 정렬
function sortingByTag(record?: AuthorityRecord) {
  if (!record) return [];

  const keys = Object.keys(keyToTag);
  const sorted = keys.sort((a, b) => keyToTag[a].localeCompare(keyToTag[b]));

  return sorted.map((key) => ({
    tag: keyToTag[key],
    line: record[key as keyof AuthorityRecord],
  }));
}

export default function RecordPreview({
  record,
  fontSize,
  message = "선택된 데이터가 없습니다.",
  className,
}: {
  record?: AuthorityRecord;
  fontSize: string;
  message?: string;
  className?: string;
}) {
  const marcLines = sortingByTag(record);

  return (
    <div
      className={clsx(
        "marc-record-view font-monospace border rounded p-2",
        css({
          minHeight: "280px",
        }),
        className,
      )}
      style={{ fontSize }}
    >
      {!record && <p className="mb-0">{message}</p>}

      {marcLines.map((item) => (
        <div className="marc-line marc-line-control">
          <span className="marc-tag">{item.tag}</span>
          {item.line}
        </div>
      ))}
    </div>
  );
}
