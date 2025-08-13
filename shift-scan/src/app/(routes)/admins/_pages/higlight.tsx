import React from "react";

export function highlight(text: string, term: string) {
  if (!term) return text;
  const regex = new RegExp(`(${term})`, "ig");
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 px-0.5 rounded">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
