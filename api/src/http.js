export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function requireRole(role) {
  return (req, _res, next) => {
    if (req.user.role !== role) throw new HttpError(403, "Acción no permitida para este rol.");
    next();
  };
}

export function findRecord(records, id, message) {
  const record = records.find((item) => item.id === id);
  if (!record) throw new HttpError(404, message);
  return record;
}

export function requiredText(value, label, max = 200) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) {
    throw new HttpError(400, `${label} debe tener entre 1 y ${max} caracteres.`);
  }
  return value.trim();
}
