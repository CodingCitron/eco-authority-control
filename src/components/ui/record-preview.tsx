import clsx from "clsx";
import type { CSSProperties } from "react";
import { css } from "styled-system/css";

import type { AuthorityDetailData } from "@/types/authority-detail.types";

function sort<T extends { tag: string }>(items: readonly T[]) {
  return items.toSorted((a, b) => a.tag.localeCompare(b.tag));
}

// split으로 동작하는

export default function MarcRecordPreview({
  detail,
  record,
  fontSize,
  className,
  message,
  style,
}: {
  detail?: AuthorityDetailData;
  record?: AuthorityDetailData["record"];
  fontSize: string;
  className?: string;
  message?: string;
  style?: CSSProperties;
}) {
  const previewRecord = record ?? detail?.record;

  if (!previewRecord) {
    return (
      <div
        className={clsx(
          "marc-record-view border rounded p-2",
          css({
            minHeight: "280px",
          }),
          className,
        )}
        style={style}
      >
        {message || "상세 정보를 불러오는 중입니다."}
      </div>
    );
  }

  const { leader, controlFields, dataFields } = previewRecord;

  return (
    <div
      className={clsx(
        "marc-record-view font-monospace border rounded p-2",
        className,
      )}
      style={{ ...style, fontSize }}
    >
      <div className="marc-line">
        <span className="marc-tag">LDR</span>
        {leader}
      </div>
      {sort(controlFields).map((field) => (
        <div className="marc-line" key={`${field.tag}-${field.value}`}>
          <span className="marc-tag">{field.tag}</span>
          {field.value}
        </div>
      ))}
      {sort(dataFields).map((field, index) => (
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
