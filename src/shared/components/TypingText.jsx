import { useMemo } from "react";

export function TypingText({ text, as: Tag = "h2", className = "", highlight = false }) {
  const classes = useMemo(() => {
    const list = ["typing-text", className];
    if (highlight) list.push("typing-text--highlight");
    return list.filter(Boolean).join(" ");
  }, [className, highlight]);

  return (
    <Tag className={classes} data-full-text={text}>
      <span>{text}</span>
    </Tag>
  );
}
