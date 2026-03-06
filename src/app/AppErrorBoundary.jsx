import { Component } from "react";
import { Error404Page } from "./Error404Page";

const NOT_FOUND_ROUTE = "/404";

const redirectToNotFound = () => {
  if (typeof window === "undefined") return;

  if (window.location.pathname !== NOT_FOUND_ROUTE) {
    window.history.replaceState(null, "", NOT_FOUND_ROUTE);
  }

  window.dispatchEvent(new PopStateEvent("popstate"));
};

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    redirectToNotFound();
  }

  render() {
    if (this.state.hasError) {
      return <Error404Page />;
    }

    return this.props.children;
  }
}

export { redirectToNotFound, NOT_FOUND_ROUTE };
