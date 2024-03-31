"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var Label_1 = __importDefault(require("./Label"));
var ai_1 = require("react-icons/ai");
var Select = (0, react_1.forwardRef)(function (_a, ref) {
    var options = _a.options, placeholder = _a.placeholder, label = _a.label, rest = __rest(_a, ["options", "placeholder", "label"]);
    return (react_1.default.createElement("div", null,
        label && react_1.default.createElement(Label_1.default, null, label),
        react_1.default.createElement("div", { className: "inline-block relative w-64" },
            react_1.default.createElement("select", __assign({ ref: ref }, rest, { className: "block appearance-none w-full bg-gray-800 text-white border border-gray-600 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" }),
                placeholder && (react_1.default.createElement("option", { value: "", disabled: true, style: { color: "gray" } }, placeholder)),
                options.map(function (option) { return (react_1.default.createElement("option", { key: option.value, value: option.value, style: { color: "black" } }, option.label)); })),
            react_1.default.createElement("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-300" },
                react_1.default.createElement(ai_1.AiOutlineDown, { className: "h-4 w-4" })))));
});
Select.displayName = "Select";
exports.default = Select;
