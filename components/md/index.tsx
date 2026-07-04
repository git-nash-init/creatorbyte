"use client";

/**
 * Thin React wrappers around Material Web custom elements.
 *
 * Using a variable tag typed as `any` sidesteps JSX intrinsic-element checks
 * (Material Web ships no React typings) while still giving each component a
 * clean, ref-forwarding React API. Native events (click / input / change)
 * bubble and are caught by React's onClick / onInput / onChange as usual.
 */
import * as React from "react";

type AnyProps = React.HTMLAttributes<HTMLElement> &
  Record<string, unknown> & { children?: React.ReactNode };

function md(tag: string) {
  const El = tag as unknown as React.ElementType;
  const Comp = React.forwardRef<HTMLElement, AnyProps>(function Comp(props, ref) {
    return <El ref={ref} {...props} />;
  });
  Comp.displayName = tag;
  return Comp;
}

export const MdFilledButton = md("md-filled-button");
export const MdOutlinedButton = md("md-outlined-button");
export const MdTextButton = md("md-text-button");
export const MdElevatedButton = md("md-elevated-button");
export const MdFilledTonalButton = md("md-filled-tonal-button");

export const MdIconButton = md("md-icon-button");
export const MdFilledIconButton = md("md-filled-icon-button");
export const MdFilledTonalIconButton = md("md-filled-tonal-icon-button");
export const MdFab = md("md-fab");

export const MdFilledTextField = md("md-filled-text-field");
export const MdOutlinedTextField = md("md-outlined-text-field");
export const MdFilledSelect = md("md-filled-select");
export const MdOutlinedSelect = md("md-outlined-select");
export const MdSelectOption = md("md-select-option");

export const MdSwitch = md("md-switch");
export const MdCheckbox = md("md-checkbox");
export const MdRadio = md("md-radio");
export const MdSlider = md("md-slider");

export const MdTabs = md("md-tabs");
export const MdPrimaryTab = md("md-primary-tab");
export const MdSecondaryTab = md("md-secondary-tab");

export const MdDialog = md("md-dialog");
export const MdMenu = md("md-menu");
export const MdMenuItem = md("md-menu-item");

export const MdChipSet = md("md-chip-set");
export const MdFilterChip = md("md-filter-chip");
export const MdAssistChip = md("md-assist-chip");
export const MdInputChip = md("md-input-chip");
export const MdSuggestionChip = md("md-suggestion-chip");

export const MdList = md("md-list");
export const MdListItem = md("md-list-item");
export const MdDivider = md("md-divider");

export const MdCircularProgress = md("md-circular-progress");
export const MdLinearProgress = md("md-linear-progress");
export const MdRipple = md("md-ripple");
export const MdFocusRing = md("md-focus-ring");

/** Material Symbols glyph. Pass the icon name as children, e.g. <MdIcon>settings</MdIcon> */
export function MdIcon({
  children,
  slot,
  className,
  filled,
  style,
}: {
  children: React.ReactNode;
  slot?: string;
  className?: string;
  filled?: boolean;
  style?: React.CSSProperties;
}) {
  const El = "md-icon" as unknown as React.ElementType;
  return (
    <El
      slot={slot}
      class={className}
      style={{
        ...(filled
          ? { fontVariationSettings: "'FILL' 1" }
          : undefined),
        ...style,
      }}
    >
      {children}
    </El>
  );
}
