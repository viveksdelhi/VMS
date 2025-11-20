import { useEventContext } from "../contexts/EventContext";

/**
 * Compatibility hook that reuses the shared EventContext.
 * Ensures all consumers share the same event data & API calls.
 */
export const useEvents = () => {
  return useEventContext();
};

