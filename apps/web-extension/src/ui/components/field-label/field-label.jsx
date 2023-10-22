import { createElement } from "react";

export function FieldLabel({ htmlFor, label, icon, iconProps }) {
  return (
    <div className="field-label">
      {icon ? createElement(icon, { className: "field-icon", ...iconProps }) : null}
      <label htmlFor={htmlFor}>
        <span>{label}</span>
      </label>
    </div>
  );
}
