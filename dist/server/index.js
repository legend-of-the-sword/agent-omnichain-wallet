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
var server_1 = require("@trpc/server");
var standalone_1 = require("@trpc/server/adapters/standalone");
var cors_1 = __importDefault(require("cors"));
var zod_1 = require("zod");
var EVM_jsx_1 = __importDefault(require("../utils/chain/EVM.jsx"));
var Bitcoin_jsx_1 = require("../utils/chain/Bitcoin.jsx");
var near_api_js_1 = require("near-api-js");
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
if (!process.env.NEXT_PUBLIC_NEAR_PRIVATE_KEY ||
    !process.env.NEXT_PUBLIC_NEAR_ACCOUNT_ID) {
    throw new Error("No private key or account id found in environment");
}
var keyPair = near_api_js_1.KeyPair.fromString(process.env.NEXT_PUBLIC_NEAR_PRIVATE_KEY);
var keyStore = new near_api_js_1.keyStores.InMemoryKeyStore();
keyStore.setKey("testnet", process.env.NEXT_PUBLIC_NEAR_ACCOUNT_ID, keyPair);
var config = {
    networkId: "testnet",
    keyStore: keyStore,
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
};
var connection = await (0, near_api_js_1.connect)(config);
var account = await connection.account(process.env.NEXT_PUBLIC_NEAR_ACCOUNT_ID);
var MPC_PUBLIC_KEY = "secp256k1:4HFcTSodRLVCGNVcGc4Mf2fwBBBxv9jxkGdiW2S2CA1y6UpVVRWKj6RX7d7TDt65k2Bj3w9FU4BGtt43ZvuhCnNt";
var chainsConfig = {
    ethereum: {
        providerUrl: "https://sepolia.infura.io/v3/6df51ccaa17f4e078325b5050da5a2dd",
        scanUrl: "https://sepolia.etherscan.io",
        name: "ETH",
    },
    bsc: {
        providerUrl: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
        scanUrl: "https://testnet.bscscan.com",
        name: "BNB",
    },
    btc: {
        name: "BTC",
        networkType: "testnet",
        // API ref: https://github.com/Blockstream/esplora/blob/master/API.md
        rpcEndpoint: "https://blockstream.info/testnet/api/",
        scanUrl: "https://blockstream.info/testnet",
    },
};
var Chain;
(function (Chain) {
    Chain["ETH"] = "ETH";
    Chain["BNB"] = "BNB";
    Chain["BTC"] = "BTC";
})(Chain || (Chain = {}));
var t = server_1.initTRPC.create();
var publicProcedure = t.procedure;
var router = t.router;
var ethChain = new EVM_jsx_1.default(chainsConfig.ethereum);
var btcChain = new Bitcoin_jsx_1.Bitcoin(chainsConfig.btc);
var appRouter = router({
    getEthWallet: publicProcedure
        .input(zod_1.z
        .object({
        path: zod_1.z.string(),
    })
        .nullish())
        .query(function (_a) {
        var input = _a.input;
        // This is what you're returning to your client
        var address = EVM_jsx_1.default.deriveProductionAddress(account.accountId, input === null || input === void 0 ? void 0 : input.path, MPC_PUBLIC_KEY);
        return {
            wallet: "0x".concat(address),
            // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
        };
    }),
    getBitcoinWallet: publicProcedure
        .input(zod_1.z
        .object({
        path: zod_1.z.string().nullish(),
    })
        .nullish())
        .query(function (_a) {
        var input = _a.input;
        var address = Bitcoin_jsx_1.Bitcoin.deriveProductionAddress(account.accountId, input === null || input === void 0 ? void 0 : input.path, MPC_PUBLIC_KEY).address;
        // This is what you're returning to your client
        return {
            wallet: "0x".concat(address),
            // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
        };
    }),
    ethTx: publicProcedure
        // This is the input schema of your procedure
        // 💡 Tip: Try changing this and see type errors on the client straight away
        .input(zod_1.z
        .object({
        to: zod_1.z.string(),
        amount: zod_1.z.string().nullish(),
        data: zod_1.z.string().nullish(),
        path: zod_1.z.string(),
    })
        .nullish())
        .mutation(function (_a) {
        var input = _a.input;
        return __awaiter(void 0, void 0, void 0, function () {
            var txdata, x, txn;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        txdata = { to: input === null || input === void 0 ? void 0 : input.to, value: input === null || input === void 0 ? void 0 : input.amount, tx: input === null || input === void 0 ? void 0 : input.data };
                        x = new bitcoinjs_lib_1.Transaction;
                        return [4 /*yield*/, ethChain.handleTransaction(txdata, account, input === null || input === void 0 ? void 0 : input.path, MPC_PUBLIC_KEY)];
                    case 1:
                        txn = _b.sent();
                        // This is what you're returning to your client
                        return [2 /*return*/, {
                                tx: txn === null || txn === void 0 ? void 0 : txn.signature
                                // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
                            }];
                }
            });
        });
    }),
    btcTx: publicProcedure
        // This is the input schema of your procedure
        // 💡 Tip: Try changing this and see type errors on the client straight away
        .input(zod_1.z
        .object({
        to: zod_1.z.string(),
        amount: zod_1.z.number().nullish(),
        path: zod_1.z.string(),
    })
        .nullish())
        .mutation(function (_a) {
        var input = _a.input;
        return __awaiter(void 0, void 0, void 0, function () {
            var data, txn;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        data = { to: input === null || input === void 0 ? void 0 : input.to, value: input === null || input === void 0 ? void 0 : input.amount };
                        return [4 /*yield*/, btcChain.handleTransaction(data, account, input === null || input === void 0 ? void 0 : input.path, MPC_PUBLIC_KEY)];
                    case 1:
                        txn = _b.sent();
                        // This is what you're returning to your client
                        return [2 /*return*/, {
                                tx: "".concat(txn),
                                // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
                            }];
                }
            });
        });
    }),
});
// create server
(0, standalone_1.createHTTPServer)({
    middleware: (0, cors_1.default)(),
    router: appRouter,
    createContext: function () {
        console.log("context 3");
        return {};
    },
}).listen(2022);
