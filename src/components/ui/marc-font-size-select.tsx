import type { ComponentPropsWithoutRef } from "react";
import { Form } from "react-bootstrap";

export const fontSizeList = ["16", "18", "20", "22", "24"];

interface MarcFontSizeSelectProps extends ComponentPropsWithoutRef<
  typeof Form.Select
> {
  value: string;
  onChange: (value: string) => void;
}

export default function MarcFontSizeSelect({
  value,
  onChange,
  ...props
}: MarcFontSizeSelectProps) {
  return (
    <Form.Select
      aria-label="주자료 글자크기"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      {...props}
    >
      {fontSizeList.map((size) => (
        <option key={size} value={size}>
          {size} px
        </option>
      ))}
    </Form.Select>
  );
}
