import React, { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export function PasswordField({
  name,
  label = "Contraseña",
  placeholder = "Escribe tu contraseña",
  value,
  onChange,
  required = false,
}) {
  const [show, setShow] = useState(false); // Controla la visibilidad del componente
  const toggleShow = () => setShow((s) => !s); // Invierte el estado de visibilidad
  const handleMouseDownPassword = (e) => e.preventDefault();
  const handleMouseUpPassword = (e) => e.preventDefault();

  return (
    <TextField
      type={show ? "text" : "password"} // El tipo del componente se cambia para mostrar o no el texto en base al estado de show
      name={name}
      label={label}
      value={value}
      required={required}
      placeholder={placeholder}
      onChange={onChange}
      fullWidth
      // Gestión de la visibilidad de la contraseña
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={toggleShow} // Si se pulsa, se cambia el estado de la visibilidad de la contraseña
                onMouseDown={handleMouseDownPassword}
                onMouseUp={handleMouseUpPassword}
                edge="end"
                aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {show ? <VisibilityOff /> : <Visibility />} {/*Icono según la visibilidad*/}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
