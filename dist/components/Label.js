"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var Label = function (_a) {
    var children = _a.children, className = _a.className;
    return (react_1.default.createElement("label", { className: "block text-white text-sm font-bold mb-2 ".concat(className) }, children));
};
exports.default = Label;
