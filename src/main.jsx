import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { AppErrorBoundary, NOT_FOUND_ROUTE, redirectToNotFound } from "./app/AppErrorBoundary";
import { Error404Page } from "./app/Error404Page";
import "./styles/globals.css";

const ROOT_PATHS = new Set(["/", "/index.html"]);
const NOT_FOUND_PATHS = new Set([NOT_FOUND_ROUTE, "/404.html"]);

const VERCEL_ANALYTICS_SCRIPT_ID = "vercel-analytics-script";

const initializeVercelAnalytics = () => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  window.va = window.va || function (...args) {
    (window.vaq = window.vaq || []).push(args);
  };

  if (document.getElementById(VERCEL_ANALYTICS_SCRIPT_ID)) {
    return;
  }

  const analyticsScript = document.createElement("script");
  analyticsScript.id = VERCEL_ANALYTICS_SCRIPT_ID;
  analyticsScript.defer = true;
  analyticsScript.src = "/_vercel/insights/script.js";
  document.head.appendChild(analyticsScript);
};

const resolveShouldShow404 = (pathname) => !ROOT_PATHS.has(pathname) || NOT_FOUND_PATHS.has(pathname);

function Root() {
  const [showNotFound, setShowNotFound] = useState(resolveShouldShow404(window.location.pathname));

  useEffect(() => {
    const syncWithPath = () => {
      const pathname = window.location.pathname;
      const isNotFound = resolveShouldShow404(pathname);
      setShowNotFound(isNotFound);

      if (!ROOT_PATHS.has(pathname) && !NOT_FOUND_PATHS.has(pathname)) {
        redirectToNotFound();
      }
    };

    window.addEventListener("popstate", syncWithPath);

    syncWithPath();

    return () => {
      window.removeEventListener("popstate", syncWithPath);
    };
  }, []);

  if (showNotFound) {
    return <Error404Page />;
  }

  return (
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  );
}

initializeVercelAnalytics();

createRoot(document.getElementById("root")).render(<Root />);
