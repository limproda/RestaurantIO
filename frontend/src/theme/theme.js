import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

const theme = createTheme({
  // Modificaciones de estilos
  components: {
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: "2rem", // Personaliza el margen inferior de los textos de manera automática con gutterBottom
        },
      },
    },
    MuiIconButton: {
      defaultProps: { color: "inherit" },
    },
    MuiTypography: {
      defaultProps: { color: "inherit" },
    },
  },
  // Definición de la paleta de colores
  palette: {
    // Color primario
    primary: {
      lighter: "#66bafd",  // 300 
      light: "#229dfd",   // 500 - Primary
      main: "#1b7cdb",   // 700 
      dark: "#114caa", // 900
      contrastText: "#fff", // - OnPrimary
    },
    // Color secundario
    secondary: {
      light: grey[300],
      main: grey[500],
      dark: grey[700],
      darker: grey[900],
      contrastText: "#000",
    },
    error: {
      main: '#B00020',      // color de error
      contrastText: '#fff'
    },
    success: {
      main: '#388E3C',      // color de éxito
      contrastText: '#fff'
    },
    warning: {
      main: '#F57C00',      // color de advertencia
      contrastText: '#000'
    },
    background: {
      default: '#FAFAFA',     // MATERIAL DESIGN: surface
      paper:   '#FFFFFF'      // MATERIAL DESIGN: surfaceContainer
    },
    text: {
      primary:   '#1C1B1F',   // MATERIAL DESIGN: onSurface
      secondary: '#6C6B70'    // MATERIAL DESIGN: onSurfaceVariant
    },
    gradient: {
      default: "linear-gradient(to right, #4C6EF5, #B197FC)", // Color de fondo degradado
    }, 
    caption: {
      main: '#fff',
    },
  },
  // Definición de la tipografía
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      // Títulos de nivel 1
      fontSize: "2rem",
      fontWeight: 700,
    },
    h2: {
      // Títulos de nivel 2
      fontSize: "1.5rem",
      fontWeight: 700,
    },

    body1: {
      // Texto del cuerpo
      fontSize: "1rem",
      fontWeight: 400,
    },
  },
});

export default theme;

/*
primary -	AppBar, botones principales, enlaces activos
onPrimary	- Texto/iconos sobre primary
primaryContainer - FAB, contenedores clave
onPrimaryContainer - Texto/iconos sobre primaryContainer
secondary - Botones secundarios, chips
onSecondary - Texto/iconos sobre secondary
secondaryContainer - Botones tonales, filtros
onSecondaryContainer - Texto/iconos sobre secondaryContainer
*/ 