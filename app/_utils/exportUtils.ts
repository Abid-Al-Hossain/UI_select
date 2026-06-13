import type { SelectStudioState } from "../types";

export type ExportPayload = {
  fileName: string;
  mimeType: "text/plain;charset=utf-8";
  content: string;
};

export function buildExportPayload(state: SelectStudioState, fileName = "select") : ExportPayload {
  return {
    fileName: `${fileName || "select"}.jsx`,
    mimeType: "text/plain;charset=utf-8",
    content: buildReactCode(state),
  };
}

export function buildReactCode(state: SelectStudioState) {
  return `import * as React from "react";

const state = ${JSON.stringify(state, null, 2)};

export default function SelectStudioComponent() {
  const invalid = state.invalid || state.previewState === "invalid";
  const message = invalid ? state.errorText : state.showSuccess ? state.successText : state.showHelper ? state.helper : "";
  const optionCount = Math.max(2, state.optionCount);
  const groupCount = Math.max(1, state.groupCount);
  const options = Array.from({ length: optionCount }, (_, index) => ({
    label: index === 0 ? "Growth workspace" : \`Option \${index + 1}\`,
    value: index === 0 ? state.value : \`option-\${index + 1}\`,
    group: \`Group \${(index % groupCount) + 1}\`,
  }));
  const selectedOption = options.find((option) => option.value === state.value) ?? options[0];
  const groups = Array.from(new Set(options.map((option) => option.group)));
  const fieldStyle = {
    width: "100%",
    borderRadius: 12,
    border: \`1px solid \${invalid ? "#fb7185" : state.border}\`,
    background: "rgba(255,255,255,0.1)",
    padding: "8px 12px",
    outline: 0,
    color: state.foreground,
  };
  const nativeSelect = (
    <select
      id={state.id}
      name={state.name}
      title={state.title}
      tabIndex={state.tabIndex}
      dir={state.dir}
      lang={state.lang}
      value={state.value}
      required={state.required}
      disabled={state.disabled}
      autoComplete={state.autocomplete}
      aria-invalid={invalid || undefined}
      style={fieldStyle}
      onChange={() => undefined}
    >
      {state.placeholder && <option value="" disabled={state.required}>{state.placeholder}</option>}
      {groups.map((group) => (
        <optgroup key={group} label={group}>
          {options.filter((option) => option.group === group).map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </optgroup>
      ))}
    </select>
  );
  const customPanel = (
    <div role="listbox" id={\`\${state.id}-listbox\`} aria-label={\`\${state.label} options\`} style={{ display: "grid", gap: 4, borderRadius: 12, border: \`1px solid \${state.border}\`, padding: 8, background: "rgba(255,255,255,0.06)" }}>
      {options.map((option) => (
        <button key={option.value} type="button" role="option" aria-selected={option.value === state.value} style={{ border: 0, borderRadius: 8, padding: "8px 12px", textAlign: "left", background: option.value === state.value ? state.accent : "transparent", color: option.value === state.value ? "#ffffff" : state.foreground }}>
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <div
      style={{
        width: state.width,
        minHeight: state.height,
        padding: state.padding,
        display: "grid",
        alignContent: "center",
        gap: state.gap,
        borderRadius: state.radius,
        border: \`\${state.borderWidth}px solid \${invalid ? "#fb7185" : state.previewState === "focus" ? state.accent : state.border}\`,
        boxShadow: \`0 \${Math.round(state.shadow / 3)}px \${state.shadow}px rgba(0,0,0,.28)\`,
        background: state.background,
        color: state.foreground,
        fontFamily: state.fontFamily,
        opacity: state.disabled || state.previewState === "disabled" ? 0.55 : 1,
        outline: state.previewState === "focus" ? \`\${state.focusRing}px solid \${state.accent}\` : "none",
        transition: state.transitionDuration > 0 ? "$1" : "none",
      }}
    >
      <label htmlFor={state.id} style={{ fontSize: state.labelSize, fontWeight: state.fontWeight }}>
        {state.label}{state.required ? " *" : ""}
      </label>
      <p style={{ margin: 0, color: state.muted }}>{state.description}</p>
      {state.selectMode === "native" ? nativeSelect : (
        <div style={{ display: "grid", gap: 8 }}>
          {state.selectMode === "combobox" && state.searchable ? (
            <input
              id={state.id}
              role="combobox"
              aria-controls={\`\${state.id}-listbox\`}
              aria-expanded="true"
              aria-autocomplete="list"
              aria-invalid={invalid || undefined}
              value={selectedOption.label}
              placeholder={state.placeholder}
              disabled={state.disabled}
              readOnly
              style={fieldStyle}
            />
          ) : (
            <button
              id={state.id}
              type="button"
              role="combobox"
              aria-controls={\`\${state.id}-listbox\`}
              aria-expanded="true"
              aria-invalid={invalid || undefined}
              disabled={state.disabled}
              style={{ ...fieldStyle, textAlign: "left" }}
            >
              {selectedOption.label || state.placeholder}
            </button>
          )}
          {state.clearable && (
            <button type="button" disabled={state.disabled} style={{ justifySelf: "start", border: \`1px solid \${state.border}\`, borderRadius: 8, padding: "4px 8px", color: state.foreground, background: "transparent" }}>
              Clear selection
            </button>
          )}
          {customPanel}
        </div>
      )}
      <small style={{ color: invalid ? "#fb7185" : state.showSuccess ? "#22c55e" : state.muted }}>{message}</small>
    </div>
  );
}
`;
}
