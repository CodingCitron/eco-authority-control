import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { kormarcAuthorityRulePack } from "marc-eco";

interface MarcTagOption {
  tag: string;
  label: string;
  isControlField: boolean;
  isRequired: boolean;
  isRepeatable: boolean;
}

const marcTagOptions: MarcTagOption[] = [
  ...Object.entries(kormarcAuthorityRulePack.controlFields).map(
    ([tag, rule]) => ({
      tag,
      label: rule.label ?? "명칭 없음",
      isControlField: true,
      isRequired: rule.required === true,
      isRepeatable: rule.repeatable === true,
    }),
  ),
  ...Object.entries(kormarcAuthorityRulePack.fields).map(([tag, rule]) => ({
    tag,
    label: rule.label ?? "명칭 없음",
    isControlField: false,
    isRequired: rule.required === true,
    isRepeatable: rule.repeatable === true,
  })),
].sort((left, right) => left.tag.localeCompare(right.tag));

interface MarcTagComboboxProps {
  value: string;
  autoFocus?: boolean;
  usedTags: readonly string[];
  onChange: (value: string) => void;
  onFocus?: () => void;
  onSelect: (tag: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

/** 자유 입력을 유지하면서 marc-eco의 전거 태그를 안내하는 콤보박스다. */
export default function MarcTagCombobox({
  value,
  autoFocus,
  usedTags,
  onChange,
  onFocus,
  onSelect,
  onKeyDown,
}: MarcTagComboboxProps) {
  const listboxId = useId();
  const comboboxRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const normalizedQuery = value.trim().toLocaleLowerCase();
  const filteredOptions = useMemo(
    () =>
      normalizedQuery
        ? marcTagOptions.filter(
            (option) =>
              option.tag.startsWith(normalizedQuery) ||
              option.label.toLocaleLowerCase().includes(normalizedQuery),
          )
        : marcTagOptions,
    [normalizedQuery],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        comboboxRef.current?.contains(event.target)
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

  const scrollToOption = (index: number) => {
    requestAnimationFrame(() => {
      listboxRef.current
        ?.querySelector<HTMLElement>(`[data-option-index="${index}"]`)
        ?.scrollIntoView?.({ block: "nearest" });
    });
  };

  const openSuggestions = () => {
    setIsOpen(true);
    requestAnimationFrame(() => {
      listboxRef.current?.scrollIntoView?.({ block: "nearest" });
    });
  };

  const moveActiveOption = (direction: 1 | -1) => {
    if (filteredOptions.length === 0) {
      return;
    }

    const nextIndex =
      activeIndex < 0
        ? direction === 1
          ? 0
          : filteredOptions.length - 1
        : (activeIndex + direction + filteredOptions.length) %
          filteredOptions.length;
    setActiveIndex(nextIndex);
    scrollToOption(nextIndex);
  };

  const selectOption = (option: MarcTagOption) => {
    onChange(option.tag);
    setIsOpen(false);
    setActiveIndex(-1);
    onSelect(option.tag);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openSuggestions();
      moveActiveOption(event.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (event.key === "Enter" && isOpen && activeIndex >= 0) {
      const option = filteredOptions[activeIndex];
      if (option) {
        event.preventDefault();
        selectOption(option);
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
    <div ref={comboboxRef} className="marc-tag-combobox">
      <input
        type="text"
        className="form-control form-control-sm marc-row-input marc-row-tag-input font-monospace"
        role="combobox"
        aria-label="MARC 태그"
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-activedescendant={
          isOpen && activeIndex >= 0
            ? `${listboxId}-option-${activeIndex}`
            : undefined
        }
        autoFocus={autoFocus}
        placeholder="태그 또는 명칭"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          openSuggestions();
          setActiveIndex(-1);
        }}
        onFocus={() => {
          onFocus?.();
          openSuggestions();
        }}
        onKeyDown={handleKeyDown}
      />

      {isOpen && (
        <div
          ref={listboxRef}
          className="marc-tag-suggestions list-group shadow-sm"
          id={listboxId}
          role="listbox"
          aria-label="사용 가능한 MARC 태그"
          tabIndex={-1}
          onMouseDownCapture={(event) => {
            event.currentTarget.focus({ preventScroll: true });
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => {
              const isAlreadyUsed =
                !option.isRepeatable && usedTags.includes(option.tag);

              return (
                <button
                  type="button"
                  className={`list-group-item list-group-item-action marc-tag-option${
                    index === activeIndex ? " active" : ""
                  }`}
                  id={`${listboxId}-option-${index}`}
                  key={option.tag}
                  role="option"
                  aria-selected={index === activeIndex}
                  data-option-index={index}
                  tabIndex={-1}
                  onClick={() => selectOption(option)}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <span className="d-flex align-items-center gap-2">
                    <strong className="marc-tag-option-code">
                      {option.tag}
                    </strong>
                    <span className="text-start">{option.label}</span>
                  </span>
                  <span className="d-flex flex-wrap gap-1 mt-1">
                    {option.isControlField && (
                      <span className="badge text-bg-light">제어필드</span>
                    )}
                    {option.isRequired && (
                      <span className="badge text-bg-light">필수</span>
                    )}
                    {option.isRepeatable && (
                      <span className="badge text-bg-light">반복 가능</span>
                    )}
                    {option.tag === "008" && (
                      <span className="badge text-bg-light">
                        고정길이편집 지원
                      </span>
                    )}
                    {isAlreadyUsed && (
                      <span className="badge text-bg-warning">
                        이미 사용 중
                      </span>
                    )}
                  </span>
                </button>
              );
            })
          ) : (
            <p
              className="list-group-item small text-muted p-3 mb-0"
              role="status"
            >
              marc-eco에 정의되지 않은 태그입니다. 숫자 세 자리 태그를 직접
              입력할 수 있습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
