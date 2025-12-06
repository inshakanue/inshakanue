/**
 * APPLICATION ENTRY POINT
 * 
 * BUSINESS CONTEXT:
 * This file initializes the React application and loads essential assets.
 * It's the first JavaScript file that runs when the app loads.
 * 
 * TECHNICAL IMPLEMENTATION:
 * - Uses React 18's createRoot API for concurrent rendering
 * - Loads Inter font family for consistent typography
 * - Imports global styles and design system
 * 
 * PERFORMANCE CONSIDERATIONS:
 * - Inter font weights (400, 500, 600, 700) are bundled for optimal loading
 * - Self-hosted fonts eliminate external font API calls
 * - CSS is processed through Tailwind for tree-shaking
 * 
 * FONT STRATEGY:
 * - Regular (400): Body text
 * - Medium (500): Subtle emphasis
 * - Semibold (600): Headings and UI elements
 * - Bold (700): Hero text and primary CTAs
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css"; // Global styles and design system
import "@fontsource/inter/400.css";  // Regular weight
import "@fontsource/inter/500.css";  // Medium weight
import "@fontsource/inter/600.css";  // Semibold weight
import "@fontsource/inter/700.css";  // Bold weight

// Mount React application to DOM root element
createRoot(document.getElementById("root")!).render(<App />);
