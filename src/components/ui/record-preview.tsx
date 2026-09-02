import clsx from "clsx";
import type { CSSProperties } from "react";
import { css } from "styled-system/css";
import { diff, type MarcDiffChange } from "marc-eco";

import type { AuthorityDetailData } from "@/types/authority-detail.types";

type PreviewRecord = AuthorityDetailData["record"];
type PreviewControlField = PreviewRecord["controlFields"][number];
type PreviewDataField = PreviewRecord["dataFields"][number];
type PreviewFieldTone = "removed" | "added";

interface PreviewFieldRow<T> {
  field: T;
  key: string;
  tone?: PreviewFieldTone;
}

interface FieldChangeState {
  addedAfterIndexes: Set<number>;
  removedBeforeIndexes: Set<number>;
  beforeIndexByAfterIndex: Map<number, number>;
}

// split으로 동작하는

export default function MarcRecordPreview({
  detail,
  record,
  previousRecord,
  fontSize,
  className,
  message,
  style,
}: {
  detail?: AuthorityDetailData;
  record?: AuthorityDetailData["record"];
  /** 전달하면 이전 레코드와 비교하여 삭제·추가된 행을 함께 표시한다. */
  previousRecord?: AuthorityDetailData["record"];
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

  const changes = previousRecord
    ? diff(previousRecord, previewRecord).changes
    : [];

  console.log(changes);

  const leaderChanged = changes.some(
    (change) => change.kind === "leader-character",
  );
  const controlFieldRows = buildFieldPreviewRows(
    previousRecord?.controlFields,
    previewRecord.controlFields,
    getFieldChangeState(changes, "control"),
    "control",
  );
  const dataFieldRows = buildFieldPreviewRows(
    previousRecord?.dataFields,
    previewRecord.dataFields,
    getFieldChangeState(changes, "data"),
    "data",
  );

  return (
    <div
      className={clsx(
        "marc-record-view font-monospace border rounded p-2",
        className,
      )}
      style={{ ...style, fontSize }}
    >
      {leaderChanged && previousRecord && (
        <LeaderPreviewRow leader={previousRecord.leader} tone="removed" />
      )}
      <LeaderPreviewRow
        leader={previewRecord.leader}
        tone={leaderChanged ? "added" : undefined}
      />
      {controlFieldRows.map(({ field, key, tone }) => (
        <ControlFieldPreviewRow field={field} key={key} tone={tone} />
      ))}
      {dataFieldRows.map(({ field, key, tone }) => (
        <DataFieldPreviewRow field={field} key={key} tone={tone} />
      ))}
    </div>
  );
}

function getFieldChangeState(
  changes: readonly MarcDiffChange[],
  fieldType: "control" | "data",
): FieldChangeState {
  const state: FieldChangeState = {
    addedAfterIndexes: new Set(),
    removedBeforeIndexes: new Set(),
    beforeIndexByAfterIndex: new Map(),
  };

  changes.forEach((change) => {
    if (change.kind === "field") {
      if (change.fieldType !== fieldType) {
        return;
      }
      if (change.operation === "add") {
        state.addedAfterIndexes.add(change.afterIndex);
      } else if (change.operation === "remove") {
        state.removedBeforeIndexes.add(change.beforeIndex);
      } else {
        state.beforeIndexByAfterIndex.set(
          change.afterIndex,
          change.beforeIndex,
        );
      }
      return;
    }

    const isControlFieldChange = change.kind === "control-character";
    const isDataFieldChange =
      change.kind === "indicator" ||
      change.kind === "subfield" ||
      change.kind === "subfield-value";

    if (
      (fieldType === "control" && isControlFieldChange) ||
      (fieldType === "data" && isDataFieldChange)
    ) {
      state.beforeIndexByAfterIndex.set(
        change.afterFieldIndex,
        change.beforeFieldIndex,
      );
    }
  });

  return state;
}

function buildFieldPreviewRows<T extends { tag: string }>(
  previousFields: readonly T[] | undefined,
  currentFields: readonly T[],
  changeState: FieldChangeState,
  fieldType: "control" | "data",
): PreviewFieldRow<T>[] {
  if (!previousFields) {
    return currentFields
      .map((field, index) => ({
        field,
        key: `${fieldType}-current-${index}`,
        order: index,
      }))
      .toSorted(comparePreviewFieldRows)
      .map(({ order: _order, ...row }) => row);
  }

  const pairedBeforeIndexes = new Set<number>();
  const rowsWithOrder: Array<PreviewFieldRow<T> & { order: number }> = [];

  currentFields.forEach((field, afterIndex) => {
    const beforeIndex = changeState.beforeIndexByAfterIndex.get(afterIndex);

    if (beforeIndex !== undefined) {
      const previousField = previousFields[beforeIndex];
      if (previousField) {
        pairedBeforeIndexes.add(beforeIndex);
        rowsWithOrder.push({
          field: previousField,
          key: `${fieldType}-removed-${beforeIndex}-${afterIndex}`,
          order: afterIndex,
          tone: "removed",
        });
      }
      rowsWithOrder.push({
        field,
        key: `${fieldType}-added-${beforeIndex}-${afterIndex}`,
        order: afterIndex,
        tone: "added",
      });
      return;
    }

    rowsWithOrder.push({
      field,
      key: `${fieldType}-current-${afterIndex}`,
      order: afterIndex,
      tone: changeState.addedAfterIndexes.has(afterIndex) ? "added" : undefined,
    });
  });

  changeState.removedBeforeIndexes.forEach((beforeIndex) => {
    if (pairedBeforeIndexes.has(beforeIndex)) {
      return;
    }
    const previousField = previousFields[beforeIndex];
    if (!previousField) {
      return;
    }
    rowsWithOrder.push({
      field: previousField,
      key: `${fieldType}-removed-${beforeIndex}`,
      order: beforeIndex,
      tone: "removed",
    });
  });

  return rowsWithOrder
    .toSorted(comparePreviewFieldRows)
    .map(({ order: _order, ...row }) => row);
}

function comparePreviewFieldRows<T extends { tag: string }>(
  left: PreviewFieldRow<T> & { order: number },
  right: PreviewFieldRow<T> & { order: number },
) {
  return (
    left.field.tag.localeCompare(right.field.tag) ||
    left.order - right.order ||
    toneOrder(left.tone) - toneOrder(right.tone)
  );
}

function toneOrder(tone: PreviewFieldTone | undefined) {
  if (tone === "removed") {
    return 0;
  }
  if (tone === "added") {
    return 1;
  }
  return 2;
}

function getToneClassName(tone: PreviewFieldTone | undefined) {
  return tone === "removed"
    ? "bg-danger-subtle"
    : tone === "added"
      ? "bg-success-subtle"
      : undefined;
}

function getRowAriaLabel(tag: string, tone: PreviewFieldTone | undefined) {
  return `${tag} ${tone === "removed" ? "삭제" : tone === "added" ? "추가" : ""} 행`.replace(
    "  ",
    " ",
  );
}

function LeaderPreviewRow({
  leader,
  tone,
}: {
  leader: string;
  tone?: PreviewFieldTone;
}) {
  return (
    <div
      className={clsx("marc-line", getToneClassName(tone))}
      aria-label={tone ? getRowAriaLabel("LDR", tone) : undefined}
    >
      <span className="marc-tag">LDR</span>
      {leader}
    </div>
  );
}

function ControlFieldPreviewRow({
  field,
  tone,
}: {
  field: PreviewControlField;
  tone?: PreviewFieldTone;
}) {
  return (
    <div
      className={clsx("marc-line", getToneClassName(tone))}
      aria-label={tone ? getRowAriaLabel(field.tag, tone) : undefined}
    >
      <span className="marc-tag">{field.tag}</span>
      {field.value}
    </div>
  );
}

function DataFieldPreviewRow({
  field,
  tone,
}: {
  field: PreviewDataField;
  tone?: PreviewFieldTone;
}) {
  return (
    <div
      className={clsx("marc-line", getToneClassName(tone))}
      aria-label={tone ? getRowAriaLabel(field.tag, tone) : undefined}
    >
      <span className="marc-tag">{field.tag}</span>
      {field.ind1}
      {field.ind2}
      {field.subfields.map((subfield, index) => (
        <span key={`${subfield.code}-${subfield.value}-${index}`}>
          <span className="marc-sf">${subfield.code}</span> {subfield.value}
        </span>
      ))}
      <span className="marc-eof">%</span>
    </div>
  );
}
