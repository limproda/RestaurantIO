import { useState } from "react";
import { clockPunch, addPunch, editPunch, deletePunch } from "./punchApi";
import { useNotification } from "../../components/NotificationProvider";

export function usePunch() {
  const { notify } = useNotification();
  const [loading, setLoading] = useState(false);

  // Acciones según el modo en el que estemos
  const actions = {
    clock: {
      run: async () => await clockPunch(),
      message: (res) => `Fichaje registrado como ${res.punch.type}`,
    },

    add: {
      run: async ({ employeeId, form }) =>
        addPunch(employeeId, form.type, new Date(form.timestamp)),
      message: () => "Fichaje añadido",
    },

    edit: {
      run: async ({ row, form }) =>
        editPunch(
          form.type === "entrada" ? row.entryId : row.exitId,
          new Date(form.timestamp)
        ),
      message: () => "Fichaje actualizado",
    },

    delete: {
      run: async ({ row, form }) =>
        deletePunch(form.type === "entrada" ? row.entryId : row.exitId),
      message: () => "Fichaje eliminado",
    },
  };

  const submit = async (payload) => {
    const { mode = "clock" } = payload; // Desestructuramos el modo, asignando fichar por defecto
    setLoading(true);
    try {
      const res = await actions[mode].run(payload); // Esperamos por la respuesta
      console.log("Respuesta en submit:", res);
      if (!res.success) throw new Error(res.message); // Si la respuesta es errónea, mandamos mensaje de error
      notify("success", actions[mode].message(res)); // Si la respuesta es correcta, lo notificamos
      return res;
    } catch (err) {
      notify("error", err.message || "Ocurrió un error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, submit };
}
