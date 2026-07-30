export default function BulkExportButton() {
  return (
    <button
      type="button"
      className="btn btn-sm btn-outline-secondary"
      data-bs-toggle="modal"
      data-bs-target="#modalExport"
    >
      <i className="bi bi-download me-1" aria-hidden="true"></i>
      일괄반출
    </button>
  );
}
