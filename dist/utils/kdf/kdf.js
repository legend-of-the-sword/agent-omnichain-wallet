"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveKey = exports.deriveEpsilon = void 0;
var elliptic_1 = require("elliptic");
var bs58_1 = __importDefault(require("bs58"));
var bn_js_1 = __importDefault(require("bn.js"));
var crypto_1 = __importDefault(require("crypto"));
var EPSILON_DERIVATION_PREFIX = "near-mpc-recovery v0.1.0 epsilon derivation:";
var secp256k1 = new elliptic_1.ec("secp256k1");
function deriveEpsilon(signerId, path) {
    var derivationPath = "".concat(EPSILON_DERIVATION_PREFIX).concat(signerId, ",").concat(path);
    var hash = crypto_1.default.createHash("sha256").update(derivationPath).digest();
    var ret = new bn_js_1.default(hash, "le").toString("hex");
    return ret;
}
exports.deriveEpsilon = deriveEpsilon;
function deriveKey(publicKeyStr, epsilon) {
    var base58PublicKey = publicKeyStr.split(":")[1];
    var decodedPublicKey = Buffer.from(bs58_1.default.decode(base58PublicKey)).toString("hex");
    var publicKey = secp256k1.keyFromPublic("04" + decodedPublicKey, "hex");
    var derivedPoint = publicKey.getPublic().add(secp256k1.g.mul(epsilon));
    return derivedPoint.encode("hex", false);
}
exports.deriveKey = deriveKey;
