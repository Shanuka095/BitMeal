import { createRoot } from 'react-dom/client';
import App from './App.jsx';

console.log('Starting React render...');
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found');
  throw new Error('Root element not found');
}
const root = createRoot(rootElement);
root.render(<App />);
console.log('React render complete.');