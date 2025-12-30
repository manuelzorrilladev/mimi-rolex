const jwt = require('jsonwebtoken')
const db = require("../models");
const User = db.user.User;
const Role = db.user.Role;


const isAdmin = async (req, res, next) => {
    const token = req.headers['x-access-token']
    if (!token) return res.status(401).json({ error: "Acceso denegado. No hay token." });


    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findByPk(decoded.id,{
        include: Role
    });
    if (user && user.roles[0].dataValues.name === 'admin') {
        req.user = user;
        next();
    } else {
        res.status(403).json({ error: "Acceso prohibido. Se requieren permisos de administrador." });
    }
}

module.exports = isAdmin