import { useId, useRef, useState, type ReactNode } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function OverflowTooltip({
  text,
  children,
}: {
  text: string;
  children: ReactNode;
}) {
  const tooltipId = useId();
  const contentRef = useRef<HTMLSpanElement>(null);
  const [show, setShow] = useState(false);

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 100 }}
      show={show}
      onToggle={(nextShow) => {
        const element = contentRef.current;
        setShow(
          nextShow &&
            Boolean(element && element.scrollWidth > element.clientWidth),
        );
      }}
      overlay={
        <Tooltip id={tooltipId} className="table-cell-tooltip">
          {text}
        </Tooltip>
      }
    >
      <span ref={contentRef} className="table-cell-ellipsis" tabIndex={0}>
        {children}
      </span>
    </OverlayTrigger>
  );
}
