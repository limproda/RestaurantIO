// Siempre devuelve un número negativo o cero
export function toNegative(val) {
  const num = Number(val) || 0;
  return -Math.abs(num);
}