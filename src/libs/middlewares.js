import jwt from 'jsonwebtoken';

export const validarRegistro = (req, res, next) => {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }
    next();
  };
  

  
export const verificarToken = (req, res, next) => {
      const token = req.header('Authorization')?.split(' ')[1];
  
      if (!token) {
          return res.status(401).json({ error: 'Token no proporcionado' });
      }
  
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
              console.log(err)
              return res.status(403).json({ error: 'Token inválido' });
  
          }
          req.usuario = decoded;
          next();
      });
  };
  

  export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal', detalles: err.message });
};