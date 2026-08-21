import clsx from "clsx";
import { css } from "styled-system/css";

import type { AuthorityDetailData } from "@/types/authority-detail.types";

function sort<T extends { tag: string }>(items: readonly T[]) {
  return items.toSorted((a, b) => a.tag.localeCompare(b.tag));
}

export default function MarcRecordPreview({
  detail,
  fontSize,
  className,
  message,
}: {
  detail?: AuthorityDetailData;
  fontSize: string;
  className?: string;
  message?: string;
}) {
  if (!detail) {
    return (
      <div
        className={clsx(
          "marc-record-view border rounded p-2",
          css({
            minHeight: "280px",
          }),
          className,
        )}
      >
        {message || "상세 정보를 불러오는 중입니다."}
      </div>
    );
  }

  const { record } = detail;

  return (
    <div
      className={clsx(
        "marc-record-view font-monospace border rounded p-2",
        className,
      )}
      style={{ fontSize }}
    >
      <div className="marc-line">
        <span className="marc-tag">LDR</span>
        {record.leader}
      </div>
      {sort(record.control_fields).map((field) => (
        <div className="marc-line" key={`${field.tag}-${field.value}`}>
          <span className="marc-tag">{field.tag}</span>
          {field.value}
        </div>
      ))}
      {sort(record.data_fields).map((field, index) => (
        <div className="marc-line" key={`${field.tag}-${index}`}>
          <span className="marc-tag">{field.tag}</span>
          {field.ind1}
          {field.ind2}
          {field.subfields.map((subfield) => (
            <span key={`${subfield.code}-${subfield.value}`}>
              <span className="marc-sf">${subfield.code}</span> {subfield.value}
            </span>
          ))}

          {/* 필수 x: 마크 필드의 끝 의미 */}
          <span className="marc-eof">%</span>
        </div>
      ))}
    </div>
  );
}
