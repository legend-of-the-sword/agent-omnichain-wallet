"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRootPublicKey = exports.signMPC = void 0;
var bn_js_1 = __importDefault(require("bn.js"));
/**
 * Signs a payload using a Multi-Party Computation (MPC) approach on the NEAR blockchain.
 *
 * This function sends a request to a smart contract on the NEAR blockchain to sign a given payload.
 * The smart contract, identified by its contract ID, executes the "sign" method with the provided
 * payload and path. The function then processes the result, extracting and decoding the signature
 * components (r, s, v) from the successful response.
 *
 * @param {Account} account - The NEAR account initiating the function call.
 * @param {number[]} payload - The payload to be signed, represented as an array of numbers.
 * @param {string} path - The path parameter to be passed to the smart contract method.
 * @returns {Promise<{v: number, r: string, s: string} | undefined>} An object containing the signature components if successful, otherwise undefined.
 */
function signMPC(account, payload, path) {
    return __awaiter(this, void 0, void 0, function () {
        var result, successValue, decodedValue, parsedJSON;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, account.functionCall({
                        contractId: "multichain-testnet-2.testnet",
                        methodName: "sign",
                        args: {
                            payload: payload.slice().reverse(),
                            path: path,
                        },
                        gas: new bn_js_1.default("300000000000000"),
                        attachedDeposit: new bn_js_1.default("0"),
                    })];
                case 1:
                    result = _a.sent();
                    if ("SuccessValue" in result.status) {
                        successValue = result.status.SuccessValue;
                        decodedValue = Buffer.from(successValue, "base64").toString("utf-8");
                        parsedJSON = JSON.parse(decodedValue);
                        return [2 /*return*/, {
                                r: parsedJSON[0].slice(2),
                                s: parsedJSON[1],
                            }];
                    }
                    return [2 /*return*/, undefined];
            }
        });
    });
}
exports.signMPC = signMPC;
/**
 * Calls the `public_key` method on the contract to retrieve the public key.
 *
 * This function sends a function call to the contract specified by `contractId`,
 * invoking the `public_key` method without any arguments. It then processes the
 * result, attempting to decode the returned SuccessValue as a UTF-8 string to
 * extract the public key.
 *
 * @param {Account} account - The NEAR account object used to interact with the blockchain.
 * @returns {Promise<string | undefined>} The public key as a string if the call is successful, otherwise undefined.
 */
function getRootPublicKey(account) {
    return __awaiter(this, void 0, void 0, function () {
        var result, successValue, publicKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, account.functionCall({
                        contractId: "multichain-testnet-2.testnet",
                        methodName: "public_key",
                        args: {},
                        gas: new bn_js_1.default("300000000000000"),
                        attachedDeposit: new bn_js_1.default("0"),
                    })];
                case 1:
                    result = _a.sent();
                    if ("SuccessValue" in result.status) {
                        successValue = result.status.SuccessValue;
                        publicKey = Buffer.from(successValue, "base64").toString("utf-8");
                        return [2 /*return*/, publicKey.replace(/^"|"$/g, "")];
                    }
                    return [2 /*return*/, undefined];
            }
        });
    });
}
exports.getRootPublicKey = getRootPublicKey;
