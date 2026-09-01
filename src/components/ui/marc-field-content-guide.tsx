import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";
import {
  getCodeSet,
  isPositionalCodeSet,
  kormarcAuthorityRulePack,
  type DataFieldRule,
  type SubfieldRule,
} from "marc-eco";

interface MarcFieldContentGuideProps {
  tag: string;
  value: string;
  autoFocus?: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

interface CodeOption {
  code: string;
  label: string;
}

interface SubfieldOption {
  code: string;
  label: string;
  required: boolean;
  repeatable: boolean;
  order?: number;
  codeValues: CodeOption[];
}

interface ActiveSubfieldFragment {
  start: number;
  query: string;
}

function getCodeOptions(codeSetName?: string) {
  if (!codeSetName) {
    return [];
  }

  const codeSet = getCodeSet(codeSetName);
  if (!codeSet || isPositionalCodeSet(codeSet)) {
    return [];
  }

  return Object.entries(codeSet.values).map(([code, value]) => ({
    code,
    label: value.label,
  }));
}

function getSubfieldOptions(rule?: DataFieldRule): SubfieldOption[] {
  return Object.entries(rule?.subfields ?? {})
    .map(([code, subfieldRule]: [string, SubfieldRule]) => ({
      code,
      label: subfieldRule.label ?? "명칭 없음",
      required: subfieldRule.required === true,
      repeatable: subfieldRule.repeatable === true,
      order: subfieldRule.order,
      codeValues: getCodeOptions(subfieldRule.codeset),
    }))
    .sort(
      (left, right) =>
        (left.order ?? Number.MAX_SAFE_INTEGER) -
          (right.order ?? Number.MAX_SAFE_INTEGER) ||
        left.code.localeCompare(right.code),
    );
}

function getActiveSubfieldFragment(
  value: string,
  caretPosition: number,
  knownCodes: readonly string[],
): ActiveSubfieldFragment | undefined {
  const prefix = value.slice(0, caretPosition);
  const start = prefix.lastIndexOf("$");
  if (start < 0) {
    return undefined;
  }

  const fragment = prefix.slice(start + 1);
  if (/\s|\$/.test(fragment)) {
    return undefined;
  }

  // 이미 올바른 식별기호 뒤에 값을 입력하고 있다면 검색어로 취급하지 않는다.
  if (fragment.length > 1 && knownCodes.includes(fragment[0] ?? "")) {
    return undefined;
  }

  return {
    start,
    query: fragment.toLocaleLowerCase(),
  };
}

function getUsedSubfieldCodes(
  value: string,
  activeFragment: ActiveSubfieldFragment | undefined,
  caretPosition: number,
) {
  const valueWithoutActiveFragment = activeFragment
    ? `${value.slice(0, activeFragment.start)}${value.slice(caretPosition)}`
    : value;

  return [...valueWithoutActiveFragment.matchAll(/\$([^\s$])/g)].map(
    (match) => match[1],
  );
}

function formatCode(code: string) {
  return code === " " ? "\\ (공백)" : code;
}

function ensureIndicatorPrefix(value: string, caretPosition: number) {
  const hasIndicatorPrefix =
    value.length >= 2 && value[0] !== "$" && value[1] !== "$";
  if (hasIndicatorPrefix) {
    return { value, caretPosition, indexOffset: 0 };
  }

  if (!value) {
    return { value: "\\\\", caretPosition: 2, indexOffset: 2 };
  }

  if (value.startsWith("$")) {
    return {
      value: `\\\\${value}`,
      caretPosition: caretPosition + 2,
      indexOffset: 2,
    };
  }

  if (value.length === 1) {
    return { value: `${value}\\`, caretPosition: 2, indexOffset: 0 };
  }

  return {
    value: `\\\\${value}`,
    caretPosition: caretPosition + 2,
    indexOffset: 2,
  };
}

function getContentPlaceholder(
  tag: string,
  dataRule: DataFieldRule | undefined,
) {
  if (dataRule) {
    const requiredSubfield = getSubfieldOptions(dataRule).find(
      (option) => option.required,
    );
    return requiredSubfield
      ? `지시기호 2자리 후 $${requiredSubfield.code}${requiredSubfield.label}`
      : "지시기호 2자리 후 $a값";
  }

  const controlRule = kormarcAuthorityRulePack.controlFields[tag];
  return controlRule?.length
    ? `${controlRule.length}자리 제어필드 값`
    : "제어필드 값";
}

export default function MarcFieldContentGuide({
  tag,
  value,
  autoFocus,
  inputRef,
  onChange,
  onKeyDown,
}: MarcFieldContentGuideProps) {
  const guideId = useId();
  const listboxId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [caretPosition, setCaretPosition] = useState(value.length);
  const dataRule = kormarcAuthorityRulePack.fields[tag];
  const controlRule = kormarcAuthorityRulePack.controlFields[tag];
  const subfieldOptions = useMemo(
    () => getSubfieldOptions(dataRule),
    [dataRule],
  );
  const knownCodes = useMemo(
    () => subfieldOptions.map((option) => option.code),
    [subfieldOptions],
  );
  const activeFragment = getActiveSubfieldFragment(
    value,
    caretPosition,
    knownCodes,
  );
  const filteredSubfields = useMemo(() => {
    const query = activeFragment?.query;
    if (!query) {
      return subfieldOptions;
    }

    return subfieldOptions.filter(
      (option) =>
        option.code.startsWith(query) ||
        option.label.toLocaleLowerCase().includes(query),
    );
  }, [activeFragment?.query, subfieldOptions]);
  const usedSubfieldCodes = getUsedSubfieldCodes(
    value,
    activeFragment,
    caretPosition,
  );
  const hasGuide = Boolean(dataRule || controlRule);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        wrapperRef.current?.contains(event.target)
      ) {
        return;
      }

      setIsOpen(false);
      setActiveIndex(-1);
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () =>
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
  }, [isOpen]);

  const focusInputAt = (position: number) => {
    requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
      inputRef.current?.setSelectionRange(position, position);
      setCaretPosition(position);
    });
  };

  const selectSubfield = (option: SubfieldOption) => {
    const normalized = ensureIndicatorPrefix(value, caretPosition);
    const replaceStart = activeFragment
      ? activeFragment.start + normalized.indexOffset
      : normalized.caretPosition;
    const replaceEnd = activeFragment
      ? caretPosition + normalized.indexOffset
      : normalized.caretPosition;
    const token = `$${option.code}`;
    const nextValue = `${normalized.value.slice(0, replaceStart)}${token}${normalized.value.slice(replaceEnd)}`;
    const nextCaretPosition = replaceStart + token.length;

    onChange(nextValue);
    setActiveIndex(-1);
    focusInputAt(nextCaretPosition);
  };

  const selectIndicator = (position: 1 | 2, code: string) => {
    const normalized = ensureIndicatorPrefix(value, caretPosition);
    const indicator = code === " " ? "\\" : code;
    const index = position - 1;
    const nextValue = `${normalized.value.slice(0, index)}${indicator}${normalized.value.slice(index + 1)}`;

    onChange(nextValue);
    focusInputAt(Math.max(normalized.caretPosition, 2));
  };

  const moveActiveOption = (direction: 1 | -1) => {
    if (filteredSubfields.length === 0) {
      return;
    }

    setActiveIndex((currentIndex) =>
      currentIndex < 0
        ? direction === 1
          ? 0
          : filteredSubfields.length - 1
        : (currentIndex + direction + filteredSubfields.length) %
          filteredSubfields.length,
    );
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (dataRule && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      setIsOpen(true);
      moveActiveOption(event.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (event.key === "Enter" && isOpen && activeIndex >= 0) {
      const option = filteredSubfields[activeIndex];
      if (option) {
        event.preventDefault();
        selectSubfield(option);
        return;
      }
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === "Tab") {
      setIsOpen(false);
      setActiveIndex(-1);
    }

    onKeyDown(event);
  };

  return (
    <div ref={wrapperRef} className="marc-content-combobox">
      <input
        ref={inputRef}
        type="text"
        className="form-control form-control-sm marc-row-input font-monospace"
        role={dataRule ? "combobox" : undefined}
        aria-label="MARC 지시기와 서브필드"
        aria-autocomplete={dataRule ? "list" : undefined}
        aria-controls={dataRule ? listboxId : guideId}
        aria-expanded={hasGuide ? isOpen : undefined}
        aria-activedescendant={
          dataRule && isOpen && activeIndex >= 0
            ? `${listboxId}-option-${activeIndex}`
            : undefined
        }
        autoFocus={autoFocus}
        placeholder={getContentPlaceholder(tag, dataRule)}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setCaretPosition(event.target.selectionStart ?? event.target.value.length);
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        onClick={(event) =>
          setCaretPosition(event.currentTarget.selectionStart ?? value.length)
        }
        onSelect={(event) =>
          setCaretPosition(event.currentTarget.selectionStart ?? value.length)
        }
        onFocus={(event) => {
          setCaretPosition(event.currentTarget.selectionStart ?? value.length);
          setIsOpen(hasGuide);
        }}
        onKeyDown={handleInputKeyDown}
      />

      {isOpen && hasGuide && (
        <div
          className="marc-content-guide card shadow-sm"
          id={guideId}
          role="dialog"
          aria-label={`${tag} MARC 입력 가이드`}
          tabIndex={-1}
          onMouseDownCapture={(event) => {
            if (event.target === event.currentTarget) {
              event.currentTarget.focus({ preventScroll: true });
            }
          }}
        >
          <div className="card-header py-2 d-flex flex-wrap align-items-center gap-2">
            <strong>
              {tag} {dataRule?.label ?? controlRule?.label ?? ""}
            </strong>
            {dataRule?.required && (
              <span className="badge text-bg-light">필수</span>
            )}
            {dataRule?.repeatable && (
              <span className="badge text-bg-light">반복 가능</span>
            )}
            {controlRule && (
              <span className="badge text-bg-light">제어필드</span>
            )}
          </div>

          {dataRule && (
            <>
              <div className="card-body py-2 border-bottom">
                <div className="marc-indicator-guide-grid">
                  {(["1", "2"] as const).map((position) => {
                    const indicatorRule = dataRule.indicators?.[position];
                    const indicatorOptions = getCodeOptions(
                      indicatorRule?.codeset,
                    );

                    return (
                      <div className="marc-indicator-guide" key={position}>
                        <div className="small fw-bold mb-1">
                          제{position}지시기호
                          {indicatorRule?.label
                            ? ` · ${indicatorRule.label}`
                            : ""}
                        </div>
                        <div className="d-flex flex-wrap gap-1">
                          {indicatorOptions.map((option) => {
                            const displayedCode =
                              option.code === " " ? "\\" : option.code;
                            const isSelected = value[position === "1" ? 0 : 1]
                              ? value[position === "1" ? 0 : 1] === displayedCode
                              : displayedCode === "\\";

                            return (
                              <button
                                type="button"
                                className={`btn btn-sm ${
                                  isSelected
                                    ? "btn-primary"
                                    : "btn-outline-secondary"
                                }`}
                                key={option.code}
                                aria-label={`제${position}지시기호 ${formatCode(option.code)} ${option.label} 선택`}
                                title={option.label}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() =>
                                  selectIndicator(Number(position) as 1 | 2, option.code)
                                }
                              >
                                <span className="font-monospace">
                                  {formatCode(option.code)}
                                </span>{" "}
                                {option.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                className="list-group list-group-flush marc-subfield-suggestions"
                id={listboxId}
                role="listbox"
                aria-label={`${tag} 사용 가능한 식별기호`}
                tabIndex={-1}
                onMouseDownCapture={(event) => {
                  if (event.target === event.currentTarget) {
                    event.currentTarget.focus({ preventScroll: true });
                  }
                }}
              >
                {filteredSubfields.length > 0 ? (
                  filteredSubfields.map((option, index) => {
                    const isAlreadyUsed =
                      !option.repeatable &&
                      usedSubfieldCodes.includes(option.code);
                    const codeValuePreview = option.codeValues
                      .map(
                        (codeOption) =>
                          `${formatCode(codeOption.code)} ${codeOption.label}`,
                      )
                      .join(" · ");

                    return (
                      <button
                        type="button"
                        className={`list-group-item list-group-item-action marc-subfield-option${
                          index === activeIndex ? " active" : ""
                        }`}
                        id={`${listboxId}-option-${index}`}
                        key={option.code}
                        role="option"
                        aria-selected={index === activeIndex}
                        onMouseDown={(event) => event.preventDefault()}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => selectSubfield(option)}
                      >
                        <span className="d-flex align-items-center gap-2">
                          <strong className="marc-subfield-option-code">
                            ${option.code}
                          </strong>
                          <span className="text-start">{option.label}</span>
                        </span>
                        <span className="d-flex flex-wrap gap-1 mt-1">
                          {option.required && (
                            <span className="badge text-bg-light">필수</span>
                          )}
                          {option.repeatable && (
                            <span className="badge text-bg-light">
                              반복 가능
                            </span>
                          )}
                          {isAlreadyUsed && (
                            <span className="badge text-bg-warning">
                              이미 사용 중
                            </span>
                          )}
                        </span>
                        {codeValuePreview && (
                          <span
                            className="d-block small text-start text-secondary mt-1 text-truncate"
                            title={codeValuePreview}
                          >
                            허용값: {codeValuePreview}
                          </span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <p className="small text-muted p-3 mb-0" role="status">
                    일치하는 식별기호가 없습니다. 직접 입력할 수 있습니다.
                  </p>
                )}
              </div>
            </>
          )}

          {controlRule && (
            <div className="card-body py-2 small">
              {controlRule.length && (
                <div>입력 길이: {controlRule.length}자리</div>
              )}
              {tag === "008" ? (
                <div className="text-secondary mt-1">
                  008은 상단의 고정길이편집 기능을 이용할 수 있습니다.
                </div>
              ) : (
                <div className="text-secondary mt-1">
                  제어필드 값을 직접 입력해 주세요.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
