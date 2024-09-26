const { sendError } = require("./CommonUtils.js");
const jwt = require('jsonwebtoken')
const config = require('config');
const jwtSecret = config.get('JWTSECRET');
const client = require("./redisClient.js");

exports.verifyToken = async (req, res) => {
    try {

        let token = req.headers.authorization;

        if (!token) {
            return sendError(req, res, {
                message: "Access denied. No token provided.",
            }, 403);
        }

        let BearerToken = token.replace("Bearer ", "");
        console.log('Bearer token:', BearerToken);

        const inDenyList = await client.sIsMember("blackList", `bl_${BearerToken}`);
        if (inDenyList) {
            return sendError(req, res, { message: "Access denied" }, 403);
        }

        const decoded = jwt.verify(BearerToken, jwtSecret);

        return decoded;
        
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            sendError(req, res, { message: "Unauthorized! Access denied." }, 401);
        } else {
            sendError(req, res, { message: "Invalid token." }, 403);
        }
        return null; 
    }
};