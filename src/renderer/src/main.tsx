import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

// StrictMode intentionally omitted — it causes Babylon.js Engine to be
// created and disposed twice in dev, which breaks WebGL context setup.
ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
