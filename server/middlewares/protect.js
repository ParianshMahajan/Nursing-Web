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
        
        // Check for Bearer token format
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: false,
                message: 'Authorization header missing or invalid format'
            });
        }

        const token = authHeader.split(' ')[1];

        // Retrieve IP address
        const ip =
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket?.remoteAddress;

        if (!token) {
            return res.status(401).json({
                status: false,
                message: 'No token provided'
            });
        }

        // Find session by token and IP
        const auth = await authModel.findOne({ SessionID: token, IPV4: ip });
        if (!auth) {
            return res.status(401).json({
                status: false,
                message: 'Session expired or invalid'
            });
        }

        // Verify the token
        let payload;
        try {
            payload = jwt.verify(token, secret_key);
        } catch (error) {
            return res.status(401).json({
                status: false,
                message: 'Invalid token'
            });
        }

        // Check user role and validity
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
                    message: 'User blocked by admin'
                });
            }
            res.user = user;
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
                    message: 'Nurse blocked by admin'
                });
            }
            res.nurse = nurse;
            next();
        } else {
            return res.status(403).json({
                status: false,
                message: 'Unauthorized role'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};
