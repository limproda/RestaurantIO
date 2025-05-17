export const menuOptions = {
  // Opciones para el caso del administrador
    administrador: [
      { name: "Panel",          icon: "HomeIcon",             path: "/admin/dashboard" },
      { name: "Transacciones",  icon: "DonutSmallRoundedIcon", path: "/admin/transactions" },
      { name: "Empleados",      icon: "PeopleRoundedIcon",     path: "/admin/employees" },
      { name: "Nóminas",        icon: "FilePresentRoundedIcon",path: "/admin/payroll" },
      { name: "Ajustes",        icon: "SettingsIcon",         path: "/admin/settings" },
      { name: "Cerrar Sesión",  icon: "LogoutIcon",           path: "/login"},
    ],
  // Opciones para el caso del empleado
    empleado: [
      { name: "Panel",          icon: "HomeIcon",             path: "/employee/dashboard" },
      { name: "Ver horas",          icon: "CalendarMonthIcon",    path: "/employee/punches/working-time" },
      { name: "Turnos",         icon: "AccessTimeIcon",       path: "/employee/punch" },
      { name: "Nóminas",        icon: "FilePresentRoundedIcon",path: "/employee/payroll" },
      { name: "Ajustes",        icon: "SettingsIcon",         path: "/employee/settings" },
      { name: "Cerrar Sesión",  icon: "LogoutIcon",           path: "/login"},
    ],
  };