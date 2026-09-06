import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

/**
 * Hook to safely detect client-side mounting without triggering
 * React 19 cascading renders or hydration mismatch warnings.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}
