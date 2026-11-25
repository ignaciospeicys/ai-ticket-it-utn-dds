export const statuses = {
  PENDING: "Pendiente de pago",
  CONFIRMED: "Confirmada",
  USED: "Utilizada",
  CANCELED: "Cancelada",
  REFUNDED: "Reembolsada",
};

export const statusTones = {
  PENDING: "amber",
  CONFIRMED: "green",
  USED: "neutral",
  CANCELED: "red",
  REFUNDED: "blue",
};

export const isActive = (purchase) => purchase.status === "PENDING" || purchase.status === "CONFIRMED";
