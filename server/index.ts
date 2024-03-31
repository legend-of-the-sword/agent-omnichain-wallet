import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';
import { z } from 'zod';

import initNear from "../config/near";
import { Account, Near } from "near-api-js";
import EVM from "../utils/chain/EVM";
import { Bitcoin } from "../utils/chain/Bitcoin";

import {
  encodeSignedDelegate,
  Action,
  FunctionCall,
} from "@near-js/transactions";

import { getRootPublicKey } from "../utils/contract/signer";

const MPC_PUBLIC_KEY =
  "secp256k1:4HFcTSodRLVCGNVcGc4Mf2fwBBBxv9jxkGdiW2S2CA1y6UpVVRWKj6RX7d7TDt65k2Bj3w9FU4BGtt43ZvuhCnNt";

const chainsConfig = {
  ethereum: {
    providerUrl:
      "https://sepolia.infura.io/v3/6df51ccaa17f4e078325b5050da5a2dd",
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
    networkType: "testnet" as const,
    // API ref: https://github.com/Blockstream/esplora/blob/master/API.md
    rpcEndpoint: "https://blockstream.info/testnet/api/",
    scanUrl: "https://blockstream.info/testnet",
  },
};

enum Chain {
  ETH = "ETH",
  BNB = "BNB",
  BTC = "BTC",
}

const t = initTRPC.create();
const {connection, account} = await initNear();
const publicProcedure = t.procedure;
const router = t.router;
const ethChain =  new EVM(chainsConfig.ethereum);
const btcChain = new Bitcoin(chainsConfig.btc);
const appRouter = router({
  getEthWallet: publicProcedure
  .input(
    z
      .object({
        path: z.string(),
      })
      .nullish(),
  )
  .query(({ input }) => {
    // This is what you're returning to your client
    let address = EVM.deriveProductionAddress(
      account.accountId,
      input?.path!,
      MPC_PUBLIC_KEY
    );
    return {
      wallet: `0x${address}`,
      // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
    };
  }),
 
  getBitcoinWallet: publicProcedure
  .input(
    z
      .object({
        path: z.string().nullish(),
      })
      .nullish(),
  )
  .query(({ input }) => {
    let address = Bitcoin.deriveProductionAddress(
      account.accountId,
      input?.path!,
      MPC_PUBLIC_KEY
    ).address;
    // This is what you're returning to your client
    return {
      wallet: `0x${address}`,
      // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
    };
  }),
  ethTx: publicProcedure
    // This is the input schema of your procedure
    // 💡 Tip: Try changing this and see type errors on the client straight away
    .input(
      z
        .object({
          data: z.string().nullish(),
          path: z.string(),
        })
        .nullish(),
    )
    .mutation(async ({ input }) => {
     let txn = await ethChain.handleTransaction(
        input?.data!,
        account,
        input?.path!,
        MPC_PUBLIC_KEY
      );
      // This is what you're returning to your client
      return {
        tx: `${txn ?? 'none'}`,
        // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
      };
    }),
    btcTx: publicProcedure
    // This is the input schema of your procedure
    // 💡 Tip: Try changing this and see type errors on the client straight away
    .input(
      z
        .object({
          data: z.string().nullish(),
          path: z.string(),
        })
        .nullish(),
    )
    .mutation(async ({ input }) => {
     let txn = await btcChain.handleTransaction(
        input?.data!,
        account,
        input?.path!,
        MPC_PUBLIC_KEY
      );
      // This is what you're returning to your client
      return {
        tx: `${txn ?? 'none'}`,
        // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
      };
    }),
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

// create server
createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext() {
    console.log('context 3');
    return {};
  },
}).listen(2022);
