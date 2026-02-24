import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "../../lib/gsap";

const prefersReducedMotion =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function TypingText({
  text,
  as: Tag = "h2",
  className = "",
  speed = 42,
  delay = 120,
  highlight = false,
}) {
  const [typedText, setTypedText] = useState(prefersReducedMotion ? text : "");
  const [started, setStarted] = useState(prefersReducedMotion);
  const rootRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setTypedText(text);
      setStarted(true);
      return undefined;
    }

    setTypedText("");
    setStarted(false);

    const node = rootRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setStarted(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [text]);

  useEffect(() => {
    if (!started || prefersReducedMotion) return undefined;

    const node = rootRef.current;
    if (node) {
      gsap.timeline().fromTo(node, { opacity: 0.4, y: 12 }, { opacity: 1, y: 0, duration: 0.45 });
    }

    let frameId;
    let timeoutId;
    let currentIndex = 0;
    let lastTimestamp = 0;

    const tick = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;

      if (timestamp - lastTimestamp >= speed) {
        currentIndex += 1;
        setTypedText(text.slice(0, currentIndex));
        lastTimestamp = timestamp;
      }

      if (currentIndex < text.length) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    timeoutId = window.setTimeout(() => {
      frameId = window.requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [delay, speed, started, text]);

  const classes = useMemo(() => {
    const list = ["typing-text", className];
    if (highlight) list.push("typing-text--highlight");
    return list.filter(Boolean).join(" ");
  }, [className, highlight]);

  return (
    <Tag className={classes} ref={rootRef} data-full-text={text}>
      <span>{typedText}</span>
      {!prefersReducedMotion ? <span className="typing-caret" aria-hidden="true" /> : null}
    </Tag>
  );
}
