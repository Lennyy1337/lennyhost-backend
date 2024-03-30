"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileManager_1 = __importDefault(require("../tools/fileManager"));
const FileManager = new fileManager_1.default("uploads");
exports.default = FileManager;
