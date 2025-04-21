import { menuOptions } from "./menuOptions";
import { useRole } from "../role/useRole";

// En base al rol del usuario, usamos unas opciones u otras
export function usePages() {
  const { user } = useRole();
  const roleKey = user?.role?.trim().toLowerCase();
  return menuOptions[roleKey] || [];
}
