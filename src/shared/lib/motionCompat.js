import { Fragment, createElement } from "react";
import { motion as baseMotion } from "./motion";

function createCompatTag(tag) {
  const Tag = baseMotion[tag];
  return ({ initial, animate, exit, transition, style, ...rest }) => {
    const merged = {
      ...(initial && typeof initial === "object" ? initial : null),
      ...(animate && typeof animate === "object" ? animate : null),
      ...style,
    };
    return createElement(Tag, { ...rest, transition, exit, style: merged });
  };
}

export const motion = new Proxy(
  {},
  {
    get: (_, tag) => createCompatTag(tag),
  },
);

export function AnimatePresence({ children }) {
  return createElement(Fragment, null, children);
}
