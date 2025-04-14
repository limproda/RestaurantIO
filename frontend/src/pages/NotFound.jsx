import React from "react";
import { Container, Typography } from "@mui/material";

const NotFound = () => {
  return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h2" gutterBottom>
        404 Not Found
      </Typography>
      <Typography variant="body1">
        La página a la que intentas acceder no existe o no tienes permisos para verla.
      </Typography>
    </Container>
  );
};

export default NotFound;
