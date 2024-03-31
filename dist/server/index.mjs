import { initTRPC } from "@trpc/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { z } from "zod";
import * as EVM from "../utils/chain/EVM.js";
import * as Bitcoin from "../utils/chain/Bitcoin.js";
import { KeyPair, connect, keyStores } from "near-api-js";
import { Transaction } from "bitcoinjs-lib";
if (!process.env.NEXT_PUBLIC_NEAR_PRIVATE_KEY ||
    !process.env.NEXT_PUBLIC_NEAR_ACCOUNT_ID) {
    throw new Error("No private key or account id found in environment");
}
const keyPair = KeyPair.fromString(process.env.NEXT_PUBLIC_NEAR_PRIVATE_KEY);
const keyStore = new keyStores.InMemoryKeyStore();
keyStore.setKey("testnet", process.env.NEXT_PUBLIC_NEAR_ACCOUNT_ID, keyPair);
const config = {
    networkId: "testnet",
    keyStore,
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
};
const connection = await connect(config);
const account = await connection.account(process.env.NEXT_PUBLIC_NEAR_ACCOUNT_ID);
const MPC_PUBLIC_KEY = "secp256k1:4HFcTSodRLVCGNVcGc4Mf2fwBBBxv9jxkGdiW2S2CA1y6UpVVRWKj6RX7d7TDt65k2Bj3w9FU4BGtt43ZvuhCnNt";
const chainsConfig = {
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
const t = initTRPC.create();
const publicProcedure = t.procedure;
const router = t.router;
const ethChain = new EVM(chainsConfig.ethereum);
const btcChain = new Bitcoin(chainsConfig.btc);
const appRouter = router({
    getEthWallet: publicProcedure
        .input(z
        .object({
        path: z.string(),
    })
        .nullish())
        .query(({ input }) => {
        // This is what you're returning to your client
        let address = EVM.deriveProductionAddress(account.accountId, input?.path, MPC_PUBLIC_KEY);
        return {
            wallet: `0x${address}`,
            // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
        };
    }),
    getBitcoinWallet: publicProcedure
        .input(z
        .object({
        path: z.string().nullish(),
    })
        .nullish())
        .query(({ input }) => {
        let address = Bitcoin.deriveProductionAddress(account.accountId, input?.path, MPC_PUBLIC_KEY).address;
        // This is what you're returning to your client
        return {
            wallet: `0x${address}`,
            // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
        };
    }),
    ethTx: publicProcedure
        // This is the input schema of your procedure
        // 💡 Tip: Try changing this and see type errors on the client straight away
        .input(z
        .object({
        to: z.string(),
        amount: z.string().nullish(),
        data: z.string().nullish(),
        path: z.string(),
    })
        .nullish())
        .mutation(async ({ input }) => {
        let txdata = { to: input?.to, value: input?.amount, tx: input?.data };
        let x = new Transaction;
        let txn = await ethChain.handleTransaction(txdata, account, input?.path, MPC_PUBLIC_KEY);
        // This is what you're returning to your client
        return {
            tx: txn?.signature
            // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
        };
    }),
    btcTx: publicProcedure
        // This is the input schema of your procedure
        // 💡 Tip: Try changing this and see type errors on the client straight away
        .input(z
        .object({
        to: z.string(),
        amount: z.number().nullish(),
        path: z.string(),
    })
        .nullish())
        .mutation(async ({ input }) => {
        let data = { to: input?.to, value: input?.amount };
        let txn = await btcChain.handleTransaction(data, account, input?.path, MPC_PUBLIC_KEY);
        // This is what you're returning to your client
        return {
            tx: `${txn}`,
            // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
        };
    }),
});
// create server
createHTTPServer({
    middleware: cors(),
    router: appRouter,
    createContext() {
        console.log("context 3");
        return {};
    },
}).listen(2022);
