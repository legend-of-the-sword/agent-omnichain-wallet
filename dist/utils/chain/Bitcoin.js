"use strict";
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
exports.Bitcoin = void 0;
var bitcoin = __importStar(require("bitcoinjs-lib"));
var axios_1 = __importDefault(require("axios"));
var signer_1 = require("../contract/signer");
var ethers_1 = require("ethers");
var Link_1 = __importDefault(require("@/components/Link"));
var react_toastify_1 = require("react-toastify");
var kdf_1 = require("../kdf");
var Bitcoin = /** @class */ (function () {
    /**
     * Constructs a new Bitcoin instance with the provided configuration.
     *
     * @param {Object} config - The configuration object for the Bitcoin instance.
     * @param {"bitcoin" | "testnet"} config.networkType - The type of Bitcoin network (mainnet or testnet).
     * @param {string} config.rpcEndpoint - The endpoint URL for the Bitcoin RPC interface.
     * @param {string} config.scanUrl - The URL for the blockchain explorer to view transactions.
     * @param {string} config.name - The name of the Bitcoin network (e.g., Bitcoin, Testnet).
     */
    function Bitcoin(config) {
        this.network =
            config.networkType === "testnet"
                ? bitcoin.networks.testnet
                : bitcoin.networks.bitcoin;
        this.rpcEndpoint = config.rpcEndpoint;
        this.scanUrl = config.scanUrl;
        this.name = config.name;
    }
    /**
     * Converts a value from satoshis to bitcoins.
     *
     * @param {number} satoshis - The amount in satoshis to convert.
     * @returns {number} The equivalent amount in bitcoins.
     */
    Bitcoin.toBTC = function (satoshis) {
        return satoshis / 100000000;
    };
    /**
     * Converts a value from bitcoins to satoshis.
     *
     * @param {number} btc - The amount in bitcoins to convert.
     * @returns {number} The equivalent amount in satoshis.
     */
    Bitcoin.toSatoshi = function (btc) {
        return btc * 100000000;
    };
    /**
     * Fetches the balance for a given Bitcoin address.
     * This function retrieves all unspent transaction outputs (UTXOs) for the address,
     * sums their values to calculate the total balance, and returns it as a string.
     *
     * @param {string} address - The Bitcoin address for which to fetch the balance.
     * @returns {Promise<string>} A promise that resolves to the balance of the address as a string.
     */
    Bitcoin.prototype.fetchBalance = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var utxos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchUTXOs(address)];
                    case 1:
                        utxos = _a.sent();
                        return [2 /*return*/, Bitcoin.toBTC(utxos.reduce(function (acc, utxo) { return acc + utxo.value; }, 0)).toString()];
                }
            });
        });
    };
    /**
     * Fetches the Unspent Transaction Outputs (UTXOs) for a given Bitcoin address.
     *
     * @param {string} address - The Bitcoin address for which to fetch the UTXOs.
     * @returns {Promise<Array<{ txid: string; vout: number; value: number }>>} A promise that resolves to an array of UTXOs.
     * Each UTXO is represented as an object containing the transaction ID (`txid`), the output index within that transaction (`vout`),
     * and the value of the output in satoshis (`value`).
     */
    Bitcoin.prototype.fetchUTXOs = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var response, utxos, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.rpcEndpoint, "address/").concat(address, "/utxo"))];
                    case 1:
                        response = _a.sent();
                        utxos = response.data.map(function (utxo) { return ({
                            txid: utxo.txid,
                            vout: utxo.vout,
                            value: utxo.value,
                            script: utxo.script,
                        }); });
                        return [2 /*return*/, utxos];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Failed to fetch UTXOs:", error_1);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Fetches the current fee rate from the Bitcoin network.
     * This method queries the RPC endpoint for fee estimates and returns the fee rate
     * expected for a transaction to be confirmed within a certain number of blocks.
     * The confirmation target is set to 6 blocks by default, which is commonly used
     * for a balance between confirmation time and cost.
     *
     * @returns {Promise<number>} A promise that resolves to the fee rate in satoshis per byte.
     * @throws {Error} Throws an error if the fee rate data for the specified confirmation target is missing.
     */
    Bitcoin.prototype.fetchFeeRate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, confirmationTarget;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get("".concat(this.rpcEndpoint, "fee-estimates"))];
                    case 1:
                        response = _a.sent();
                        confirmationTarget = 6;
                        if (response.data && response.data[confirmationTarget]) {
                            return [2 /*return*/, response.data[confirmationTarget]];
                        }
                        else {
                            throw new Error("Fee rate data for ".concat(confirmationTarget, " blocks confirmation target is missing in the response"));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Fetches a Bitcoin transaction by its ID and constructs a transaction object.
     * This function retrieves the transaction details from the blockchain using the RPC endpoint,
     * then parses the input and output data to construct a `bitcoin.Transaction` object.
     *
     * @param {string} transactionId - The ID of the transaction to fetch.
     * @returns {Promise<bitcoin.Transaction>} A promise that resolves to a `bitcoin.Transaction` object representing the fetched transaction.
     */
    Bitcoin.prototype.fetchTransaction = function (transactionId) {
        return __awaiter(this, void 0, void 0, function () {
            var data, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get("".concat(this.rpcEndpoint, "tx/").concat(transactionId))];
                    case 1:
                        data = (_a.sent()).data;
                        tx = new bitcoin.Transaction();
                        tx.version = data.version;
                        tx.locktime = data.locktime;
                        data.vin.forEach(function (vin) {
                            var txHash = Buffer.from(vin.txid, "hex").reverse();
                            var vout = vin.vout;
                            var sequence = vin.sequence;
                            var scriptSig = vin.scriptsig
                                ? Buffer.from(vin.scriptsig, "hex")
                                : undefined;
                            tx.addInput(txHash, vout, sequence, scriptSig);
                        });
                        data.vout.forEach(function (vout) {
                            var value = vout.value;
                            var scriptPubKey = Buffer.from(vout.scriptpubkey, "hex");
                            tx.addOutput(scriptPubKey, value);
                        });
                        data.vin.forEach(function (vin, index) {
                            if (vin.witness && vin.witness.length > 0) {
                                var witness = vin.witness.map(function (w) { return Buffer.from(w, "hex"); });
                                tx.setWitness(index, witness);
                            }
                        });
                        return [2 /*return*/, tx];
                }
            });
        });
    };
    /**
     * Derives a production Bitcoin address and its corresponding public key from a given signer ID, derivation path, and root public key.
     * This method utilizes the KeyDerivation utility to compute an epsilon value based on the signer ID and path, which is then used
     * to derive a new public key from the provided root public key. The derived public key is used to generate a Bitcoin address
     * in the testnet network using the P2PKH (Pay to Public Key Hash) method. If the address cannot be derived, an error is thrown.
     *
     * @param {string} signerId - The unique identifier of the signer.
     * @param {string} path - The derivation path.
     * @param {string} derivationRootPublicKey - The root public key for derivation.
     * @returns {{ address: string; publicKey: Buffer }} An object containing the derived Bitcoin address and its corresponding public key.
     * @throws {Error} Throws an error if unable to derive the Bitcoin address.
     */
    Bitcoin.deriveProductionAddress = function (signerId, path, derivationRootPublicKey) {
        var epsilon = kdf_1.KeyDerivation.deriveEpsilon(signerId, path);
        var derivedKey = kdf_1.KeyDerivation.deriveKey(derivationRootPublicKey, epsilon);
        var publicKeyBuffer = Buffer.from(derivedKey, "hex");
        var address = bitcoin.payments.p2pkh({
            pubkey: publicKeyBuffer,
            network: bitcoin.networks.testnet,
        }).address;
        if (!address) {
            throw new Error("Unable to derive BTC address");
        }
        return {
            address: address,
            publicKey: publicKeyBuffer,
        };
    };
    /**
     * Joins the r and s components of a signature into a single Buffer.
     * This function takes an object containing the r and s components of a signature,
     * pads them to ensure they are each 64 characters long, concatenates them,
     * and then converts the concatenated string into a Buffer. This Buffer represents
     * the full signature in hexadecimal format. If the resulting Buffer is not exactly
     * 64 bytes long, an error is thrown.
     *
     * @param {Object} signature - An object containing the r and s components of a signature.
     * @param {string} signature.r - The r component of the signature.
     * @param {string} signature.s - The s component of the signature.
     * @returns {Buffer} A Buffer representing the concatenated r and s components of the signature.
     * @throws {Error} Throws an error if the resulting Buffer is not exactly 64 bytes long.
     */
    Bitcoin.joinSignature = function (signature) {
        var r = signature.r.padStart(64, "0");
        var s = signature.s.padStart(64, "0");
        var rawSignature = Buffer.from(r + s, "hex");
        if (rawSignature.length !== 64) {
            throw new Error("Invalid signature length.");
        }
        return rawSignature;
    };
    /**
     * Sends a signed transaction to the Bitcoin network.
     * This function takes the hexadecimal representation of a signed transaction
     * and broadcasts it to the network using a proxy URL to bypass CORS restrictions.
     * It logs the transaction ID if the broadcast is successful, or an error message otherwise.
     *
     * @param {string} txHex - The hexadecimal string of the signed transaction.
     * @param {Object} [options] - Optional parameters.
     * @param {boolean} [options.proxy=false] - Whether to use a proxy URL for the transaction broadcast.
     * @returns {Promise<string>} A promise that resolves with the txid once the transaction is successfully broadcast
     */
    Bitcoin.prototype.sendTransaction = function (txHex, options) {
        return __awaiter(this, void 0, void 0, function () {
            var proxyUrl, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        proxyUrl = (options === null || options === void 0 ? void 0 : options.proxy) ? "https://corsproxy.io/?" : "";
                        return [4 /*yield*/, axios_1.default.post("".concat(proxyUrl).concat(this.rpcEndpoint, "tx"), txHex)];
                    case 1:
                        response = _a.sent();
                        if (response.status === 200) {
                            return [2 /*return*/, response.data];
                        }
                        else {
                            console.error("Failed to broadcast transaction:", response.data);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error broadcasting transaction:", error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handles the process of creating and broadcasting a Bitcoin transaction.
     * This function takes the recipient's address, the amount to send, the account details,
     * and the derived path for the account to create a transaction. It then signs the transaction
     * using the account's private key and broadcasts it to the Bitcoin network.
     *
     * @param {Object} data - The transaction data.
     * @param {string} data.to - The recipient's Bitcoin address.
     * @param {number} data.value - The amount of Bitcoin to send (in BTC).
     * @param {Account} account - The NEAR account object
     * @param {string} keyPath - Specifies the key derivation path.
     */
    Bitcoin.prototype.handleTransaction = function (data, account, keyPath, derivationRootPublicKey) {
        return __awaiter(this, void 0, void 0, function () {
            var satoshis, _a, address, publicKey, utxos, feeRate, psbt, totalInput, estimatedSize, fee, change, mpcKeyPair, txid;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        satoshis = Bitcoin.toSatoshi(data.value);
                        _a = Bitcoin.deriveProductionAddress(account.accountId, keyPath, derivationRootPublicKey), address = _a.address, publicKey = _a.publicKey;
                        return [4 /*yield*/, this.fetchUTXOs(address)];
                    case 1:
                        utxos = _b.sent();
                        return [4 /*yield*/, this.fetchFeeRate()];
                    case 2:
                        feeRate = _b.sent();
                        psbt = new bitcoin.Psbt({ network: this.network });
                        totalInput = 0;
                        return [4 /*yield*/, Promise.all(utxos.map(function (utxo) { return __awaiter(_this, void 0, void 0, function () {
                                var transaction, inputOptions;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            totalInput += utxo.value;
                                            return [4 /*yield*/, this.fetchTransaction(utxo.txid)];
                                        case 1:
                                            transaction = _a.sent();
                                            if (transaction.outs[utxo.vout].script.includes("0014")) {
                                                inputOptions = {
                                                    hash: utxo.txid,
                                                    index: utxo.vout,
                                                    witnessUtxo: {
                                                        script: transaction.outs[utxo.vout].script,
                                                        value: utxo.value,
                                                    },
                                                };
                                            }
                                            else {
                                                inputOptions = {
                                                    hash: utxo.txid,
                                                    index: utxo.vout,
                                                    nonWitnessUtxo: Buffer.from(transaction.toHex(), "hex"),
                                                };
                                            }
                                            psbt.addInput(inputOptions);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 3:
                        _b.sent();
                        psbt.addOutput({
                            address: data.to,
                            value: satoshis,
                        });
                        estimatedSize = utxos.length * 148 + 2 * 34 + 10;
                        fee = estimatedSize * (feeRate + 3);
                        change = totalInput - satoshis - fee;
                        if (change > 0) {
                            psbt.addOutput({
                                address: address,
                                value: change,
                            });
                        }
                        mpcKeyPair = {
                            publicKey: publicKey,
                            sign: function (transactionHash) { return __awaiter(_this, void 0, void 0, function () {
                                var signature;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, (0, signer_1.signMPC)(account, Array.from(ethers_1.ethers.getBytes(transactionHash)), keyPath)];
                                        case 1:
                                            signature = _a.sent();
                                            if (!signature) {
                                                throw new Error("Failed to sign transaction");
                                            }
                                            return [2 /*return*/, Buffer.from(Bitcoin.joinSignature(signature))];
                                    }
                                });
                            }); },
                        };
                        return [4 /*yield*/, Promise.all(utxos.map(function (_, index) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, psbt.signInputAsync(index, mpcKeyPair)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 4:
                        _b.sent();
                        psbt.finalizeAllInputs();
                        return [4 /*yield*/, this.sendTransaction(psbt.extractTransaction().toHex(), {
                                proxy: true,
                            })];
                    case 5:
                        txid = _b.sent();
                        if (txid) {
                            react_toastify_1.toast.success(React.createElement("span", null,
                                "View on ",
                                this.name,
                                ":",
                                " ",
                                React.createElement(Link_1.default, { href: "".concat(this.scanUrl, "/tx/").concat(txid), target: "_blank", rel: "noopener noreferrer" }, "Transaction Details")));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Bitcoin;
}());
exports.Bitcoin = Bitcoin;
