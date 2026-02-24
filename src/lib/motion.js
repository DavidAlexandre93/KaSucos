import { createElement, forwardRef, useEffect, useMemo, useRef, useState } from "react";

function createMotionTag(tag) {
  return forwardRef(function MotionTag(
    {
      whileHover,
      whileTap,
      initial,
      whileInView,
      transition,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      style,
      ...rest
    },
    ref,
  ) {
    const innerRef = useRef(null);
    const [isHover, setIsHover] = useState(false);
    const [isTap, setIsTap] = useState(false);
    const [isInView, setIsInView] = useState(!whileInView);

    useEffect(() => {
      if (!whileInView || !innerRef.current) return undefined;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.2 },
      );
      observer.observe(innerRef.current);
      return () => observer.disconnect();
    }, [whileInView]);

    const animatedStyle = useMemo(() => {
      const base = { ...(isInView ? whileInView : initial), ...(isTap ? whileTap : isHover ? whileHover : null) };
      if (!transition) return { ...style, ...base };
      return { ...style, ...base, transition: "all 260ms ease" };
    }, [initial, isHover, isInView, isTap, style, transition, whileHover, whileInView, whileTap]);

    return createElement(tag, {
      ...rest,
      ref: (node) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      style: animatedStyle,
      onMouseEnter: (event) => {
        setIsHover(true);
        onMouseEnter?.(event);
      },
      onMouseLeave: (event) => {
        setIsHover(false);
        setIsTap(false);
        onMouseLeave?.(event);
      },
      onMouseDown: (event) => {
        setIsTap(true);
        onMouseDown?.(event);
      },
      onMouseUp: (event) => {
        setIsTap(false);
        onMouseUp?.(event);
      },
    });
  });
}

export const motion = new Proxy({}, { get: (_, tag) => createMotionTag(tag) });
