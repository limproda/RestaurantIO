import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import NotFound from "../pages/NotFound";

const EmployeeRoute = () => {
    //Uso del contexto de autenticación con la información del usuario
    const { user } = useContext(AuthContext);

    // Si no hay usuario o el rol no es 'empleado', se muestra NotFound
    if (!user || user.role.trim().toLowerCase() !== "empleado") {
        return <NotFound />;
        // ANOTACIÓN: PARA REDIRIGIR A OTRAS RUTA return <Navigate to="/404" />;
    }

    // Si es empleado, renderizamos las rutas hijas
    return <Outlet />;
};

export default EmployeeRoute;
