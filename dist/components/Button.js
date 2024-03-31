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
var react_1 = __importDefault(require("react"));
var ai_1 = require("react-icons/ai");
var variantStyles = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-800 hover:bg-gray-700 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
};
var Button = react_1.default.forwardRef(function (_a, ref) {
    var children = _a.children, className = _a.className, isLoading = _a.isLoading, _b = _a.variant, variant = _b === void 0 ? "primary" : _b, props = __rest(_a, ["children", "className", "isLoading", "variant"]);
    return (react_1.default.createElement("button", __assign({ ref: ref, className: "flex items-center justify-center px-4 py-2 border border-gray-600 hover:border-gray-500 rounded shadow leading-tight focus:outline-none focus:shadow-outline ".concat(variantStyles[variant], " ").concat(className) }, props, { disabled: isLoading }), isLoading ? react_1.default.createElement(ai_1.AiOutlineLoading, { className: "animate-spin" }) : children));
});
Button.displayName = "Button";
exports.default = Button;
