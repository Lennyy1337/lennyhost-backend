"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwt = void 0;
const jwtToken_1 = require("../tools/jwtToken");
exports.jwt = new jwtToken_1.jwtToken(process.env.JWT_SECRET);
