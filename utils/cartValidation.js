function requireId(req, _res, next) {
  const raw = req.body?.id;
  const isValid = (typeof raw === "string" && raw.trim() !== "") || typeof raw === "number";
  if (!isValid) {
    const err = new Error("id must be a non-empty string or number");
    err.status = 400;
    return next(err);
  }
  req.body.id = String(raw).trim();
  next();
}


function requirePositiveInt(field) {
  return (req, _res, next) => {
    const raw = req.body?.[field];

    const n = Number(raw);
    if (!Number.isInteger(n) || n <= 0) {
      const err = new Error(`${field} must be a positive integer`);
      err.status = 400;
      return next(err);
    }

    req.body[field] = n;
    next();
  };
}

module.exports = { requireId, requirePositiveInt };
