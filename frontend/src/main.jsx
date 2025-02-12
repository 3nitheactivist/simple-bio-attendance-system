// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './utils/config/AuthProvider';

import App from './App.jsx'
import './global.css';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>,
)
