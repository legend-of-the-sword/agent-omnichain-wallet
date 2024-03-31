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
var ethers_1 = require("ethers");
var signer_1 = require("../contract/signer");
var link_1 = __importDefault(require("next/link"));
var react_toastify_1 = require("react-toastify");
var kdf_1 = require("../kdf");
var EVM = /** @class */ (function () {
    /**
     * Constructs an EVM instance with the provided configuration.
     *
     * @param {Object} config - The configuration object for the EVM instance.
     * @param {string} config.providerUrl - The URL of the Ethereum JSON RPC provider.
     * @param {string} config.scanUrl - The base URL of the blockchain explorer.
     * @param {string} config.name - The name of the EVM network.
     */
    function EVM(config) {
        this.provider = new ethers_1.ethers.JsonRpcProvider(config.providerUrl);
        this.scanUrl = config.scanUrl;
        this.name = config.name;
    }
    /**
     * Prepares a transaction object for signature by serializing and hashing it.
     *
     * @param {object} transaction - The transaction object to prepare.
     * @returns {string} The hashed transaction ready for signature.
     */
    EVM.prepareTransactionForSignature = function (transaction) {
        var serializedTransaction = ethers_1.ethers.Transaction.from(transaction).unsignedSerialized;
        var transactionHash = ethers_1.ethers.keccak256(serializedTransaction);
        return transactionHash;
    };
    /**
     * Sends a signed transaction to the blockchain.
     *
     * This method takes a transaction object and its corresponding signature,
     * combines them into a single serialized transaction, and broadcasts it to the network
     * using the current provider. If the transaction is successfully broadcasted,
     * it returns the transaction response. If there is an error during the process,
     * it logs the error and throws a custom error message.
     *
     * @param {ethers.TransactionLike} transaction - The transaction object to be sent.
     * @param {ethers.SignatureLike} signature - The signature of the transaction.
     * @returns {Promise<ethers.TransactionResponse>} The response of the broadcasted transaction.
     * @throws {Error} If the transaction fails to be executed or sent.
     */
    EVM.prototype.sendSignedTransaction = function (transaction, signature) {
        return __awaiter(this, void 0, void 0, function () {
            var serializedTransaction;
            return __generator(this, function (_a) {
                try {
                    serializedTransaction = ethers_1.ethers.Transaction.from(__assign(__assign({}, transaction), { signature: signature })).serialized;
                    return [2 /*return*/, this.provider.broadcastTransaction(serializedTransaction)];
                }
                catch (error) {
                    console.error("Transaction execution failed:", error);
                    throw new Error("Failed to send signed transaction.");
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Enhances a transaction with current gas price, estimated gas limit, and chain ID.
     *
     * This method fetches the current gas price and estimates the gas limit required for the transaction.
     * It then returns a new transaction object that includes the original transaction details
     * along with the fetched gas price, estimated gas limit, and the chain ID of the EVM object.
     *
     * @param {ethers.providers.TransactionRequest} transaction - The initial transaction object without gas details.
     * @returns {Promise<ethers.providers.TransactionRequest>} A new transaction object augmented with gas price, gas limit, and chain ID.
     */
    EVM.prototype.attachGasAndNonce = function (transaction) {
        return __awaiter(this, void 0, void 0, function () {
            var feeData, gasLimit, nonce, from, rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.provider.getFeeData()];
                    case 1:
                        feeData = _a.sent();
                        return [4 /*yield*/, this.provider.estimateGas(transaction)];
                    case 2:
                        gasLimit = _a.sent();
                        return [4 /*yield*/, this.provider.getTransactionCount(transaction.from, "latest")];
                    case 3:
                        nonce = _a.sent();
                        from = transaction.from, rest = __rest(transaction, ["from"]);
                        return [2 /*return*/, __assign(__assign({}, rest), { gasPrice: feeData.gasPrice, gasLimit: gasLimit, chainId: this.provider._network.chainId, nonce: nonce, type: 0 })];
                }
            });
        });
    };
    /**
     * Fetches the balance of the given EVM address.
     *
     * This method uses the current provider to query the balance of the specified address.
     * The balance is returned in ethers as a string.
     *
     * @param {string} address - The EVM address to fetch the balance for.
     * @returns {Promise<string>} The balance of the address in ethers.
     */
    EVM.prototype.getBalance = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var balance, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.provider.getBalance(address)];
                    case 1:
                        balance = _a.sent();
                        return [2 /*return*/, ethers_1.ethers.formatEther(balance)];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Failed to fetch balance for address ".concat(address, ":"), error_1);
                        throw new Error("Failed to fetch balance.");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Derives an EVM address from a given signer ID, derivation path, and public key.
     *
     * This method combines the provided signer ID and path to generate an epsilon value,
     * which is then used to derive a new public key. The EVM address is then computed
     * from this derived public key.
     *
     * @param {string} signerId - The unique identifier of the signer.
     * @param {string} path - The derivation path.
     * @param {string} derivationRootPublicKey - The root public key for derivation
     * @returns {string} The derived EVM address.
     *
     * @example
     * const signerId = "felipe.near";
     * const path = ",ethereum,near.org";
     * const derivationRootPublicKey = "secp256k1:37aFybhUHCxRdDkuCcB3yHzxqK7N8EQ745MujyAQohXSsYymVeHzhLxKvZ2qYeRHf3pGFiAsxqFJZjpF9gP2JV5u";
     * const address = deriveProductionAddress(signerId, path, derivationRootPublicKey);
     * console.log(address); // 0x...
     */
    EVM.deriveProductionAddress = function (signerId, path, derivationRootPublicKey) {
        var epsilon = kdf_1.KeyDerivation.deriveEpsilon(signerId, path);
        var derivedKey = kdf_1.KeyDerivation.deriveKey(derivationRootPublicKey, epsilon);
        var publicKeyNoPrefix = derivedKey.startsWith("04")
            ? derivedKey.substring(2)
            : derivedKey;
        var hash = ethers_1.ethers.keccak256(Buffer.from(publicKeyNoPrefix, "hex"));
        return "0x" + hash.substring(hash.length - 40);
    };
    /**
     * Orchestrates the transaction execution process by attaching necessary gas and nonce, signing, and then sending the transaction.
     * This method leverages the provided chain instance, transaction details, account credentials, and a specific derived path
     * to facilitate the execution of a transaction on the blockchain network.
     *
     * @param {Transaction} tx - Contains the transaction details such as the recipient's address and the transaction value.
     * @param {Account} account - Holds the account credentials including the unique account ID.
     * @param {string} keyPath - Specifies the key derivation path.
     * @param {string} derivationRootPublicKey - The root public key for derivation
     * @returns {Promise<void>} A promise that is fulfilled once the transaction has been successfully processed.
     */
    EVM.prototype.handleTransaction = function (tx, account, keyPath, derivationRootPublicKey) {
        return __awaiter(this, void 0, void 0, function () {
            var from, transaction, transactionHash, signature, r_1, s_1, v, transactionResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        from = EVM.deriveProductionAddress(account === null || account === void 0 ? void 0 : account.accountId, keyPath, derivationRootPublicKey);
                        return [4 /*yield*/, this.attachGasAndNonce({
                                from: from,
                                to: tx.to,
                                value: (0, ethers_1.parseEther)(tx.value),
                                data: tx.data || "0x",
                            })];
                    case 1:
                        transaction = _a.sent();
                        transactionHash = EVM.prepareTransactionForSignature(transaction);
                        return [4 /*yield*/, (0, signer_1.signMPC)(account, Array.from(ethers_1.ethers.getBytes(transactionHash)), keyPath)];
                    case 2:
                        signature = _a.sent();
                        if (!signature) return [3 /*break*/, 4];
                        r_1 = "0x".concat(signature.r);
                        s_1 = "0x".concat(signature.s);
                        v = [0, 1].find(function (currV) {
                            var address = ethers_1.ethers.recoverAddress(transactionHash, {
                                r: r_1,
                                s: s_1,
                                v: currV,
                            });
                            return from.toLowerCase() === address.toLowerCase();
                        });
                        if (v === undefined) {
                            throw new Error("Failed to recover address from signature.");
                        }
                        return [4 /*yield*/, this.sendSignedTransaction(transaction, ethers_1.ethers.Signature.from({ r: r_1, s: s_1, v: v }))];
                    case 3:
                        transactionResponse = _a.sent();
                        react_toastify_1.toast.success(React.createElement("span", null,
                            "View on ",
                            this.name,
                            ":",
                            " ",
                            React.createElement(link_1.default, { href: "".concat(this.scanUrl, "/tx/").concat(transactionResponse.hash), target: "_blank", rel: "noopener noreferrer" }, "Transaction Details")));
                        return [2 /*return*/, transactionResponse];
                    case 4: return [2 /*return*/, undefined];
                }
            });
        });
    };
    return EVM;
}());
exports.default = EVM;
