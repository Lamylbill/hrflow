import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './components/ui/notification-badge.css'

createRoot(document.getElementById("root")!).render(<App />);
