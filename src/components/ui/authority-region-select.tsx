import { forwardRef, type SelectHTMLAttributes } from "react";

import { useAuthoritySettings } from "@/hooks/use-authority-settings";

interface AuthorityRegionSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  /** settings에 없는 수정 데이터의 지역 코드도 선택값으로 유지한다. */
  fallbackValue?: string;
  /** 등록·수정 화면처럼 전체(0) 선택이 필요 없는 경우 사용한다. */
  excludeAllOption?: boolean;
}

const AuthorityRegionSelect = forwardRef<
  HTMLSelectElement,
  AuthorityRegionSelectProps
>(function AuthorityRegionSelect(
  {
    fallbackValue,
    excludeAllOption = false,
    className = "form-select",
    disabled,
    ...props
  },
  ref,
) {
  const {
    data: settingsResponse,
    isLoading: isSettingsLoading,
    isError: isSettingsError,
  } = useAuthoritySettings();
  const regionCodes = settingsResponse?.data.REGION_CODE ?? {};
  const hasFallbackOption =
    Boolean(fallbackValue) && !Object.hasOwn(regionCodes, fallbackValue ?? "");

  return (
    <select
      {...props}
      ref={ref}
      className={className}
      disabled={disabled || isSettingsLoading || isSettingsError}
    >
      <option value="">
        {isSettingsError
          ? "설정 조회 실패"
          : isSettingsLoading
            ? "설정 불러오는 중"
            : "선택"}
      </option>
      {Object.entries(regionCodes)
        .filter(([code]) => !excludeAllOption || code !== "0")
        .map(([code, label]) => (
          <option key={code} value={code}>
            {code} : {label}
          </option>
        ))}
      {hasFallbackOption && (
        <option value={fallbackValue}>{fallbackValue}</option>
      )}
    </select>
  );
});

export default AuthorityRegionSelect;
