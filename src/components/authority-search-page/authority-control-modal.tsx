export default function AuthorityControlModal() {
  return;
}

export function AuthorityControlButton() {
  return (
    <button
      type="button"
      className="btn btn-outline-dark btn-sm"
      data-bs-toggle="modal"
      data-bs-target="#modalControl"
    >
      <i className="bi bi-link-45deg me-1" aria-hidden="true"></i>
      전거통제
    </button>
  );
}
