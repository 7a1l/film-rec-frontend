import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { AppRouterProvider } from './app/app-router-provider.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'

createRoot(document.getElementById('root')!).render(
  
  <ThemeProvider defaultTheme="system">
      <StrictMode>
        <AppRouterProvider></AppRouterProvider>
    </StrictMode>
  </ThemeProvider>
)
