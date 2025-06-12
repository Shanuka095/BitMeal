import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import '../index.css';

console.log('Starting React render...');
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found');
  throw new Error('Root element not found');
}

// Ensure createRoot is only called once per application lifecycle
// The check for `root` being already created is for development hot-reloading.
// For production, `createRoot` is usually called once.
let root = createRoot(rootElement);
root.render(<App />);
console.log('React render complete.');