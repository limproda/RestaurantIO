export const menuOptions = {
  // Opciones para el caso del administrador
    administrador: [
      { name: "Panel",          icon: "HomeIcon",             path: "/admin/dashboard" },
      { name: "Transacciones",  icon: "DonutSmallRoundedIcon", path: "/admin/transactions" },
      { name: "Empleados",      icon: "PeopleRoundedIcon",     path: "/admin/employees" },
      { name: "Nóminas",        icon: "FilePresentRoundedIcon",path: "/admin/payroll" },
      { name: "Ajustes",        icon: "SettingsIcon",         path: "/admin/settings" },
    ],
  // Opciones para el caso del empleado
    empleado: [
      { name: "Panel",          icon: "HomeIcon",             path: "/employee/dashboard" },
      { name: "Horas",          icon: "CalendarMonthIcon",    path: "/employee/hours" },
      { name: "Turnos",         icon: "AccessTimeIcon",       path: "/employee/shifts" },
      { name: "Nóminas",        icon: "FilePresentRoundedIcon",path: "/employee/payroll" },
      { name: "Ajustes",        icon: "SettingsIcon",         path: "/employee/settings" },
    ],
  };