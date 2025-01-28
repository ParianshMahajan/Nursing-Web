const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const secret_key=process.env.secret_key;

const jwt=require('jsonwebtoken');
const UserModel = require("../models/UserModel");
const NurseModel = require("../models/NurseModel");
const authModel = require("../models/authModel");

module.exports.protect = async function protect(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: false,
                message: 'Authorization header missing or invalid format'
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: false,
                message: 'No token provided'
            });
        }

        // Verify the token first
        let payload;
        try {
            payload = jwt.verify(token, secret_key);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    status: false,
                    message: 'Token has expired'
                });
            }
            return res.status(401).json({
                status: false,
                message: 'Invalid token'
            });
        }

        // Find valid session
        const auth = await authModel.findOne({ SessionID: token });
        if (!auth) {
            return res.status(401).json({
                status: false,
                message: 'Session not found'
            });
        }

        // Update IP if changed
        const ip = req.headers['x-forwarded-for'] || 
                  req.connection.remoteAddress || 
                  req.socket.remoteAddress || 
                  req.connection.socket?.remoteAddress;

        if (auth.IPV4 !== ip) {
            auth.IPV4 = ip;
            await auth.save();
        }

        // Check user existence and status based on role
        if (payload.Role === "User") {
            const user = await UserModel.findById(payload.uuid);
            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: 'User not found'
                });
            }
            if (user.Ban) {
                return res.status(403).json({
                    status: false,
                    message: 'User is banned'
                });
            }
            req.user = user;
            next();
        } else if (payload.Role === "Nurse") {
            const nurse = await NurseModel.findById(payload.uuid);
            if (!nurse) {
                return res.status(404).json({
                    status: false,
                    message: 'Nurse not found'
                });
            }
            if (nurse.Ban) {
                return res.status(403).json({
                    status: false,
                    message: 'Nurse is banned'
                });
            }
            req.nurse = nurse;
            next();
        } else {
            return res.status(403).json({
                status: false,
                message: 'Invalid role'
            });
        }
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({
            status: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
