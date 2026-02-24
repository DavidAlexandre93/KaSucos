import { useLayoutEffect } from "react";

export function useGSAP(effect, { scope, dependencies = [] } = {}) {
  useLayoutEffect(() => {
    const context = {
      selector: (selector) => {
        if (!scope?.current) return [];
        return Array.from(scope.current.querySelectorAll(selector));
      },
    };

    return effect(context);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
