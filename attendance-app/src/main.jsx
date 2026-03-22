// Import React's StrictMode — it helps catch common mistakes during development
import { StrictMode } from 'react';

// Import createRoot — this is how React 18+ connects to the HTML page
import { createRoot } from 'react-dom/client';

// Import the global CSS reset (minimal styles for the whole page)
import './index.css';

// Import the main App component we built
import App from './App.jsx';

// Step 1: Find the HTML element with id="root" in index.html
const rootElement = document.getElementById('root');

// Step 2: Create a React root attached to that element
const root = createRoot(rootElement);

// Step 3: Render our App inside StrictMode
// StrictMode adds extra checks in development (doesn't affect production)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
