import { useTheme, useMediaQuery } from "@mui/material";

// Devuelve true si la pantalla está por debajo del breakpoint de MUI
export default function useIsSmallScreen() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("md"));
}
