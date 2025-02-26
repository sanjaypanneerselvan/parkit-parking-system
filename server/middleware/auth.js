const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    //console.log(token);
    if (!token) return res.status(401).json({ message: 'No token, authorization denied.' });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(decoded);
        req.user = decoded.user;
        //console.log(req.user);
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

const authenticateAdmin = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        req.admin = decoded.admin; // Attach admin ID to request object
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = { authenticateUser, authenticateAdmin };

// console.log(module);
