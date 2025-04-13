import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  // Modificaciones de estilos
  components: {
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: '2rem', // Personaliza el margen inferior de los textos con la clase gutterBottom
        },
      },
    },
  },
  // Definición de la paleta de colores
  palette: {
    primary: {
      main: '#1976d2', // Color primario o principal
    },
    secondary: {
      main: '#dc004e', // Color secundario
    },
    error: {
      main: '#f44336', // Color de error
    },
    background: {
      default: '#f5f5f5', // Color de fondo por defecto
      gradient: 'linear-gradient(to right, #4C6EF5, #B197FC)', // Color de fondo degradado por defecto
    },
  },
  // Definición de la tipografía
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: { // Títulos de nivel 1
      fontSize: '2rem',
      fontWeight: 700,
    },
    h2: { // Títulos de nivel 2
      fontSize: '1.5rem',
      fontWeight: 700,
    },

    body1: { // Texto del cuerpo
      fontSize: '1rem',
      fontWeight: 400,
    },
  },
})

export default theme