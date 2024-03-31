"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var Loader = function () {
    return (react_1.default.createElement("div", { className: "loader animate-spin rounded-full border-t-2 border-b-2 border-blue-500 h-8 w-8" }));
};
exports.default = Loader;
