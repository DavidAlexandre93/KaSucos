import { useLayoutEffect } from "react";
import gsap from "./gsap";

export function useGSAP(effect, { scope, dependencies = [] } = {}) {
  useLayoutEffect(() => {
    const context = gsap.context(
      () =>
        effect({
          selector: (selector) => {
            if (!scope?.current) return [];
            return Array.from(scope.current.querySelectorAll(selector));
          },
        }),
      scope?.current,
    );

    return () => context.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
