import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
const ShadowWrapper = ({ children }) => {
    const containerRef = useRef(null);
    useEffect(() => {
        if (containerRef.current && !containerRef.current.shadowRoot) {
            // Attach shadow root in "open" mode
            const shadowRoot = containerRef.current.attachShadow({ mode: "open" });
            // Inject Tailwind styles
            const styleEl = document.createElement("style");
            styleEl.textContent = `
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `;
            shadowRoot.appendChild(styleEl);
            // Create a mounting point inside the Shadow DOM
            const mountPoint = document.createElement("div");
            shadowRoot.appendChild(mountPoint);
            // Render the children inside the mount point
            mountPoint.appendChild(document.createElement("div")).innerHTML = `
        <style>
          /* Add a basic reset to ensure visibility */
          :host {
            all: initial;
            display: block;
          }
        </style>
      `;
            // Use ReactDOM to render children inside the mount point
            mountPoint.appendChild(document.createElement("div")).append(...Array.from(containerRef.current.children));
        }
    }, []);
    return _jsx("div", { ref: containerRef, className: "bbb", children: children });
};
export default ShadowWrapper;
