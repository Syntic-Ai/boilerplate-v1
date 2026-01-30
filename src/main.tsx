import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize error reporting FIRST
import '@/lib/error-reporter'

createRoot(document.getElementById("root")!).render(<App />);
