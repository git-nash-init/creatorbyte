import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** Returns true only after client mount — use to gate persisted-store UI
 *  so server HTML and first client paint match (avoids hydration mismatch). */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
