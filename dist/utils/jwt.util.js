"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshJWT = exports.verifyJWT = exports.signRefreshJWT = exports.signJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
const signJWT = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
exports.signJWT = signJWT;
const signRefreshJWT = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
};
exports.signRefreshJWT = signRefreshJWT;
const verifyJWT = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyJWT = verifyJWT;
const verifyRefreshJWT = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
};
exports.verifyRefreshJWT = verifyRefreshJWT;
//# sourceMappingURL=jwt.util.js.map