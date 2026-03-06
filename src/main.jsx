import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { AppErrorBoundary, NOT_FOUND_ROUTE, redirectToNotFound } from "./app/AppErrorBoundary";
import { Error404Page } from "./app/Error404Page";
import "./styles/globals.css";

const ROOT_PATHS = new Set(["/", "/index.html"]);
const NOT_FOUND_PATHS = new Set([NOT_FOUND_ROUTE, "/404.html"]);

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

    const handleUnexpectedError = () => {
      redirectToNotFound();
      setShowNotFound(true);
    };

    window.addEventListener("popstate", syncWithPath);
    window.addEventListener("error", handleUnexpectedError);
    window.addEventListener("unhandledrejection", handleUnexpectedError);

    syncWithPath();

    return () => {
      window.removeEventListener("popstate", syncWithPath);
      window.removeEventListener("error", handleUnexpectedError);
      window.removeEventListener("unhandledrejection", handleUnexpectedError);
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

createRoot(document.getElementById("root")).render(<Root />);
