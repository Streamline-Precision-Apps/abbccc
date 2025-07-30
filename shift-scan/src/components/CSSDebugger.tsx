/**
 * CSS Debug Helper - helps diagnose CSS loading issues in offline mode
 */
"use client";

import { useEffect, useState } from "react";

const CSSDebugger = () => {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const debugCSS = () => {
      const logs: string[] = [];

      // Check all stylesheets
      const stylesheets = Array.from(document.styleSheets);
      logs.push(`Found ${stylesheets.length} stylesheets`);

      stylesheets.forEach((sheet, index) => {
        try {
          const href = sheet.href || "inline";
          logs.push(`Stylesheet ${index + 1}: ${href}`);

          if (sheet.href && sheet.href.includes("/_next/static/css/")) {
            try {
              const rules = sheet.cssRules || sheet.rules;
              logs.push(
                `  - Rules: ${rules ? rules.length : "Unable to access"}`
              );
            } catch (e) {
              logs.push(
                `  - Rules: Error accessing (${
                  e instanceof Error ? e.message : "Unknown error"
                })`
              );
            }
          }
        } catch (e) {
          logs.push(
            `Stylesheet ${index + 1}: Error (${
              e instanceof Error ? e.message : "Unknown error"
            })`
          );
        }
      });

      // Check if Tailwind classes are working
      const testClasses = ["hidden", "flex", "bg-blue-500", "text-white"];
      testClasses.forEach((className) => {
        const testEl = document.createElement("div");
        testEl.className = className;
        testEl.style.position = "absolute";
        testEl.style.top = "-9999px";
        document.body.appendChild(testEl);

        const computed = window.getComputedStyle(testEl);
        let result = "working";

        if (className === "hidden" && computed.display !== "none")
          result = "not working";
        if (className === "flex" && computed.display !== "flex")
          result = "not working";

        logs.push(`Tailwind class '.${className}': ${result}`);
        document.body.removeChild(testEl);
      });

      // Check service worker cache
      if ("caches" in window) {
        caches.keys().then((cacheNames) => {
          logs.push(`Cache names: ${cacheNames.join(", ")}`);

          if (cacheNames.length > 0) {
            caches.open(cacheNames[0]).then((cache) => {
              cache.keys().then((keys) => {
                const cssKeys = keys.filter((key) => key.url.includes(".css"));
                logs.push(`Cached CSS files: ${cssKeys.length}`);
                cssKeys.forEach((key) => {
                  logs.push(`  - ${key.url}`);
                });
                setDebugInfo([...logs]);
              });
            });
          } else {
            setDebugInfo([...logs]);
          }
        });
      } else {
        setDebugInfo([...logs]);
      }
    };

    // Run debug check
    setTimeout(debugCSS, 1000);

    // Add keyboard shortcut to toggle debug info (Ctrl+Shift+D)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setIsVisible(!isVisible);
        debugCSS();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        color: "white",
        padding: "20px",
        borderRadius: "8px",
        fontSize: "12px",
        fontFamily: "monospace",
        maxWidth: "400px",
        maxHeight: "80vh",
        overflow: "auto",
        zIndex: 10000,
        border: "1px solid #333",
      }}
    >
      <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
        CSS Debug Info (Press Ctrl+Shift+D to toggle)
        <button
          onClick={() => setIsVisible(false)}
          style={{
            float: "right",
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ×
        </button>
      </div>
      <div>
        {debugInfo.map((line, index) => (
          <div key={index} style={{ marginBottom: "4px" }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CSSDebugger;
