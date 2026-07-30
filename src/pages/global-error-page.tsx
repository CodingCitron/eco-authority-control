import { isRouteErrorResponse, useRouteError } from "react-router";

import { css } from "styled-system/css";

const className = css({
  padding: "50px",
  textAlign: "center",
});

export default function GlobalErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    console.log(error.status);
    console.log(error.statusText);
  }

  if (error instanceof Error) {
    console.log(error.message);
  }

  return (
    <div className={className}>
      <h1>예기치 못한 시스템 오류가 발생했습니다.</h1>
      <p>
        서비스 이용에 불편을 드려 죄송합니다. 지속될 경우 고객센터로 문의
        바랍니다.
      </p>
      <button onClick={() => window.location.reload()}>페이지 새로고침</button>
    </div>
  );
}
