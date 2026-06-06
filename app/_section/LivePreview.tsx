"use client";

import type { CSSProperties } from "react";
import type { SelectStudioState } from "../types";

function shellStyle(state: SelectStudioState): CSSProperties {
  const invalid = state.invalid || state.previewState === "invalid";
  return {
    width: state.width,
    minHeight: state.height,
    padding: state.padding,
    gap: state.gap,
    borderRadius: state.radius,
    border: `${state.borderWidth}px solid ${invalid ? "#fb7185" : state.previewState === "focus" ? state.accent : state.border}`,
    boxShadow: `0 ${Math.round(state.shadow / 3)}px ${state.shadow}px rgba(0,0,0,.28)`,
    background: state.background,
    color: state.foreground,
    fontFamily: state.fontFamily,
    opacity: state.disabled || state.previewState === "disabled" ? 0.55 : 1,
    outline: state.previewState === "focus" ? `${state.focusRing}px solid ${state.accent}` : "none",
    transition: state.motion ? "all 180ms ease" : "none",
  };
}

export default function LivePreview({ state }: { state: SelectStudioState }) {
  const invalid = state.invalid || state.previewState === "invalid";
  const message = invalid ? state.errorText : state.showSuccess ? state.successText : state.showHelper ? state.helper : "";
  const commonInput = "w-full rounded-xl border bg-white/10 px-3 py-2 outline-none";
  const optionCount = Math.max(2, state.optionCount);
  const groupCount = Math.max(1, state.groupCount);
  const options = Array.from({ length: optionCount }, (_, index) => ({
    label: index === 0 ? "Growth workspace" : `Option ${index + 1}`,
    value: index === 0 ? state.value : `option-${index + 1}`,
    group: `Group ${(index % groupCount) + 1}`,
  }));
  const selectedOption = options.find((option) => option.value === state.value) ?? options[0];
  const groups = Array.from(new Set(options.map((option) => option.group)));
  const nativeSelect = (
    <select id={state.id} name={state.name} title={state.title} tabIndex={state.tabIndex} dir={state.dir} lang={state.lang} value={state.value} required={state.required} disabled={state.disabled} autoComplete={state.autocomplete} aria-invalid={invalid || undefined} className={commonInput} style={{ borderColor: invalid ? "#fb7185" : state.border, color: state.foreground }} onChange={() => undefined}>
      {state.placeholder && <option value="" disabled={state.required}>{state.placeholder}</option>}
      {groups.map((group) => (
        <optgroup key={group} label={group}>
          {options.filter((option) => option.group === group).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </optgroup>
      ))}
    </select>
  );
  const customPanel = (
    <div role="listbox" id={`${state.id}-listbox`} aria-label={`${state.label} options`} className="grid gap-1 rounded-xl border p-2" style={{ borderColor: state.border, background: "rgba(255,255,255,0.06)" }}>
      {options.map((option) => <button key={option.value} type="button" role="option" aria-selected={option.value === state.value} className="rounded-lg px-3 py-2 text-left text-sm" style={{ background: option.value === state.value ? state.accent : "transparent", color: option.value === state.value ? "#ffffff" : state.foreground }}>{option.label}</button>)}
    </div>
  );

  return (
    <div style={shellStyle(state)} className="grid content-center">
      <label htmlFor={state.id} style={{ fontSize: state.labelSize, fontWeight: state.fontWeight }}>{state.label}{state.required ? " *" : ""}</label>
      <p className="text-sm" style={{ color: state.muted }}>{state.description}</p>
      {state.selectMode === "native" ? nativeSelect : (
        <div className="grid gap-2">
          {state.selectMode === "combobox" && state.searchable ? (
            <input id={state.id} role="combobox" aria-controls={`${state.id}-listbox`} aria-expanded="true" aria-autocomplete="list" aria-invalid={invalid || undefined} value={selectedOption.label} placeholder={state.placeholder} disabled={state.disabled} readOnly className={commonInput} style={{ borderColor: invalid ? "#fb7185" : state.border, color: state.foreground }} />
          ) : (
            <button id={state.id} type="button" role="combobox" aria-controls={`${state.id}-listbox`} aria-expanded="true" aria-invalid={invalid || undefined} disabled={state.disabled} className={commonInput} style={{ borderColor: invalid ? "#fb7185" : state.border, color: state.foreground, textAlign: "left" }}>{selectedOption.label || state.placeholder}</button>
          )}
          {state.clearable && <button type="button" disabled={state.disabled} className="justify-self-start rounded-lg px-2 py-1 text-xs" style={{ border: `1px solid ${state.border}`, color: state.foreground }}>Clear selection</button>}
          {customPanel}
        </div>
      )}
      <small style={{ color: invalid ? "#fb7185" : state.showSuccess ? "#22c55e" : state.muted }}>{message}</small>
    </div>
  );
}
