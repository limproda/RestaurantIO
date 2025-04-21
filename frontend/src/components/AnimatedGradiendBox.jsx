import React, { useEffect, useRef } from 'react';
import { styled, Box } from '@mui/material';
import Granim from 'granim';

// Creación de un nuevo componente a partir de Box
const StyledBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  // Aseguramos que el canvas se posicione detrás del contenido con el zIndex
  '& canvas': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1, // Detrás de todos los elementos
  },
  
}));

const AnimatedGradientBox = ({ children, sx = {}, ...props }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Creación de la instancia de Granim apuntando al canvas del componente
    const granimInstance = new Granim({
      element: canvasRef.current,
      direction: 'diagonal',
      opacity: [1, 1],
      states: {
        "default-state": {
          gradients: [
            ['#00F260', '#0575E6'],
            ['#B3FFAB', '#12FFF7'],
            ['#1A2980', '#26D0CE']
          ],
          transitionSpeed: 4500,
        }
      }
    });

    // Limpieza al desmontar el componente
    return () => {
      granimInstance.destroy();
    };
  }, []);

  // Definición de los estilos para el componente
  const defaultSx = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    py: 4,
  };

  return (
    <StyledBox sx={{ ...defaultSx, ...sx }} {...props}>
      <canvas ref={canvasRef} /> {/* Canvas para el gradiente animado */}
      {children} {/* Contenido del componente */}
    </StyledBox>
  );
};

export default AnimatedGradientBox;