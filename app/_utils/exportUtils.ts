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
  return [
    "import * as React from \"react\";",
    "",
    "const state = " + JSON.stringify(state, null, 2) + ";",
    "",
    "export default function SelectStudioComponent() {",
    "  return (",
        "    <label htmlFor={state.id}>{state.label}</label>",
    "    <select id={state.id} name={state.name} value={state.value} required={state.required} disabled={state.disabled} onChange={() => undefined}>{Array.from({ length: state.optionCount }, (_, index) => <option key={index}>Option {index + 1}</option>)}</select>",
    "  );",
    "}",
    "",
  ].join("\n");
}
