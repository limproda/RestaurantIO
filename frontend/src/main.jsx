import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Theme from './theme/theme.js'
import { ThemeProvider } from '@mui/material/styles'
import { AuthProvider } from './contexts/AuthContext.jsx'
import App from './App.jsx'
import './styles/main.css'

createRoot(document.getElementById('root')).render(
  // El themeProvider permite aplicar un tema a toda la aplicación
  <ThemeProvider theme={Theme}>
    {/* El BrowserRouter permite manejar las rutas de la aplicación */}
    <BrowserRouter>
      <AuthProvider>
        {/* El App es el componente principal de la aplicación */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
)