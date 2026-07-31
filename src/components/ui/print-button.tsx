import { useReactToPrint } from "react-to-print";

export default function PrintButton<T extends HTMLElement>({
  contentRef,
}: {
  contentRef: React.RefObject<T>;
}) {
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <button
      type="button"
      className="btn btn-sm btn-outline-secondary"
      onClick={reactToPrintFn}
    >
      <i className="bi bi-printer me-1" aria-hidden="true"></i>
      출력
    </button>
  );
}
