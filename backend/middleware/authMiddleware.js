const jwt = require("jsonwebtoken");

function authMiddleware(rolesPermitidos = []) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ mensaje: "Token requerido" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (
        rolesPermitidos.length > 0 &&
        !rolesPermitidos.includes(decoded.rol)
      ) {
        return res.status(403).json({ mensaje: "Acceso denegado" });
      }

      next();
    } catch {
      res.status(401).json({ mensaje: "Token inválido" });
    }
  };
}

module.exports = authMiddleware;
