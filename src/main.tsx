import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
// import { basePath } from './context/constants.ts'

createRoot(document.getElementById('root')!).render(
  // Temporarily disabled StrictMode to prevent double API calls in development
  // <StrictMode>
    <BrowserRouter basename='/rya/dashboard'>
      <App />
    </BrowserRouter>
  // </StrictMode>,
)
